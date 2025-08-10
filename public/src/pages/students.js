import { db, collection, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, deleteDoc } from '/src/firebase-init.js';
import { showModal, formToObject, renderToast, downloadBlobCSV } from '/src/ui.js';

const tbody = document.querySelector('#studentsTable tbody');
const addBtn = document.getElementById('addStudent');
const searchEl = document.getElementById('searchStudent');
const filterDivision = document.getElementById('filterDivision');
const uploadEl = document.getElementById('csvUpload');
const exportBtn = document.getElementById('exportStudents');

let allStudents = [];

function renderRows(rows) {
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.studentId || ''}</td>
      <td>${r.name || ''}</td>
      <td>${r.phone || ''}</td>
      <td>${r.email || ''}</td>
      <td>${r.division || ''}</td>
      <td>${r.course || ''}</td>
      <td>${r.batch || ''}</td>
      <td>₹${r.feesPaid || 0}</td>
      <td>₹${r.feesOutstanding || 0}</td>
      <td>
        <button class="btn" data-edit="${r._id}">Edit</button>
        <button class="btn" data-docs="${r._id}">Documents</button>
        <button class="btn" data-del="${r._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterRows() {
  const q = (searchEl.value || '').toLowerCase();
  const d = filterDivision.value;
  const filtered = allStudents.filter(s => {
    if (d !== 'All' && s.division !== d) return false;
    const hay = [s.name, s.course, s.batch].map(x => (x || '').toLowerCase()).join(' ');
    return hay.includes(q);
  });
  renderRows(filtered);
}

addBtn.addEventListener('click', () => openForm());
searchEl.addEventListener('input', filterRows);
filterDivision.addEventListener('change', filterRows);

tbody.addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-edit');
  const delId = e.target.getAttribute('data-del');
  const docsId = e.target.getAttribute('data-docs');
  if (id) {
    const row = allStudents.find(r => r._id === id);
    openForm(row);
  } else if (docsId) {
    const row = allStudents.find(r => r._id === docsId);
    openDocs(row);
  } else if (delId) {
    if (confirm('Delete this student?')) {
      await deleteDoc(doc(db, 'students', delId));
      renderToast('Deleted');
    }
  }
});

function openForm(row = null) {
  const el = document.createElement('form');
  el.innerHTML = `
    <div class="grid grid-2">
      <label>Student ID<input name="studentId" value="${row?.studentId ?? ''}" required></label>
      <label>Name<input name="name" value="${row?.name ?? ''}" required></label>
      <label>Phone<input name="phone" value="${row?.phone ?? ''}"></label>
      <label>Email<input type="email" name="email" value="${row?.email ?? ''}"></label>
      <label>Division
        <select name="division" required>
          <option ${row?.division===''?'selected':''} disabled value="">Select</option>
          <option ${row?.division==='CAPT'?'selected':''}>CAPT</option>
          <option ${row?.division==='LBS'?'selected':''}>LBS</option>
          <option ${row?.division==='Gama Abacus'?'selected':''}>Gama Abacus</option>
          <option ${row?.division==='Micro Computers'?'selected':''}>Micro Computers</option>
          <option ${row?.division==='Other'?'selected':''}>Other</option>
        </select>
      </label>
      <label>Course<input name="course" value="${row?.course ?? ''}"></label>
      <label>Batch<input name="batch" value="${row?.batch ?? ''}"></label>
      <label>Join Date<input type="date" name="joinDate" value="${row?.joinDate ? row.joinDate.split('T')[0] : ''}"></label>
      <label>Fees Paid<input type="number" step="0.01" name="feesPaid" value="${row?.feesPaid ?? 0}"></label>
      <label>Fees Outstanding<input type="number" step="0.01" name="feesOutstanding" value="${row?.feesOutstanding ?? 0}"></label>
    </div>
  `;
  showModal({
    title: row ? 'Edit Student' : 'Add Student',
    content: el,
    actions: [
      { label: 'Cancel' },
      { label: row ? 'Save' : 'Create', variant: 'btn-primary', onClick: async () => {
        const data = formToObject(el);
        data.feesPaid = Number(data.feesPaid || 0);
        data.feesOutstanding = Number(data.feesOutstanding || 0);
        if (!row) {
          data.createdAt = serverTimestamp();
          await addDoc(collection(db, 'students'), data);
        } else {
          await updateDoc(doc(db, 'students', row._id), data);
        }
        renderToast('Saved');
      } }
    ]
  });
}

function openDocs(row) {
  const el = document.createElement('div');
  const list = (row.documents || []).map(d => `<li><a href="${d.url}" target="_blank">${d.name}</a></li>`).join('');
  el.innerHTML = `
    <ul>${list || '<li class="muted">No documents</li>'}</ul>
    <label>Upload<input type="file" id="docFile" multiple></label>
  `;
  showModal({
    title: 'Documents',
    content: el,
    actions: [
      { label: 'Close' },
      { label: 'Upload', variant: 'btn-primary', onClick: async () => {
        const fileInput = el.querySelector('#docFile');
        if (!fileInput.files.length) return false;
        const files = Array.from(fileInput.files);
        const uploaded = [];
        for (const f of files) {
          const url = await uploadStudentDoc(row._id, f);
          uploaded.push({ name: f.name, url });
        }
        const docsArr = [...(row.documents || []), ...uploaded];
        await updateDoc(doc(db, 'students', row._id), { documents: docsArr });
        renderToast('Uploaded');
      } }
    ]
  });
}

async function uploadStudentDoc(studentId, file) {
  const { storage, storageRef, uploadBytes, getDownloadURL } = await import('/src/firebase-init.js');
  const ref = storageRef(storage, `students/${studentId}/${Date.now()}_${file.name}`);
  await uploadBytes(ref, file);
  return await getDownloadURL(ref);
}

uploadEl.addEventListener('change', () => {
  const file = uploadEl.files[0];
  if (!file) return;
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const rows = results.data;
      for (const r of rows) {
        const data = {
          studentId: r.studentId || r.id || '',
          name: r.name || '',
          phone: r.phone || '',
          email: r.email || '',
          division: r.division || 'Other',
          course: r.course || '',
          batch: r.batch || '',
          joinDate: r.joinDate || null,
          feesPaid: Number(r.feesPaid || 0),
          feesOutstanding: Number(r.feesOutstanding || 0),
          documents: [],
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'students'), data);
      }
      renderToast('CSV imported');
    }
  });
});

exportBtn.addEventListener('click', () => {
  const rows = allStudents.map(({ _id, documents, ...rest }) => rest);
  if (!rows.length) return renderToast('No data');
  downloadBlobCSV('students.csv', rows);
});

onSnapshot(collection(db, 'students'), (snap) => {
  allStudents = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  filterRows();
});