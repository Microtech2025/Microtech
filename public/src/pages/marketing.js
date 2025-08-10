import { db, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from '/src/firebase-init.js';
import { showModal, formToObject, renderToast, downloadBlobCSV } from '/src/ui.js';

const tbody = document.querySelector('#adsTable tbody');
const addBtn = document.getElementById('addAd');
const exportBtn = document.getElementById('exportAds');
let allRows = [];

addBtn.addEventListener('click', () => openForm());

tbody.addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-edit');
  const delId = e.target.getAttribute('data-del');
  if (id) {
    const row = allRows.find(r => r._id === id);
    openForm(row);
  } else if (delId) {
    if (confirm('Delete campaign?')) {
      await deleteDoc(doc(db, 'ads', delId));
      renderToast('Deleted');
    }
  }
});

function openForm(row = null) {
  const el = document.createElement('form');
  el.innerHTML = `
    <div class="grid grid-2">
      <label>Platform<input name="platform" value="${row?.platform ?? ''}" required></label>
      <label>Start<input type="date" name="start" value="${row?.start ? row.start.split('T')[0] : ''}" required></label>
      <label>End<input type="date" name="end" value="${row?.end ? row.end.split('T')[0] : ''}" required></label>
      <label>Budget<input type="number" step="0.01" name="budget" value="${row?.budget ?? 0}" required></label>
      <label>Leads Generated<input type="number" name="leads" value="${row?.leads ?? 0}" required></label>
    </div>
  `;
  showModal({
    title: row ? 'Edit Campaign' : 'Add Campaign',
    content: el,
    actions: [
      { label: 'Cancel' },
      { label: row ? 'Save' : 'Create', variant: 'btn-primary', onClick: async () => {
        const data = formToObject(el);
        data.budget = Number(data.budget || 0);
        data.leads = Number(data.leads || 0);
        data.start = data.start ? new Date(data.start).toISOString() : null;
        data.end = data.end ? new Date(data.end).toISOString() : null;
        if (!row) {
          data.createdAt = serverTimestamp();
          await addDoc(collection(db, 'ads'), data);
        } else {
          await updateDoc(doc(db, 'ads', row._id), data);
        }
        renderToast('Saved');
      } }
    ]
  });
}

onSnapshot(collection(db, 'ads'), (snap) => {
  allRows = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  renderRows(allRows);
});

function roi(row) {
  // ROI placeholder: leads * 500 revenue per lead vs budget
  const revenue = (row.leads || 0) * 500;
  const budget = row.budget || 0;
  if (budget === 0) return '∞';
  return (((revenue - budget) / budget) * 100).toFixed(1) + '%';
}

function renderRows(rows) {
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.platform}</td>
      <td>${r.start ? new Date(r.start).toLocaleDateString() : ''}</td>
      <td>${r.end ? new Date(r.end).toLocaleDateString() : ''}</td>
      <td>₹${r.budget}</td>
      <td>${r.leads}</td>
      <td>${roi(r)}</td>
      <td>
        <button class="btn" data-edit="${r._id}">Edit</button>
        <button class="btn" data-del="${r._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

exportBtn.addEventListener('click', () => {
  const rows = allRows.map(({ _id, ...r }) => r);
  downloadBlobCSV('ads.csv', rows);
});