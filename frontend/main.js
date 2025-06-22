fetch("http://localhost:5000/api/quiz")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("quiz-container");
    data.forEach((q, idx) => {
      const qDiv = document.createElement("div");
      qDiv.innerHTML = `<h3>Q${idx+1}: ${q.question}</h3>` +
        q.options.map(opt =>
          `<label><input type="radio" name="q${q.id}" value="${opt}" /> ${opt}</label><br>`
        ).join("");
      container.appendChild(qDiv);
    });
  });
