from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random

app = Flask(__name__)
CORS(app)  # Enables requests from your frontend

# Load questions from JSON file
with open('data/sample_questions.json') as f:
    QUESTIONS = json.load(f)

@app.route('/api/quiz', methods=['GET'])
def get_quiz():
    shuffled = QUESTIONS.copy()
    random.shuffle(shuffled)
    return jsonify(shuffled[:5])  # Return 5 random questions

@app.route('/api/submit', methods=['POST'])
def submit_quiz():
    data = request.json
    student = data.get('student')
    user_answers = data.get('answers', [])
    score = 0
    feedback = []

    for ans in user_answers:
        q = next((q for q in QUESTIONS if q['id'] == ans['id']), None)
        if q:
            is_correct = q['correct'] == ans['selected']
            if is_correct:
                score += 1
            feedback.append({
                'id': q['id'],
                'correct': is_correct,
                'correct_answer': q['correct']
            })

    result = {
        'student': student,
        'score': score,
        'feedback': feedback
    }

    print(f"[LOG] {student} scored {score} / {len(user_answers)}")
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
