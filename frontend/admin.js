let allResults = [];

function renderTable(data) {
  const tbody = document.querySelector("#results-table tbody");
  tbody.innerHTML = ""; // Clear previous rows

  data.forEach(r => {
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

// Fetch and display results
fetch("http://localhost:5000/api/results")
  .then(res => res.json())
  .then(results => {
    allResults = results.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    renderTable(allResults);
  });

// Add search functionality
document.getElementById("search-box").addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allResults.filter(r =>
    r.student.toLowerCase().includes(keyword)
  );
  renderTable(filtered);
});

document.getElementById("export-csv").addEventListener("click", () => {
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
document.getElementById("export-pdf").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text("SPT-QuizBridge Results", 10, 10);

  let y = 20;
  allResults.forEach((r, i) => {
    doc.text(`${i + 1}. ${r.student} — ${r.score}/${r.total} on ${new Date(r.submitted_at).toLocaleString()}`, 10, y);
    y += 8;
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("quiz_results.pdf");
});


// fetch("http://localhost:5000/api/results")
//   .then(res => res.json())
//   .then(results => {
//     const tbody = document.querySelector("#results-table tbody");
//     results.forEach(r => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${r.student}</td>
//         <td>${r.score}</td>
//         <td>${r.total}</td>
//         <td>${new Date(r.submitted_at).toLocaleString()}</td>
//       `;
//       tbody.appendChild(row);
//     });
//   })
//   .catch(err => {
//     alert("Failed to load results.");
//     console.error(err);
//   });
