from flask import Flask, request, jsonify
from flask_cors import CORS
from fuzzywuzzy import fuzz

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

def fuzzy_match(resume_skills, jd_skills):
    resume_set = set(str(skill).lower().strip() for skill in resume_skills)
    jd_set = set(str(skill).lower().strip() for skill in jd_skills)
    matched = sum(
        max(fuzz.ratio(jd_skill, rs) for rs in resume_set) >= 70 for jd_skill in jd_set
    )
    return (matched / len(jd_set)) * 100 if jd_set else 0

interviewers = [
    ["Priya_Sharma", ["JavaScript", "React", "HTML/CSS", "RESTful APIs", "MongoDB", "Jest"]],
    ["Rahul_Mehta", ["GCP", "Azure", "CI/CD", "Kubernetes", "Google Cloud Armor", "Terraform"]],
    ["Ananya_Patel", ["C++", "Python", "JavaScript", "React", "MongoDB", "SQL", "Docker"]],
    ["Vikram_Joshi", ["Python", "GCP", "Microservices", "Performance Tuning", "SQL", "Apache JMeter"]],
    ["Neha_Gupta", ["JavaScript", "React", "HTML/CSS", "Agile Methodologies", "Jenkins", "CI/CD"]],
    ["Arjun_Reddy", ["Azure", "GCP", "Serverless", "CI/CD Pipelines", "Cloud Cost Optimization", "Istio"]],
    ["Sanya_Malhotra", ["Python", "C++", "MongoDB", "SQL", "React", "AWS Lambda", "API Gateway"]],
    ["Aditya_Iyer", ["CI/CD", "Docker", "Kubernetes", "Cloud Armor", "Wireshark", "Bash Scripting"]],
    ["Kavya_Singh", ["JavaScript", "React", "JMeter", "Lighthouse", "REST APIs", "Selenium"]],
    ["Rohan_Desai", ["C++", "Python", "Microservices", "SQL", "Google Cloud Functions", "Distributed Systems"]]
]

@app.route('/upload', methods=['POST'])
def upload_file():
    print("Received request at /upload")  # Debugging print
    print(f"Request headers: {request.headers}")  # Print headers
    print(f"Request content type: {request.content_type}")  # Print content type

    if 'file' not in request.files:
        print("No file part in request")  # Debugging print
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        print("Empty file received")  # Debugging print
        return jsonify({"error": "No selected file"}), 400

    print(f"File received: {file.filename}")  # Debugging print
    return jsonify({"message": "File uploaded successfully"})

@app.route('/process', methods=['POST'])
def process_data():
    print("Received request at /process")  # Debugging print
    data = request.json
    print(f"Request data: {data}")  # Print the received JSON

    selected_option = data.get('option')
    skills = data.get('skills', [])

    if not isinstance(selected_option, int):
        print(f"Invalid option type: {type(selected_option)}")  # Debugging print
        return jsonify({"error": "Invalid option"}), 400

    # Perform skill matching
    match_scores = []
    for interviewer in interviewers:
        name, interviewer_skills = interviewer
        score = fuzzy_match(interviewer_skills, skills)
        match_scores.append((name, score))

    # Sort and get the top `selected_option` interviewers
    match_scores.sort(key=lambda x: x[1], reverse=True)
    ranked_interviewers = [name for name, _ in match_scores[:selected_option]]

    print(f"Selected option: {selected_option}")  # Debugging print
    print(f"Ranked interviewers: {ranked_interviewers}")  # Debugging print

    return jsonify({"message": "Received", "option": selected_option, "interviewers": ranked_interviewers})

if __name__ == '__main__':
    port = 5001
    print(f"Server is running on http://localhost:{port}")  # Debugging print
    app.run(debug=True, host="0.0.0.0", port=port)
