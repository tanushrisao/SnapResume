from flask import Flask, request, jsonify, render_template
app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")
@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    resume = data.get("resume")
    job_description = data.get("job_description")

    print("Resume:", resume)
    print("Job Description:", job_description)

    return jsonify({
        "score": 75,
        "missing_keywords": ["Python", "Flask", "APIs"]
    })

if __name__ == "__main__":
    app.run(debug=True)