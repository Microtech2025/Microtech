import { db, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from '/src/firebase-init.js';
import { showModal, formToObject, renderToast, downloadBlobCSV } from '/src/ui.js';

const tbody = document.querySelector('#referralTable tbody');
const addBtn = document.getElementById('addReferral');
const exportBtn = document.getElementById('exportReferrals');
let allRows = [];

addBtn.addEventListener('click', () => openForm());

tbody.addEventListener('click', async (e) => {
  const markId = e.target.getAttribute('data-mark');
  const delId = e.target.getAttribute('data-del');
  if (markId) {
    const row = allRows.find(r => r._id === markId);
    await updateDoc(doc(db, 'referrals', row._id), { rewardPaid: true });
    renderToast('Marked reward paid');
  } else if (delId) {
    if (confirm('Delete code?')) {
      await deleteDoc(doc(db, 'referrals', delId));
      renderToast('Deleted');
    }
  }
});

function openForm() {
  const el = document.createElement('form');
  el.innerHTML = `
    <div class="grid grid-2">
      <label>Reward (₹)<input type="number" name="reward" value="200" required></label>
    </div>
  `;
  showModal({
    title: 'Create Referral Code',
    content: el,
    actions: [
      { label: 'Cancel' },
      { label: 'Create', variant: 'btn-primary', onClick: async () => {
        const data = formToObject(el);
        const code = generateCode();
        await addDoc(collection(db, 'referrals'), {
          code,
          reward: Number(data.reward || 0),
          uses: 0,
          rewardPaid: false,
          createdAt: serverTimestamp(),
        });
        renderToast('Created: ' + code);
      } }
    ]
  });
}

function generateCode() {
  return 'REF-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

onSnapshot(collection(db, 'referrals'), (snap) => {
  allRows = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  renderRows(allRows);
});

function renderRows(rows) {
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.code}</td>
      <td>₹${r.reward}</td>
      <td>${r.uses || 0}</td>
      <td>${r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ''}</td>
      <td>
        <button class="btn" data-mark="${r._id}">Mark Reward Paid</button>
        <button class="btn" data-del="${r._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

exportBtn.addEventListener('click', () => {
  const rows = allRows.map(({ _id, ...r }) => r);
  downloadBlobCSV('referrals.csv', rows);
});