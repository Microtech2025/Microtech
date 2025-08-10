import { db, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from '/src/firebase-init.js';
import { showModal, formToObject, renderToast } from '/src/ui.js';

const tbody = document.querySelector('#alumniTable tbody');
const addBtn = document.getElementById('addAlumni');
let allRows = [];

addBtn.addEventListener('click', () => openForm());

tbody.addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-edit');
  const delId = e.target.getAttribute('data-del');
  if (id) {
    const row = allRows.find(r => r._id === id);
    openForm(row);
  } else if (delId) {
    if (confirm('Delete?')) {
      await deleteDoc(doc(db, 'alumni', delId));
      renderToast('Deleted');
    }
  }
});

function openForm(row = null) {
  const el = document.createElement('form');
  el.innerHTML = `
    <div class="grid grid-2">
      <label>Name<input name="name" value="${row?.name ?? ''}" required></label>
      <label>Email<input type="email" name="email" value="${row?.email ?? ''}" required></label>
      <label>Phone<input name="phone" value="${row?.phone ?? ''}"></label>
      <label>Year<input type="number" name="year" value="${row?.year ?? ''}"></label>
      <label>Course<input name="course" value="${row?.course ?? ''}"></label>
    </div>
  `;
  showModal({
    title: row ? 'Edit Alumni' : 'Add Alumni',
    content: el,
    actions: [
      { label: 'Cancel' },
      { label: row ? 'Save' : 'Create', variant: 'btn-primary', onClick: async () => {
        const data = formToObject(el);
        if (!row) {
          data.createdAt = serverTimestamp();
          await addDoc(collection(db, 'alumni'), data);
        } else {
          await updateDoc(doc(db, 'alumni', row._id), data);
        }
        renderToast('Saved');
      } }
    ]
  });
}

onSnapshot(collection(db, 'alumni'), (snap) => {
  allRows = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  renderRows(allRows);
});

function renderRows(rows) {
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${r.email}</td>
      <td>${r.phone || ''}</td>
      <td>${r.year || ''}</td>
      <td>${r.course || ''}</td>
      <td>
        <button class="btn" data-edit="${r._id}">Edit</button>
        <button class="btn" data-del="${r._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}