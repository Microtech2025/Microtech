import { db, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from '/src/firebase-init.js';
import { showModal, formToObject, renderToast, downloadBlobCSV } from '/src/ui.js';

const tbody = document.querySelector('#scholarshipTable tbody');
const addBtn = document.getElementById('addScholarship');
const exportBtn = document.getElementById('exportScholarships');
let allRows = [];
let allStudents = [];

function loadStudents() {
  import('/src/firebase-init.js').then(({ collection, onSnapshot, db }) => {
    onSnapshot(collection(db, 'students'), (snap) => {
      allStudents = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    });
  });
}
loadStudents();

addBtn.addEventListener('click', () => openForm());

tbody.addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-edit');
  const delId = e.target.getAttribute('data-del');
  const applyId = e.target.getAttribute('data-apply');
  if (id) {
    const row = allRows.find(r => r._id === id);
    openForm(row);
  } else if (applyId) {
    const row = allRows.find(r => r._id === applyId);
    openApply(row);
  } else if (delId) {
    if (confirm('Delete scholarship?')) {
      await deleteDoc(doc(db, 'scholarships', delId));
      renderToast('Deleted');
    }
  }
});

function openForm(row = null) {
  const el = document.createElement('form');
  el.innerHTML = `
    <div class="grid grid-2">
      <label>Title<input name="title" value="${row?.title ?? ''}" required></label>
      <label>Discount %<input type="number" step="1" name="discountPercent" value="${row?.discountPercent ?? 0}" required></label>
      <label>Expiry<input type="date" name="expiry" value="${row?.expiry ? row.expiry.split('T')[0] : ''}"></label>
      <label>Notes<textarea name="notes">${row?.notes ?? ''}</textarea></label>
    </div>
  `;
  showModal({
    title: row ? 'Edit Scholarship' : 'Add Scholarship',
    content: el,
    actions: [
      { label: 'Cancel' },
      { label: row ? 'Save' : 'Create', variant: 'btn-primary', onClick: async () => {
        const data = formToObject(el);
        data.discountPercent = Number(data.discountPercent || 0);
        data.expiry = data.expiry ? new Date(data.expiry).toISOString() : null;
        if (!row) {
          data.createdAt = serverTimestamp();
          data.appliedCount = 0;
          await addDoc(collection(db, 'scholarships'), data);
        } else {
          await updateDoc(doc(db, 'scholarships', row._id), data);
        }
        renderToast('Saved');
      } }
    ]
  });
}

function openApply(row) {
  const el = document.createElement('form');
  const studentOptions = allStudents.map(s => `<option value="${s._id}">${s.studentId || ''} ${s.name ? '- '+s.name : ''}</option>`).join('');
  el.innerHTML = `
    <div class="grid grid-2">
      <label>Student<select name="studentId" required>${studentOptions}</select></label>
      <label>Manual % Override (optional)<input type="number" name="overridePercent" placeholder="Leave blank to use ${row.discountPercent}%"/></label>
    </div>
  `;
  showModal({
    title: `Apply Scholarship: ${row.title}`,
    content: el,
    actions: [
      { label: 'Cancel' },
      { label: 'Apply', variant: 'btn-primary', onClick: async () => {
        const data = formToObject(el);
        const percent = data.overridePercent ? Number(data.overridePercent) : row.discountPercent;
        await addDoc(collection(db, 'scholarshipApplications'), {
          scholarshipId: row._id,
          studentId: data.studentId,
          percent,
          appliedAt: serverTimestamp(),
        });
        await updateDoc(doc(db, 'scholarships', row._id), { appliedCount: (row.appliedCount || 0) + 1 });
        renderToast('Applied');
      } }
    ]
  });
}

onSnapshot(collection(db, 'scholarships'), (snap) => {
  allRows = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  renderRows(allRows);
});

function renderRows(rows) {
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.title}</td>
      <td>${r.discountPercent}%</td>
      <td>${r.expiry ? new Date(r.expiry).toLocaleDateString() : '-'}</td>
      <td>${r.appliedCount || 0}</td>
      <td>
        <button class="btn" data-apply="${r._id}">Apply</button>
        <button class="btn" data-edit="${r._id}">Edit</button>
        <button class="btn" data-del="${r._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

exportBtn.addEventListener('click', () => {
  const rows = allRows.map(({ _id, ...r }) => r);
  downloadBlobCSV('scholarships.csv', rows);
});