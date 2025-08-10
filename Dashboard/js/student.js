import { initApp, getDb, getStorage, exportToCSV, toDateOnlyString, formatCurrency } from "./app.js";

await initApp({ requiredRoles: ["Admin", "Counselor"] });
const db = getDb();
const storage = getStorage();

const tbody = document.querySelector("#studentsTable tbody");
const btnAdd = document.getElementById("btnAdd");
const modal = document.getElementById("studentModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const studentForm = document.getElementById("studentForm");
const searchInput = document.getElementById("search");
const filterDivision = document.getElementById("filterDivision");
const btnImportCSV = document.getElementById("btnImportCSV");
const btnExportCSV = document.getElementById("btnExportCSV");
const csvFile = document.getElementById("csvFile");
const modalTitle = document.getElementById("modalTitle");

let unsubscribe = () => {};
let students = [];
let editDocId = null;

function openModal(editing = false, data = null, docId = null) {
  modal.classList.add("open");
  modalTitle.textContent = editing ? "Edit Student" : "Add Student";
  editDocId = editing ? docId : null;
  studentForm.reset();
  if (data) {
    for (const [k, v] of Object.entries(data)) {
      const el = studentForm.elements.namedItem(k);
      if (el) el.value = v ?? "";
    }
  }
}
function closeModal() { modal.classList.remove("open"); editDocId = null; }

btnAdd?.addEventListener("click", () => openModal(false));
btnCloseModal?.addEventListener("click", closeModal);

studentForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(studentForm).entries());
  formData.feesPaid = Number(formData.feesPaid || 0);
  formData.feesOutstanding = Number(formData.feesOutstanding || 0);
  formData.joinDate = formData.joinDate ? new Date(formData.joinDate) : null;

  try {
    let docRef;
    if (editDocId) {
      docRef = db.collection("students").doc(editDocId);
      await docRef.set(formData, { merge: true });
    } else {
      docRef = await db.collection("students").add(formData);
    }

    const files = document.getElementById("documents").files;
    if (files && files.length) {
      const urls = [];
      for (const file of files) {
        const path = `students/${docRef.id}/${Date.now()}-${file.name}`;
        const ref = storage.ref().child(path);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        urls.push({ name: file.name, url });
      }
      await docRef.set({ documents: urls }, { merge: true });
    }
    closeModal();
  } catch (err) {
    alert("Failed to save: " + err.message);
  }
});

function renderRows() {
  const q = (searchInput.value || "").toLowerCase();
  const division = filterDivision.value;
  const filtered = students.filter((s) => {
    const matchesQ = !q || [s.name, s.phone, s.email, s.studentId].some((x) => (x || "").toLowerCase().includes(q));
    const matchesDivision = !division || (s.division || "").toLowerCase() === division;
    return matchesQ && matchesDivision;
  });
  tbody.innerHTML = filtered.map((s) => {
    return `<tr>
      <td>${s.studentId || ""}</td>
      <td>${s.name || ""}</td>
      <td>${s.phone || ""}</td>
      <td>${s.email || ""}</td>
      <td>${s.division || ""}</td>
      <td>${s.course || ""}</td>
      <td>${s.batch || ""}</td>
      <td>${s.joinDate ? toDateOnlyString(s.joinDate.toDate ? s.joinDate.toDate() : s.joinDate) : ""}</td>
      <td>${formatCurrency(s.feesPaid || 0)}</td>
      <td>${formatCurrency(s.feesOutstanding || 0)}</td>
      <td>
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
  const data = students.find((x) => x._id === id);
  if (action === "edit") {
    openModal(true, data, id);
  } else if (action === "delete") {
    if (confirm("Delete this student?")) {
      await db.collection("students").doc(id).delete();
    }
  }
});

searchInput?.addEventListener("input", renderRows);
filterDivision?.addEventListener("change", renderRows);

function startRealtime() {
  unsubscribe();
  unsubscribe = db.collection("students").orderBy("name").onSnapshot((snap) => {
    students = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    renderRows();
  });
}
startRealtime();

btnImportCSV?.addEventListener("click", () => {
  const file = csvFile.files?.[0];
  if (!file) { alert("Choose a CSV file first"); return; }
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const rows = results.data;
      const batch = db.batch();
      rows.forEach((r) => {
        const ref = db.collection("students").doc();
        const payload = {
          studentId: r.studentId || r.id || "",
          name: r.name || "",
          phone: r.phone || "",
          email: r.email || "",
          division: (r.division || "").toLowerCase(),
          course: r.course || "",
          batch: r.batch || "",
          joinDate: r.joinDate ? new Date(r.joinDate) : null,
          feesPaid: Number(r.feesPaid || 0),
          feesOutstanding: Number(r.feesOutstanding || 0)
        };
        batch.set(ref, payload);
      });
      try { await batch.commit(); alert("Import complete"); } catch (e) { alert("Import failed: " + e.message); }
    }
  });
});

btnExportCSV?.addEventListener("click", () => {
  const rows = [["studentId","name","phone","email","division","course","batch","joinDate","feesPaid","feesOutstanding"]];
  students.forEach((s) => {
    rows.push([
      s.studentId || "",
      s.name || "",
      s.phone || "",
      s.email || "",
      s.division || "",
      s.course || "",
      s.batch || "",
      s.joinDate ? toDateOnlyString(s.joinDate.toDate ? s.joinDate.toDate() : s.joinDate) : "",
      String(s.feesPaid || 0),
      String(s.feesOutstanding || 0)
    ]);
  });
  exportToCSV("students.csv", rows);
});