# ⚡ SnapResume — AI Resume Analyzer

A web app that instantly analyzes your resume against any job description 
using Google's Gemini AI. Built for students and freshers who want to know 
exactly why they're getting rejected — and how to fix it.

## 🎯 What it does

- **ATS Score** — Scores your resume 0–100 against the job description
- **Keyword Analysis** — Shows which important keywords are present ✅ and which are missing ❌
- **Bullet Point Rewriter** — Rewrites weak bullet points with strong action verbs and metrics
- **ATS Tips** — Gives specific formatting advice to pass Applicant Tracking Systems
- **Download Report** — Export your full analysis as a text file

## 🛠️ Built With

- **Python + Flask** — Backend REST API
- **Google Gemini AI API** — Resume analysis and rewriting
- **HTML + CSS + JavaScript** — Frontend UI with animated score ring
- **Render** — Cloud deployment

## 🚀 Run Locally

1. Clone the repo
   git clone https://github.com/YOURUSERNAME/snapresume.git
   cd snapresume

2. Create and activate virtual environment
   python -m venv venv
   venv\Scripts\activate       # Windows
   source venv/bin/activate    # Mac/Linux

3. Install dependencies
   pip install -r requirements.txt

4. Add your Gemini API key
   Create a .env file in the root folder:
   GEMINI_API_KEY=your_key_here
   Get a free key at: https://aistudio.google.com

5. Run the app
   python app.py
   Open http://127.0.0.1:5000 in your browser

## 📁 Project Structure

snapresume/
├── app.py              # Flask backend + Gemini API integration
├── templates/
│   └── index.html      # Main UI
├── static/
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic
├── .env                # API key (not uploaded to GitHub)
├── .gitignore
└── requirements.txt

## 👨‍💻 Author

Your Name — 2nd Year ECE Student, IIIT Dharwad
GitHub: github.com/YOURUSERNAME
LinkedIn: linkedin.com/in/YOURUSERNAME
