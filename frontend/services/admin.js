let allResults = [];

function renderTable(data) {
  const tbody = document.querySelector("#results-table tbody");
  tbody.innerHTML = "";

  data.forEach((r, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.student}</td>
      <td>${r.score}</td>
      <td>${r.total}</td>
      <td>${new Date(r.submitted_at).toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
}

function fetchResults() {
  fetch("http://localhost:5000/api/results")
    .then(res => res.json())
    .then(results => {
      allResults = results.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
      renderTable(allResults);
    })
    .catch(err => {
      console.error("Failed to load results:", err);
      alert("Could not fetch results from the backend.");
    });
}

function initSearchBox() {
  const searchBox = document.getElementById("search-box");
  searchBox.addEventListener("input", () => {
    const keyword = searchBox.value.toLowerCase();
    const filtered = allResults.filter(r => r.student.toLowerCase().includes(keyword));
    renderTable(filtered);
  });
}

function initCSVExport() {
  const btn = document.getElementById("export-csv");
  btn.addEventListener("click", () => {
    const header = ["Student", "Score", "Total", "Date"];
    const rows = allResults.map(r => [
      r.student,
      r.score,
      r.total,
      new Date(r.submitted_at).toLocaleString()
    ]);

    const csv = [header, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quiz_results.csv";
    a.click();
  });
}

function initPDFExport() {
  const btn = document.getElementById("export-pdf");
  btn.addEventListener("click", async () => {
    if (!window.jspdf) {
      alert("PDF export library not loaded.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("SPT-QuizBridge Results", 10, 10);

    let y = 20;
    allResults.forEach((r, i) => {
      doc.text(
        `${i + 1}. ${r.student} — ${r.score}/${r.total} on ${new Date(r.submitted_at).toLocaleString()}`,
        10,
        y
      );
      y += 8;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("quiz_results.pdf");
  });
}

// Initialize everything after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  fetchResults();
  initSearchBox();
  initCSVExport();
  initPDFExport();
});
