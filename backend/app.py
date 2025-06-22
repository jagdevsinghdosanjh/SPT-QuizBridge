from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017/")  # Use your actual connection string if hosted
db = client["spt_quiz"]
results_collection = db["results"]

@app.route('/')
def home():
    return '✅ SPT-QuizBridge backend is running!'

@app.route('/api/results', methods=['GET'])
def get_results():
    results = list(results_collection.find({}, {'_id': 0}))
    return jsonify(results)


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
    results_collection.insert_one({
    "student": student,
    "answers": user_answers,
    "score": score,
    "total": len(user_answers),
    "submitted_at": datetime.utcnow()
})

    print(f"[LOG] {student} scored {score} / {len(user_answers)}")
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
