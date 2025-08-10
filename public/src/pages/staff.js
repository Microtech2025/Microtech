import { db, collection, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, deleteDoc } from '/src/firebase-init.js';
import { showModal, formToObject, renderToast } from '/src/ui.js';

const tbody = document.querySelector('#staffTable tbody');
const addBtn = document.getElementById('addStaff');
const filterSchedule = document.getElementById('paymentScheduleFilter');

let allStaff = [];

addBtn.addEventListener('click', () => openForm());
filterSchedule.addEventListener('change', filterRows);

tbody.addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-edit');
  const delId = e.target.getAttribute('data-del');
  const attId = e.target.getAttribute('data-att');
  if (id) {
    const row = allStaff.find(r => r._id === id);
    openForm(row);
  } else if (attId) {
    const row = allStaff.find(r => r._id === attId);
    await markAttendance(row);
  } else if (delId) {
    if (confirm('Delete staff?')) {
      await deleteDoc(doc(db, 'staff', delId));
      renderToast('Deleted');
    }
  }
});

function openForm(row = null) {
  const el = document.createElement('form');
  el.innerHTML = `
    <div class="grid grid-2">
      <label>Staff ID<input name="staffId" value="${row?.staffId ?? ''}" required></label>
      <label>Name<input name="name" value="${row?.name ?? ''}" required></label>
      <label>Role<input name="role" value="${row?.role ?? ''}" required></label>
      <label>Salary<input type="number" step="0.01" name="salary" value="${row?.salary ?? 0}" required></label>
      <label>Payment Schedule
        <select name="paymentSchedule" required>
          <option ${row?.paymentSchedule==='monthly'?'selected':''} value="monthly">Monthly</option>
          <option ${row?.paymentSchedule==='biweekly'?'selected':''} value="biweekly">Bi-weekly</option>
        </select>
      </label>
    </div>
  `;
  showModal({
    title: row ? 'Edit Staff' : 'Add Staff',
    content: el,
    actions: [
      { label: 'Cancel' },
      { label: row ? 'Save' : 'Create', variant: 'btn-primary', onClick: async () => {
        const data = formToObject(el);
        data.salary = Number(data.salary || 0);
        if (!row) {
          data.createdAt = serverTimestamp();
          data.attendance = [];
          await addDoc(collection(db, 'staff'), data);
        } else {
          await updateDoc(doc(db, 'staff', row._id), data);
        }
        renderToast('Saved');
      } }
    ]
  });
}

async function markAttendance(row) {
  const today = new Date().toISOString().slice(0,10);
  const attendance = Array.isArray(row.attendance) ? [...row.attendance] : [];
  if (!attendance.find(a => a.date === today)) {
    attendance.push({ date: today, status: 'Present' });
    await updateDoc(doc(db, 'staff', row._id), { attendance });
    renderToast('Attendance marked');
  } else {
    renderToast('Already marked today');
  }
}

function renderRows(rows) {
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    const count = (r.attendance || []).length;
    tr.innerHTML = `
      <td>${r.staffId}</td>
      <td>${r.name}</td>
      <td>${r.role}</td>
      <td>₹${r.salary}</td>
      <td>${r.paymentSchedule}</td>
      <td>${count} days <button class="btn" data-att="${r._id}">Mark Today</button></td>
      <td>
        <button class="btn" data-edit="${r._id}">Edit</button>
        <button class="btn" data-del="${r._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterRows() {
  const f = filterSchedule.value;
  const filtered = allStaff.filter(s => f==='All' || s.paymentSchedule===f);
  renderRows(filtered);
}

onSnapshot(collection(db, 'staff'), (snap) => {
  allStaff = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  filterRows();
});