let quizData = [];

fetch("http://localhost:5000/api/quiz")
  .then(res => res.json())
  .then(data => {
    quizData = data;
    renderQuiz(data);
  });

function renderQuiz(questions) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  questions.forEach((q, idx) => {
    const qDiv = document.createElement("div");
    qDiv.innerHTML = `
      <h3>Q${idx + 1}: ${q.question}</h3>
      ${q.options.map(opt => `
        <label>
          <input type="radio" name="q${q.id}" value="${opt}"> ${opt}
        </label><br>`
      ).join("")}
    `;
    container.appendChild(qDiv);
  });

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit Quiz";
  submitBtn.onclick = handleSubmit;
  container.appendChild(submitBtn);
}

// function handleSubmit() {
//   const answers = quizData.map(q => {
//     const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
//     return {
//       id: q.id,
//       selected: selected ? selected.value : null
//     };
//   });
function handleSubmit() {
  const name = document.getElementById("student-name").value.trim();
  if (!name) {
    alert("Please enter your name before submitting.");
    return;
  }

  const answers = quizData.map(q => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    return {
      id: q.id,
      selected: selected ? selected.value : null
    };
  });

  fetch("http://localhost:5000/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student: name, answers })
  })
  .then(res => res.json())
  .then(result => {
    showFeedback(result);
  });
}


  fetch("http://localhost:5000/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers })
  })
  .then(res => res.json())
  .then(result => {
    showFeedback(result);
  });
}

function showFeedback(result) {
  const container = document.getElementById("quiz-container");
  const feedbackDiv = document.createElement("div");
  feedbackDiv.className = "feedback";

  feedbackDiv.innerHTML = `
    <h3>Your Score: ${result.score} / ${quizData.length}</h3>
    ${result.feedback.map(f => `
      <p>Q${f.id}: ${f.correct ? "✅ Correct" : `❌ Incorrect – Correct answer: ${f.correct_answer}`}</p>
    `).join("")}
  `;

  container.appendChild(feedbackDiv);
}
