document.getElementById('feeForm').onsubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  data.append('action', 'add_fee');
  const res = await fetch('fees.php', { method: 'POST', body: data });
  const msg = await res.text();
  document.getElementById('feeFormMsg').textContent = msg === 'added' ? "Fee added!" : "Fee updated!";
  setTimeout(()=>location.reload(), 800);
};

document.getElementById('student_id').addEventListener('change', function() {
  const selected = this.options[this.selectedIndex];
  document.getElementById('class').value = selected.getAttribute('data-class') || '';
  document.getElementById('class_time').value = selected.getAttribute('data-class_time') || '';
});

document.getElementById('month_year').addEventListener('change', checkPendingStatus);
document.getElementById('student_id').addEventListener('change', checkPendingStatus);

async function checkPendingStatus() {
  const student_id = document.getElementById('student_id').value;
  const month_year = document.getElementById('month_year').value;
  if (!student_id || !month_year) return;
  const res = await fetch('fees.php', {
    method: 'POST',
    body: new URLSearchParams({
      action: 'check_status',
      student_id,
      month_year
    })
  });
  const status = await res.text();
  if (status !== 'pending') {
    document.getElementById('feeFormMsg').textContent = "Fee for this month is already paid or not available.";
    document.querySelector('#feeForm button[type="submit"]').disabled = true;
  } else {
    document.getElementById('feeFormMsg').textContent = "";
    document.querySelector('#feeForm button[type="submit"]').disabled = false;
  }
}


document.getElementById('student_search').addEventListener('input', function() {
  const val = this.value.trim().toLowerCase();
  const found = studentsData.find(s =>
    s.unique_id.toLowerCase() === val || s.name.toLowerCase() === val
  );
  if (found) {
    document.getElementById('student_id').value = found.id;
    document.getElementById('class').value = found.class;
    document.getElementById('class_time').value = found.class_time;
  }
});

document.getElementById('exportPDF').onclick = function() {
  const table = document.querySelector('.card .table-responsive');
  html2canvas(table).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF('l', 'pt', 'a4');
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
    pdf.save("fees_report.pdf");
  });
};