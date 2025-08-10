import { initApp, getDb, exportToCSV, toDateOnlyString, formatCurrency } from "./app.js";

await initApp({ requiredRoles: ["Admin", "Counselor"] });
const db = getDb();

const tbody = document.querySelector("#txTable tbody");
const addBtn = document.getElementById("addTx");
const exportBtn = document.getElementById("exportCSV");

const inputType = document.getElementById("type");
const inputCategory = document.getElementById("category");
const inputDivision = document.getElementById("division");
const inputAmount = document.getElementById("amount");
const inputDate = document.getElementById("date");
const inputNote = document.getElementById("note");

const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const filterDivision = document.getElementById("filterDivision");
const applyFilters = document.getElementById("applyFilters");

let transactions = [];
let unsubscribe = () => {};

addBtn?.addEventListener("click", async () => {
  const type = inputType.value;
  const category = inputCategory.value;
  const division = inputDivision.value || null;
  const amount = Number(inputAmount.value || 0);
  const date = inputDate.value ? new Date(inputDate.value) : new Date();
  const note = inputNote.value || "";
  if (!amount) { alert("Amount is required"); return; }
  await db.collection("transactions").add({ type, category, division, amount, date, note });
  inputAmount.value = ""; inputNote.value = "";
});

function renderRows(list) {
  tbody.innerHTML = list.map((t) => {
    const d = t.date?.toDate ? t.date.toDate() : (t.date ? new Date(t.date) : new Date());
    return `<tr>
      <td>${toDateOnlyString(d)}</td>
      <td>${t.type}</td>
      <td>${t.category}</td>
      <td>${t.division || "—"}</td>
      <td>${formatCurrency(t.amount || 0)}</td>
      <td>${t.note || ""}</td>
      <td><button class="btn danger" data-id="${t._id}">Delete</button></td>
    </tr>`;
  }).join("");
}

tbody?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  if (confirm("Delete transaction?")) await db.collection("transactions").doc(id).delete();
});

function startRealtime() {
  unsubscribe();
  unsubscribe = db.collection("transactions").orderBy("date", "desc").onSnapshot((snap) => {
    transactions = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    renderRows(applyCurrentFilters(transactions));
  });
}
startRealtime();

function applyCurrentFilters(list) {
  const from = fromDate.value ? new Date(fromDate.value) : null;
  const to = toDate.value ? new Date(toDate.value) : null;
  const div = filterDivision.value;
  return list.filter((t) => {
    const d = t.date?.toDate ? t.date.toDate() : (t.date ? new Date(t.date) : new Date());
    if (from && d < from) return false;
    if (to && d > new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23,59,59,999)) return false;
    if (div && (t.division || "") !== div) return false;
    return true;
  });
}

applyFilters?.addEventListener("click", () => {
  renderRows(applyCurrentFilters(transactions));
});

exportBtn?.addEventListener("click", () => {
  const list = applyCurrentFilters(transactions);
  const rows = [["date","type","category","division","amount","note"]];
  list.forEach((t) => {
    const d = t.date?.toDate ? t.date.toDate() : (t.date ? new Date(t.date) : new Date());
    rows.push([toDateOnlyString(d), t.type, t.category, t.division || "", String(t.amount || 0), t.note || ""]);
  });
  exportToCSV("transactions.csv", rows);
});
