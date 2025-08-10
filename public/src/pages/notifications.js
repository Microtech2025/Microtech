import { db, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from '/src/firebase-init.js';
import { showModal, formToObject, renderToast, downloadBlobCSV } from '/src/ui.js';

const tbody = document.querySelector('#templatesTable tbody');
const addBtn = document.getElementById('addTemplate');
const exportBtn = document.getElementById('exportTemplates');
let allRows = [];

addBtn.addEventListener('click', () => openForm());

tbody.addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-edit');
  const delId = e.target.getAttribute('data-del');
  const sendId = e.target.getAttribute('data-send');
  if (id) {
    const row = allRows.find(r => r._id === id);
    openForm(row);
  } else if (sendId) {
    const row = allRows.find(r => r._id === sendId);
    simulateSend(row);
  } else if (delId) {
    if (confirm('Delete template?')) {
      await deleteDoc(doc(db, 'notifications', delId));
      renderToast('Deleted');
    }
  }
});

function openForm(row = null) {
  const el = document.createElement('form');
  el.innerHTML = `
    <div class="grid grid-2">
      <label>Name<input name="name" value="${row?.name ?? ''}" required></label>
      <label>Channel
        <select name="channel" required>
          <option ${row?.channel==='email'?'selected':''} value="email">Email</option>
          <option ${row?.channel==='whatsapp'?'selected':''} value="whatsapp">WhatsApp</option>
          <option ${row?.channel==='push'?'selected':''} value="push">Push</option>
        </select>
      </label>
      <label>Schedule (optional)<input type="datetime-local" name="scheduleAt" value="${row?.scheduleAt ? row.scheduleAt.replace('Z','') : ''}"></label>
      <label>Body<textarea name="body" rows="6">${row?.body ?? ''}</textarea></label>
    </div>
  `;
  showModal({
    title: row ? 'Edit Template' : 'Add Template',
    content: el,
    actions: [
      { label: 'Cancel' },
      { label: row ? 'Save' : 'Create', variant: 'btn-primary', onClick: async () => {
        const data = formToObject(el);
        data.scheduleAt = data.scheduleAt ? new Date(data.scheduleAt).toISOString() : null;
        if (!row) {
          data.createdAt = serverTimestamp();
          await addDoc(collection(db, 'notifications'), data);
        } else {
          await updateDoc(doc(db, 'notifications', row._id), data);
        }
        renderToast('Saved');
      } }
    ]
  });
}

function simulateSend(row) {
  if (row.channel === 'email') {
    window.location.href = `mailto:?subject=${encodeURIComponent(row.name)}&body=${encodeURIComponent(row.body || '')}`;
  } else if (row.channel === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(row.body || '')}`, '_blank');
  } else {
    renderToast('Push sent (simulated)');
  }
}

onSnapshot(collection(db, 'notifications'), (snap) => {
  allRows = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  renderRows(allRows);
});

function renderRows(rows) {
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${r.channel}</td>
      <td>${r.scheduleAt ? new Date(r.scheduleAt).toLocaleString() : '-'}</td>
      <td>
        <button class="btn" data-send="${r._id}">Send Now</button>
        <button class="btn" data-edit="${r._id}">Edit</button>
        <button class="btn" data-del="${r._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

exportBtn.addEventListener('click', () => {
  const rows = allRows.map(({ _id, ...r }) => r);
  downloadBlobCSV('notification_templates.csv', rows);
});