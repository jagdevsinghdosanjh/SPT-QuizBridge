export function renderQuiz(questions, onSubmit) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  const info = document.createElement("div");
  info.innerHTML = `
    <label>Name: <input type="text" id="student-name" required /></label><br><br>
  `;
  container.appendChild(info);

  questions.forEach((q, idx) => {
    const qBlock = document.createElement("div");
    qBlock.innerHTML = `
      <h3>Q${idx + 1}: ${q.question}</h3>
      ${q.options.map(opt => `
        <label><input type="radio" name="q${q.id}" value="${opt}"> ${opt}</label><br>
      `).join("")}
    `;
    container.appendChild(qBlock);
  });

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit Quiz";
  submitBtn.onclick = onSubmit;
  container.appendChild(submitBtn);
}

export function getStudentName() {
  return document.getElementById("student-name")?.value.trim();
}

export function collectAnswers(questions) {
  return questions.map(q => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    return {
      id: q.id,
      selected: selected ? selected.value : null
    };
  });
}

export function showFeedback(result, totalQuestions) {
  const container = document.getElementById("quiz-container");
  const feedback = document.createElement("div");
  feedback.className = "feedback";

  feedback.innerHTML = `
    <h3>${result.student}, your score is: ${result.score} / ${totalQuestions}</h3>
    ${result.feedback.map(f => `
      <p>Q${f.id}: ${f.correct ? "✅ Correct" : `❌ Incorrect – Correct answer: ${f.correct_answer}`}</p>
    `).join("")}
  `;

  container.appendChild(feedback);
}
