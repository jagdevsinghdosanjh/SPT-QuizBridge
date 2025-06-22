export async function fetchQuizData() {
  const res = await fetch("http://localhost:5000/api/quiz");
  return res.json();
}

export async function submitQuiz(student, answers) {
  const res = await fetch("http://localhost:5000/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student, answers })
  });
  return res.json();
}
