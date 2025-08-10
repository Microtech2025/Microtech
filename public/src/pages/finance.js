import { db, collection, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, deleteDoc } from '/src/firebase-init.js';
import { showModal, formToObject, renderToast, downloadBlobCSV } from '/src/ui.js';

const tbody = document.querySelector('#financeTable tbody');
const addBtn = document.getElementById('addFinance');
const exportBtn = document.getElementById('exportFinance');

let allRows = [];

addBtn.addEventListener('click', () => openForm());

tbody.addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-edit');
  const delId = e.target.getAttribute('data-del');
  if (id) {
    const row = allRows.find(r => r._id === id);
    openForm(row);
  } else if (delId) {
    if (confirm('Delete entry?')) {
      await deleteDoc(doc(db, 'finance', delId));
      renderToast('Deleted');
    }
  }
});

function openForm(row = null) {
  const el = document.createElement('form');
  el.innerHTML = `
    <div class="grid grid-2">
      <label>Date<input type="date" name="date" value="${row?.date ? row.date.split('T')[0] : ''}" required></label>
      <label>Type
        <select name="type" required>
          <option ${row?.type==='revenue'?'selected':''} value="revenue">Revenue</option>
          <option ${row?.type==='expense'?'selected':''} value="expense">Expense</option>
        </select>
      </label>
      <label>Division
        <select name="division" required>
          <option>CAPT</option>
          <option>LBS</option>
          <option>Gama Abacus</option>
          <option>Micro Computers</option>
          <option>Other</option>
        </select>
      </label>
      <label>Category
        <select name="category" required>
          <option>fees</option>
          <option>salaries</option>
          <option>rent</option>
          <option>utilities</option>
          <option>ads</option>
          <option>supplies</option>
          <option>other</option>
        </select>
      </label>
      <label>Amount<input type="number" step="0.01" name="amount" value="${row?.amount ?? 0}" required></label>
      <label>Notes<textarea name="notes">${row?.notes ?? ''}</textarea></label>
    </div>
  `;
  showModal({
    title: row ? 'Edit Entry' : 'Add Entry',
    content: el,
    actions: [
      { label: 'Cancel' },
      { label: row ? 'Save' : 'Create', variant: 'btn-primary', onClick: async () => {
        const data = formToObject(el);
        data.amount = Number(data.amount || 0);
        data.date = data.date ? new Date(data.date).toISOString() : new Date().toISOString();
        if (!row) {
          data.createdAt = serverTimestamp();
          await addDoc(collection(db, 'finance'), data);
        } else {
          await updateDoc(doc(db, 'finance', row._id), data);
        }
        renderToast('Saved');
      } }
    ]
  });
}

onSnapshot(collection(db, 'finance'), (snap) => {
  allRows = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  renderRows(allRows);
});

function renderRows(rows) {
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(r.date).toLocaleDateString()}</td>
      <td>${r.type}</td>
      <td>${r.division}</td>
      <td>${r.category}</td>
      <td>₹${r.amount}</td>
      <td>${r.notes || ''}</td>
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
  if (!rows.length) return renderToast('No data');
  downloadBlobCSV('finance.csv', rows);
});