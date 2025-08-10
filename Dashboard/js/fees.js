import { initApp, getDb, exportToCSV, toDateOnlyString, formatCurrency } from "./app.js";

await initApp({ requiredRoles: ["Admin", "Counselor"] });
const db = getDb();

const tbody = document.querySelector("#feesTable tbody");
const btnAdd = document.getElementById("btnAdd");
const modal = document.getElementById("feeModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const feeForm = document.getElementById("feeForm");
const searchInput = document.getElementById("search");
const filterDivision = document.getElementById("filterDivision");

let fees = [];
let unsubscribe = () => {};
let editDocId = null;
let settings = { lateFeeAmount: 0, feeReminderTemplate: "Hello {name}, your fees of {amount} are due." };

async function loadSettings() {
  const doc = await db.collection("settings").doc("system").get();
  if (doc.exists) settings = { ...settings, ...doc.data() };
}
await loadSettings();

function openModal(editing = false, data = null, id = null) {
  modal.classList.add("open");
  document.getElementById("modalTitle").textContent = editing ? "Edit Fee" : "Add Fee";
  editDocId = editing ? id : null;
  feeForm.reset();
  if (data) {
    const payload = { ...data };
    if (payload.lastPaymentAt && payload.lastPaymentAt.toDate) payload.lastPaymentAt = toDateOnlyString(payload.lastPaymentAt.toDate());
    for (const [k, v] of Object.entries(payload)) {
      const el = feeForm.elements.namedItem(k);
      if (el) el.value = v ?? "";
    }
  }
}
function closeModal() { modal.classList.remove("open"); editDocId = null; }

btnAdd?.addEventListener("click", () => openModal(false));
btnCloseModal?.addEventListener("click", closeModal);

feeForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(feeForm).entries());
  const totalAmount = Number(data.totalAmount || 0);
  const paymentAmount = Number(data.paymentAmount || 0);
  const paymentDate = data.paymentDate ? new Date(data.paymentDate) : new Date();

  let lateFee = 0;
  if (paymentDate.getDate() > 5) lateFee = Number(settings.lateFeeAmount || 0);

  const payment = paymentAmount ? { amount: paymentAmount + lateFee, method: data.paymentMethod || "cash", paidAt: paymentDate } : null;

  try {
    if (editDocId) {
      const ref = db.collection("fees").doc(editDocId);
      const doc = await ref.get();
      const existing = doc.data() || {};
      const paidSoFar = Number(existing.paidAmount || 0) + (payment ? payment.amount : 0);
      const payments = [...(existing.payments || [])];
      if (payment) payments.push(payment);
      await ref.set({
        studentId: data.studentId,
        studentName: data.studentName,
        division: data.division,
        course: data.course,
        totalAmount,
        paidAmount: paidSoFar,
        payments,
        lastPaymentAt: payment ? paymentDate : existing.lastPaymentAt || null
      }, { merge: true });
      if (payment) openReceipt({ ...existing, ...data, payment });
    } else {
      const payload = {
        studentId: data.studentId,
        studentName: data.studentName,
        division: data.division,
        course: data.course,
        totalAmount,
        paidAmount: payment ? payment.amount : 0,
        payments: payment ? [payment] : [],
        lastPaymentAt: payment ? paymentDate : null
      };
      const ref = await db.collection("fees").add(payload);
      if (payment) openReceipt({ ...payload, _id: ref.id, payment });
    }
    closeModal();
  } catch (err) { alert("Failed to save: " + err.message); }
});

function renderRows() {
  const q = (searchInput.value || "").toLowerCase();
  const division = filterDivision.value;
  const filtered = fees.filter((f) => {
    const matchesQ = !q || [f.studentName, f.course, f.studentId].some((x) => (x || "").toLowerCase().includes(q));
    const matchesDivision = !division || (f.division || "").toLowerCase() === division;
    return matchesQ && matchesDivision;
  });
  tbody.innerHTML = filtered.map((f) => {
    const outstanding = Number(f.totalAmount || 0) - Number(f.paidAmount || 0);
    const lastPayment = f.lastPaymentAt ? toDateOnlyString(f.lastPaymentAt.toDate ? f.lastPaymentAt.toDate() : f.lastPaymentAt) : "—";
    return `<tr>
      <td>${f.studentName} (${f.studentId})</td>
      <td>${f.division}</td>
      <td>${f.course || ""}</td>
      <td>${formatCurrency(f.totalAmount || 0)}</td>
      <td>${formatCurrency(f.paidAmount || 0)}</td>
      <td>${formatCurrency(outstanding)}</td>
      <td>${lastPayment}</td>
      <td>
        <button class="btn" data-action="pay" data-id="${f._id}">Add Payment</button>
        <button class="btn" data-action="receipt" data-id="${f._id}">Receipt</button>
        <button class="btn" data-action="remind" data-id="${f._id}">Notify</button>
        <button class="btn danger" data-action="delete" data-id="${f._id}">Delete</button>
      </td>
    </tr>`;
  }).join("");
}

tbody?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");
  const data = fees.find((x) => x._id === id);
  if (action === "pay") openModal(true, data, id);
  else if (action === "delete") {
    if (confirm("Delete this fee record?")) await db.collection("fees").doc(id).delete();
  } else if (action === "receipt") {
    openReceipt(data);
  } else if (action === "remind") {
    sendReminder(data);
  }
});

searchInput?.addEventListener("input", renderRows);
filterDivision?.addEventListener("change", renderRows);

function startRealtime() {
  unsubscribe();
  unsubscribe = db.collection("fees").orderBy("studentName").onSnapshot((snap) => {
    fees = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    renderRows();
  });
}
startRealtime();

function openReceipt(data) {
  const lastPayment = data.payments?.[data.payments.length-1] || data.payment || null;
  const win = window.open("", "_blank");
  const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>Receipt</title></head><body>
    <h2>Payment Receipt</h2>
    <p><strong>Student:</strong> ${data.studentName} (${data.studentId})</p>
    <p><strong>Division:</strong> ${data.division} • <strong>Course:</strong> ${data.course || ""}</p>
    <p><strong>Total:</strong> ${formatCurrency(data.totalAmount || 0)} • <strong>Paid:</strong> ${formatCurrency(data.paidAmount || 0)}</p>
    ${lastPayment ? `<p><strong>Last Payment:</strong> ${formatCurrency(lastPayment.amount)} via ${lastPayment.method} on ${toDateOnlyString(lastPayment.paidAt)}</p>` : ''}
    <hr />
    <button onclick="window.print()">Print / Save PDF</button>
  </body></html>`;
  win.document.write(html);
  win.document.close();
}

function sendReminder(f) {
  const outstanding = Number(f.totalAmount || 0) - Number(f.paidAmount || 0);
  const msg = (settings.feeReminderTemplate || "").replace("{name}", f.studentName).replace("{amount}", formatCurrency(outstanding));
  const phone = prompt("Enter WhatsApp number (with country code)");
  if (phone) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
  const email = prompt("Enter email");
  if (email) window.location.href = `mailto:${email}?subject=${encodeURIComponent("Fee Reminder")}&body=${encodeURIComponent(msg)}`;
}