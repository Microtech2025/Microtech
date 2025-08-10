import { db, storage, storageRef, uploadBytes, getDownloadURL, deleteObject, collection, addDoc, onSnapshot, doc, deleteDoc, serverTimestamp } from '/src/firebase-init.js';
import { renderToast } from '/src/ui.js';

const tbody = document.querySelector('#documentsTable tbody');
const uploadEl = document.getElementById('docsUpload');
let allRows = [];

uploadEl.addEventListener('change', async () => {
  const files = Array.from(uploadEl.files || []);
  for (const f of files) {
    const ref = storageRef(storage, `documents/${Date.now()}_${f.name}`);
    await uploadBytes(ref, f);
    const url = await getDownloadURL(ref);
    await addDoc(collection(db, 'documents'), {
      name: f.name,
      url,
      path: ref.fullPath,
      createdAt: serverTimestamp(),
    });
  }
  uploadEl.value = '';
  renderToast('Uploaded');
});

onSnapshot(collection(db, 'documents'), (snap) => {
  allRows = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  renderRows(allRows);
});

tbody.addEventListener('click', async (e) => {
  const delId = e.target.getAttribute('data-del');
  if (delId) {
    const row = allRows.find(r => r._id === delId);
    if (!row) return;
    if (confirm('Delete document?')) {
      if (row.path) {
        await deleteObject(storageRef(storage, row.path));
      }
      await deleteDoc(doc(db, 'documents', delId));
      renderToast('Deleted');
    }
  }
});

function renderRows(rows) {
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.name}</td>
      <td><a href="${r.url}" target="_blank">Open</a></td>
      <td>${r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ''}</td>
      <td><button class="btn" data-del="${r._id}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}