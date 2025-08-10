import { db, collection, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from '/src/firebase-init.js';
import { renderToast } from '/src/ui.js';

const quickSearch = document.getElementById('cQuickSearch');
const resultsEl = document.getElementById('cSearchResults');
const paymentForm = document.getElementById('cPaymentForm');
const studentSelect = document.getElementById('cStudentSelect');
const leadForm = document.getElementById('leadForm');

let students = [];

onSnapshot(collection(db, 'students'), (snap) => {
  students = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  renderStudentOptions();
});

function renderStudentOptions() {
  studentSelect.innerHTML = students.map(s => `<option value="${s._id}">${s.studentId || ''} ${s.name ? ' - '+s.name : ''}</option>`).join('');
}

quickSearch.addEventListener('input', () => {
  const q = (quickSearch.value || '').toLowerCase();
  const filtered = students.filter(s => [s.name, s.studentId].join(' ').toLowerCase().includes(q));
  resultsEl.innerHTML = filtered.map(s => `<li>${s.studentId || ''} ${s.name || ''} • ${s.phone || ''} <a target="_blank" href="https://wa.me/${(s.phone||'').replace(/\D/g,'')}">WhatsApp</a></li>`).join('');
});

paymentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(paymentForm).entries());
  data.amount = Number(data.amount || 0);
  data.status = 'Paid';
  data.createdAt = serverTimestamp();
  data.date = new Date().toISOString();
  const feeRef = await addDoc(collection(db, 'fees'), data);
  const student = students.find(s => s._id === data.studentId);
  if (student) {
    await updateDoc(doc(db, 'students', student._id), {
      feesPaid: Number(student.feesPaid || 0) + data.amount,
      feesOutstanding: Math.max(0, Number(student.feesOutstanding || 0) - data.amount),
    });
  }
  // simple receipt
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.text('Micro Tech Center - Fee Receipt', 14, 20);
  pdf.text(`Student: ${(student?.name)||''} (${student?.studentId||''})`, 14, 30);
  pdf.text(`Amount: ₹${data.amount}`, 14, 40);
  pdf.text(`Month: ${data.forMonth}`, 14, 50);
  pdf.save(`receipt_${feeRef.id}.pdf`);
  renderToast('Payment recorded');
});

leadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(leadForm).entries());
  data.createdAt = serverTimestamp();
  await addDoc(collection(db, 'leads'), data);
  leadForm.reset();
  renderToast('Lead saved');
});