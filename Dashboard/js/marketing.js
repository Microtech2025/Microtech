import { initApp, getDb, exportToCSV, toDateOnlyString, formatCurrency } from "./app.js";

await initApp({ requiredRoles: ["Admin", "Counselor"] });
const db = getDb();

const tbody = document.querySelector("#campaignTable tbody");
const addBtn = document.getElementById("addCampaign");

const inputPlatform = document.getElementById("platform");
const inputStart = document.getElementById("startDate");
const inputEnd = document.getElementById("endDate");
const inputBudget = document.getElementById("budget");
const inputLeads = document.getElementById("leads");
const inputRevenue = document.getElementById("revenue");

let campaigns = [];
let unsubscribe = () => {};

addBtn?.addEventListener("click", async () => {
  const platform = inputPlatform.value.trim();
  const start = inputStart.value ? new Date(inputStart.value) : null;
  const end = inputEnd.value ? new Date(inputEnd.value) : null;
  const budget = Number(inputBudget.value || 0);
  const leads = Number(inputLeads.value || 0);
  const revenue = Number(inputRevenue.value || 0);
  if (!platform || !budget) { alert("Platform and budget are required"); return; }
  await db.collection("campaigns").add({ platform, start, end, budget, leads, revenue });
  inputPlatform.value = ""; inputStart.value = ""; inputEnd.value = ""; inputBudget.value = ""; inputLeads.value = ""; inputRevenue.value = "";
});

function renderRows() {
  tbody.innerHTML = campaigns.map((c) => {
    const start = c.start?.toDate ? c.start.toDate() : (c.start ? new Date(c.start) : null);
    const end = c.end?.toDate ? c.end.toDate() : (c.end ? new Date(c.end) : null);
    const cpl = c.leads ? (c.budget / c.leads) : 0;
    const roi = c.budget ? (((Number(c.revenue || 0) - c.budget) / c.budget) * 100) : 0;
    return `<tr>
      <td>${c.platform}</td>
      <td>${start ? toDateOnlyString(start) : ""}</td>
      <td>${end ? toDateOnlyString(end) : ""}</td>
      <td>${formatCurrency(c.budget || 0)}</td>
      <td>${c.leads || 0}</td>
      <td>${formatCurrency(c.revenue || 0)}</td>
      <td>${c.leads ? formatCurrency(cpl) : "—"}</td>
      <td>${roi.toFixed(1)}%</td>
      <td><button class="btn danger" data-id="${c._id}">Delete</button></td>
    </tr>`;
  }).join("");
}

tbody?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  if (confirm("Delete campaign?")) await db.collection("campaigns").doc(id).delete();
});

function startRealtime() {
  unsubscribe();
  unsubscribe = db.collection("campaigns").orderBy("start", "desc").onSnapshot((snap) => {
    campaigns = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    renderRows();
  });
}
startRealtime();