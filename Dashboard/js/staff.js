import { initApp, getDb, exportToCSV, formatCurrency } from "./app.js";

await initApp({ requiredRoles: ["Admin", "Counselor"] });
const db = getDb();

const tbody = document.querySelector("#staffTable tbody");
const btnAdd = document.getElementById("btnAdd");
const modal = document.getElementById("staffModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const staffForm = document.getElementById("staffForm");
const searchInput = document.getElementById("search");
const btnImportCSV = document.getElementById("btnImportCSV");
const btnExportCSV = document.getElementById("btnExportCSV");
const csvFile = document.getElementById("csvFile");
const modalTitle = document.getElementById("modalTitle");

let staff = [];
let unsubscribe = () => {};
let editDocId = null;

function openModal(editing = false, data = null, id = null) {
  modal.classList.add("open");
  modalTitle.textContent = editing ? "Edit Staff" : "Add Staff";
  editDocId = editing ? id : null;
  staffForm.reset();
  if (data) {
    for (const [k, v] of Object.entries(data)) {
      const el = staffForm.elements.namedItem(k);
      if (el) el.value = v ?? "";
    }
  }
}
function closeModal() { modal.classList.remove("open"); editDocId = null; }

btnAdd?.addEventListener("click", () => openModal(false));
btnCloseModal?.addEventListener("click", closeModal);

staffForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(staffForm).entries());
  formData.salary = Number(formData.salary || 0);
  try {
    if (editDocId) await db.collection("staff").doc(editDocId).set(formData, { merge: true });
    else await db.collection("staff").add(formData);
    closeModal();
  } catch (err) { alert("Failed to save: " + err.message); }
});

function renderRows() {
  const q = (searchInput.value || "").toLowerCase();
  const filtered = staff.filter((s) => !q || [s.name, s.role, s.staffId].some((x) => (x || "").toLowerCase().includes(q)));
  tbody.innerHTML = filtered.map((s) => {
    return `<tr>
      <td>${s.staffId || ""}</td>
      <td>${s.name || ""}</td>
      <td>${s.role || ""}</td>
      <td>${formatCurrency(s.salary || 0)}</td>
      <td>${s.paymentSchedule || ""}</td>
      <td>
        <button class="btn" data-action="present" data-id="${s._id}">Mark Present</button>
        <button class="btn" data-action="edit" data-id="${s._id}">Edit</button>
        <button class="btn danger" data-action="delete" data-id="${s._id}">Delete</button>
      </td>
    </tr>`;
  }).join("");
}

tbody?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");
  const data = staff.find((x) => x._id === id);
  if (action === "edit") openModal(true, data, id);
  else if (action === "delete") {
    if (confirm("Delete this staff?")) await db.collection("staff").doc(id).delete();
  } else if (action === "present") {
    const today = new Date();
    await db.collection("staff").doc(id).collection("attendance").doc(today.toISOString().slice(0,10)).set({ present: true, at: today }, { merge: true });
    alert("Attendance marked");
  }
});

searchInput?.addEventListener("input", renderRows);

function startRealtime() {
  unsubscribe();
  unsubscribe = db.collection("staff").orderBy("name").onSnapshot((snap) => {
    staff = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    renderRows();
  });
}
startRealtime();

btnImportCSV?.addEventListener("click", () => {
  const file = csvFile.files?.[0];
  if (!file) { alert("Choose a CSV file first"); return; }
  Papa.parse(file, { header: true, skipEmptyLines: true, complete: async (res) => {
    const rows = res.data;
    const batch = db.batch();
    rows.forEach((r) => {
      const ref = db.collection("staff").doc();
      batch.set(ref, { staffId: r.staffId || r.id || "", name: r.name || "", role: r.role || "", salary: Number(r.salary || 0), paymentSchedule: r.paymentSchedule || "" });
    });
    try { await batch.commit(); alert("Import complete"); } catch (e) { alert("Import failed: " + e.message); }
  }});
});

btnExportCSV?.addEventListener("click", () => {
  const rows = [["staffId","name","role","salary","paymentSchedule"]];
  staff.forEach((s) => rows.push([s.staffId||"", s.name||"", s.role||"", String(s.salary||0), s.paymentSchedule||""]));
  exportToCSV("staff.csv", rows);
});