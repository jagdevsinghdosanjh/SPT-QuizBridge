from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random

app = Flask(__name__)
CORS(app)

# Load questions from the JSON file
with open('data/sample_questions.json') as f:
    QUESTIONS = json.load(f)

@app.route('/api/quiz', methods=['GET'])
def get_quiz():
    random.shuffle(QUESTIONS)
    return jsonify(QUESTIONS[:5])  # Send 5 random questions

@app.route('/api/submit', methods=['POST'])
def submit_quiz():
    user_answers = request.json.get('answers', [])
    score = 0
    feedback = []

    for ans in user_answers:
        q = next((q for q in QUESTIONS if q['id'] == ans['id']), None)
        if q:
            correct = q['correct'] == ans['selected']
            if correct:
                score += 1
            feedback.append({
                'id': ans['id'],
                'correct': correct,
                'correct_answer': q['correct']
            })

    return jsonify({'score': score, 'feedback': feedback})

if __name__ == '__main__':
    app.run(debug=True)
