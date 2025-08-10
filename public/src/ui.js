const modalRoot = document.getElementById('modal-root');

export function showModal({ title = '', content = '', actions = [] } = {}) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <header>
      <div class="card-title">${title}</div>
      <button class="btn btn-icon" aria-label="Close">✕</button>
    </header>
    <div class="modal-content">${typeof content === 'string' ? content : ''}</div>
    <footer class="toolbar"></footer>
  `;
  const footer = modal.querySelector('footer');
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = `btn ${a.variant ?? ''}`.trim();
    btn.textContent = a.label;
    btn.addEventListener('click', async () => {
      const shouldClose = await a.onClick?.();
      if (shouldClose !== false) close();
    });
    footer.appendChild(btn);
  });
  function close() { backdrop.remove(); }
  modal.querySelector('button[aria-label="Close"]').addEventListener('click', close);
  if (content instanceof HTMLElement) modal.querySelector('.modal-content').appendChild(content);
  backdrop.appendChild(modal);
  modalRoot.appendChild(backdrop);
  return { close };
}

export function renderToast(msg, variant = 'info') {
  const el = document.createElement('div');
  el.className = 'chip';
  el.style.position = 'fixed';
  el.style.bottom = '16px';
  el.style.right = '16px';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

export function formToObject(form) {
  const data = new FormData(form);
  const obj = {};
  for (const [k, v] of data.entries()) obj[k] = v;
  return obj;
}

export function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

export function setActiveNav(hash) {
  document.querySelectorAll('aside nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${hash}`);
  });
}

export function downloadBlobCSV(filename, rows) {
  const header = Object.keys(rows[0] ?? {}).join(',');
  const csv = [header, ...rows.map(r => Object.values(r).map(escapeCSV).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
function escapeCSV(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}