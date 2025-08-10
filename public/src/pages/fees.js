import { db, collection, addDoc, serverTimestamp, onSnapshot, doc, updateDoc } from '/src/firebase-init.js';
import { showModal, formToObject, renderToast, downloadBlobCSV } from '/src/ui.js';

const tbody = document.querySelector('#feesTable tbody');
const searchEl = document.getElementById('studentSearch');
const recordBtn = document.getElementById('recordFee');
const exportBtn = document.getElementById('exportFees');

let allFees = [];
let allStudents = [];

function loadStudents() {
  import('/src/firebase-init.js').then(({ collection, onSnapshot, db }) => {
    onSnapshot(collection(db, 'students'), (snap) => {
      allStudents = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    });
  });
}
loadStudents();

recordBtn.addEventListener('click', () => openForm());

function openForm(existing = null) {
  const el = document.createElement('form');
  const studentOptions = allStudents.map(s => `<option value="${s._id}">${s.studentId || ''} ${s.name ? ' - ' + s.name : ''}</option>`).join('');
  el.innerHTML = `
    <div class="grid grid-2">
      <label>Student<select name="studentId" required>${studentOptions}</select></label>
      <label>Division
        <select name="division" required>
          <option>CAPT</option>
          <option>LBS</option>
          <option>Gama Abacus</option>
          <option>Micro Computers</option>
          <option>Other</option>
        </select>
      </label>
      <label>Amount<input type="number" step="0.01" name="amount" required></label>
      <label>Payment Method
        <select name="method" required>
          <option>cash</option>
          <option>card</option>
          <option>UPI</option>
          <option>online</option>
        </select>
      </label>
      <label>Status
        <select name="status">
          <option>Paid</option>
          <option>Pending</option>
          <option>Overdue</option>
        </select>
      </label>
      <label>Month<input type="month" name="forMonth" required></label>
      <label>Notes<textarea name="notes" placeholder="Optional"></textarea></label>
    </div>
  `;
  showModal({
    title: 'Record Payment',
    content: el,
    actions: [
      { label: 'Cancel' },
      { label: 'Save & Receipt', variant: 'btn-primary', onClick: async () => {
        const data = formToObject(el);
        data.amount = Number(data.amount || 0);
        data.createdAt = serverTimestamp();
        data.date = new Date().toISOString();
        // late fee rule: after 5th add 50 (example) if status is Paid
        const today = new Date();
        if (today.getDate() > 5 && data.status === 'Paid') {
          data.lateFee = 50; // flat example; adjust as needed
          data.amountWithLate = data.amount + data.lateFee;
        }
        // partial payments allowed by just recording multiple entries for same month
        const ref = await addDoc(collection(db, 'fees'), data);
        // mirror in division-specific collection
        const divCol = `fees_${(data.division || 'Other').replace(/\s+/g,'_')}`;
        await addDoc(collection(db, divCol), { ...data, feeId: ref.id });
        // update student's feesPaid/outstanding if provided
        const student = allStudents.find(s => s._id === data.studentId);
        if (student) {
          const paid = Number(student.feesPaid || 0) + data.amount;
          const outstanding = Math.max(0, Number(student.feesOutstanding || 0) - data.amount);
          await updateDoc(doc(db, 'students', student._id), { feesPaid: paid, feesOutstanding: outstanding });
        }
        renderReceipt(ref.id, data);
        renderToast('Payment recorded');
      } }
    ]
  });
}

function renderReceipt(id, data) {
  const { jsPDF } = window.jspdf;
  const docPdf = new jsPDF();
  const student = allStudents.find(s => s._id === data.studentId);
  docPdf.text('Micro Tech Center - Fee Receipt', 14, 20);
  docPdf.text(`Receipt ID: ${id}`, 14, 30);
  docPdf.text(`Student: ${(student?.name)||''} (${student?.studentId||''})`, 14, 40);
  docPdf.text(`Division: ${data.division}`, 14, 50);
  docPdf.text(`Month: ${data.forMonth}`, 14, 60);
  docPdf.text(`Amount: ₹${data.amount}`, 14, 70);
  if (data.lateFee) docPdf.text(`Late Fee: ₹${data.lateFee}`, 14, 80);
  docPdf.text(`Status: ${data.status}`, 14, 90);
  docPdf.save(`receipt_${id}.pdf`);
}

function renderRows(rows) {
  tbody.innerHTML = '';
  rows.forEach(r => {
    const student = allStudents.find(s => s._id === r.studentId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(r.date).toLocaleDateString()}</td>
      <td>${student ? (student.name || student.studentId) : r.studentId}</td>
      <td>${r.division}</td>
      <td>₹${r.amount}</td>
      <td>${r.method}</td>
      <td><span class="badge ${r.status==='Paid'?'success': r.status==='Pending'?'warning':'danger'}">${r.status}</span></td>
      <td>
        <a class="btn" href="mailto:${student?.email || ''}?subject=Fee Receipt&body=Thank you for the payment of ₹${r.amount}">Email</a>
        <a class="btn" target="_blank" href="https://wa.me/${(student?.phone||'').replace(/\D/g,'')}?text=${encodeURIComponent('Thank you for the payment of ₹'+r.amount)}">WhatsApp</a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterRows() {
  const q = (searchEl.value || '').toLowerCase();
  const filtered = allFees.filter(f => {
    const student = allStudents.find(s => s._id === f.studentId);
    const hay = [student?.name, student?.studentId].map(x => (x || '').toLowerCase()).join(' ');
    return hay.includes(q);
  });
  renderRows(filtered);
}

searchEl.addEventListener('input', filterRows);

onSnapshot(collection(db, 'fees'), (snap) => {
  allFees = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  filterRows();
});

exportBtn.addEventListener('click', () => {
  const rows = allFees.map(({ _id, ...r }) => r);
  if (!rows.length) return renderToast('No data');
  downloadBlobCSV('fees.csv', rows);
});