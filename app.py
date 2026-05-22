from dotenv import load_dotenv
load_dotenv()

import os
import json
import re
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from google import genai

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyAnogBTY4Qbe11ByM9QTzkjzF5udbOOekU")
client = genai.Client(api_key=GEMINI_API_KEY)

PROMPT_TEMPLATE = """You are an expert ATS (Applicant Tracking System) resume reviewer with 10 years of experience in tech hiring.
Analyze the resume against the job description and return ONLY a valid JSON object — no markdown, no explanation, no backticks, no extra text. 
If the resume has no weak bullets, return 2 examples of good bullets already present.

Return this EXACT JSON structure:
{
  "score": <integer 0-100>,
  "score_reason": "<one sentence explaining the score>",
  "missing_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "present_keywords": ["keyword1", "keyword2", "keyword3"],
  "weak_bullets": [
    {
      "original": "<exact weak bullet from resume>",
      "improved": "<rewritten bullet with strong action verb + metric + impact>"
    },
    {
      "original": "<exact weak bullet from resume>",
      "improved": "<rewritten bullet with strong action verb + metric + impact>"
    },
    {
      "original": "<exact weak bullet from resume>",
      "improved": "<rewritten bullet with strong action verb + metric + impact>"
    }
  ],
  "ats_tips": [
    "<specific tip 1>",
    "<specific tip 2>",
    "<specific tip 3>"
  ]
}

Score guide: 0-40 = poor match. 41-65 = partial match. 66-85 = good match. 86-100 = excellent.
missing_keywords: important skills/tools in job description but NOT in resume.
present_keywords: important skills that appear in BOTH resume and job description.
weak_bullets: bullets with weak verbs like 'worked on', 'helped', 'was responsible for', or missing numbers/metrics.
ats_tips: specific, actionable formatting or content advice.

RESUME:
{resume}

JOB DESCRIPTION:
{job}

Return only the JSON. Nothing else."""


def analyze_resume(resume_text, job_description):
    prompt = PROMPT_TEMPLATE.replace("{resume}", resume_text).replace("{job}", job_description)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    raw = response.text.strip()
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"^```\s*", "", raw)
    raw = re.sub(r"```$", "", raw)
    raw = raw.strip()

    return json.loads(raw)


@app.route("/")
def index():
    return send_from_directory("templates", "index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received."}), 400

    resume_text = data.get("resume", "").strip()
    job_desc    = data.get("job_description", "").strip()

    if not resume_text or not job_desc:
        return jsonify({"error": "Both resume and job description are required."}), 400
    if len(resume_text) < 50:
        return jsonify({"error": "Resume is too short. Please paste your full resume."}), 400
    if len(job_desc) < 30:
        return jsonify({"error": "Job description is too short."}), 400

    try:
        result = analyze_resume(resume_text, job_desc)
        return jsonify(result)
    except json.JSONDecodeError:
        return jsonify({"error": "AI returned an unexpected response. Please try again."}), 500
    except Exception as e:
        return jsonify({"error": f"Something went wrong: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)