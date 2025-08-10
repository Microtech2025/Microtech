import { initApp, getDb, getStorage, downloadJSON, toDateOnlyString } from "./app.js";

await initApp({ requiredRoles: ["Admin"] });
const db = getDb();
const storage = getStorage();

const weeklyBackup = document.getElementById("weeklyBackup");
const manualBackup = document.getElementById("manualBackup");
const downloadBackupBtn = document.getElementById("downloadBackup");
const pwaToggle = document.getElementById("pwaToggle");
const feeReminder = document.getElementById("feeReminder");
const saveTemplates = document.getElementById("saveTemplates");
const uploadDocsBtn = document.getElementById("uploadDocs");
const docFiles = document.getElementById("docFiles");
const docList = document.getElementById("docList");

const offerName = document.getElementById("offerName");
const offerDiscount = document.getElementById("offerDiscount");
const offerExpiry = document.getElementById("offerExpiry");
const addOffer = document.getElementById("addOffer");
const offersTbody = document.querySelector("#offersTable tbody");

const refName = document.getElementById("refName");
const createRef = document.getElementById("createRef");
const refResult = document.getElementById("refResult");
const refTbody = document.querySelector("#refTable tbody");

let unsubscribeOffers = () => {};
let unsubscribeRefs = () => {};

async function loadSettings() {
  const doc = await db.collection("settings").doc("system").get();
  if (doc.exists) {
    const s = doc.data();
    weeklyBackup.checked = !!s.weeklyBackup;
    pwaToggle.checked = !!s.pwaEnabled;
    feeReminder.value = s.feeReminderTemplate || "Hello {name}, your fees of {amount} are due.";
  }
}
await loadSettings();

saveTemplates?.addEventListener("click", async () => {
  await db.collection("settings").doc("system").set({ feeReminderTemplate: feeReminder.value }, { merge: true });
  alert("Saved");
});

weeklyBackup?.addEventListener("change", async () => {
  await db.collection("settings").doc("system").set({ weeklyBackup: weeklyBackup.checked }, { merge: true });
});

pwaToggle?.addEventListener("change", async () => {
  await db.collection("settings").doc("system").set({ pwaEnabled: pwaToggle.checked }, { merge: true });
  if (pwaToggle.checked && 'serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('./sw.js'); } catch {}
  }
});

uploadDocsBtn?.addEventListener("click", async () => {
  const files = docFiles.files;
  if (!files || !files.length) { alert("Choose files"); return; }
  const uploaded = [];
  for (const file of files) {
    const path = `documents/${Date.now()}-${file.name}`;
    const ref = storage.ref().child(path);
    await ref.put(file);
    const url = await ref.getDownloadURL();
    uploaded.push({ name: file.name, url });
  }
  docList.innerHTML = uploaded.map((d) => `<div><a href="${d.url}" target="_blank">${d.name}</a></div>`).join("");
});

manualBackup?.addEventListener("click", async () => {
  const data = await exportAll();
  const fileName = `backup-${new Date().toISOString().slice(0,10)}.json`;
  const ref = storage.ref().child(`backups/${fileName}`);
  await ref.put(new Blob([JSON.stringify(data)], { type: 'application/json' }));
  alert("Backup uploaded to Storage/backups");
});

downloadBackupBtn?.addEventListener("click", async () => {
  const data = await exportAll();
  downloadJSON(`backup-${new Date().toISOString().slice(0,10)}.json`, data);
});

async function exportAll() {
  const collections = ["students","staff","fees","transactions","campaigns","offers","referrals"];
  const output = {};
  for (const name of collections) {
    const snap = await db.collection(name).get();
    output[name] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return output;
}

addOffer?.addEventListener("click", async () => {
  const name = offerName.value.trim();
  const discount = Number(offerDiscount.value || 0);
  const expiry = offerExpiry.value ? new Date(offerExpiry.value) : null;
  if (!name || !discount) { alert("Name and discount required"); return; }
  await db.collection("offers").add({ name, discount, expiry });
  offerName.value = ""; offerDiscount.value = ""; offerExpiry.value = "";
});

function startOffersRealtime() {
  unsubscribeOffers();
  unsubscribeOffers = db.collection("offers").orderBy("name").onSnapshot((snap) => {
    const list = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    offersTbody.innerHTML = list.map((o) => `<tr>
      <td>${o.name}</td><td>${o.discount}%</td><td>${o.expiry ? toDateOnlyString(o.expiry.toDate ? o.expiry.toDate() : o.expiry) : ""}</td>
      <td><button class="btn danger" data-id="${o._id}">Delete</button></td>
    </tr>`).join("");
  });
}
startOffersRealtime();

offersTbody?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  if (confirm("Delete offer?")) await db.collection("offers").doc(id).delete();
});

createRef?.addEventListener("click", async () => {
  const owner = refName.value.trim();
  if (!owner) { alert("Enter owner name"); return; }
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  await db.collection("referrals").doc(code).set({ code, owner, uses: 0, rewards: 0, createdAt: new Date() });
  refResult.textContent = `Referral code created: ${code}`;
  refName.value = "";
});

function startRefRealtime() {
  unsubscribeRefs();
  unsubscribeRefs = db.collection("referrals").orderBy("createdAt", "desc").onSnapshot((snap) => {
    const list = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    refTbody.innerHTML = list.map((r) => `<tr>
      <td>${r.code}</td><td>${r.owner}</td><td>${r.uses || 0}</td><td>${r.rewards || 0}</td>
      <td><button class="btn danger" data-id="${r._id}">Delete</button></td>
    </tr>`).join("");
  });
}
startRefRealtime();

refTbody?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  if (confirm("Delete referral?")) await db.collection("referrals").doc(id).delete();
});