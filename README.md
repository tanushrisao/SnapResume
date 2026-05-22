# ⚡ SnapResume — AI Resume Analyzer

> An AI-powered web app that scores your resume against any job description, highlights missing keywords, rewrites weak bullet points, and gives ATS tips — instantly.

🔗 **Live Demo:** https://snapresume.onrender.com *(update this link after deployment)*

---

## 🎯 What It Does

Most students don't know why they're getting rejected. They send the same resume everywhere and hear nothing back. SnapResume fixes that.

Paste your resume + any job description → get an instant analysis:

- 🎯 **ATS Match Score** — 0 to 100 score showing how well your resume matches the job
- ✅ **Present Keywords** — important skills you already have that match the JD
- ❌ **Missing Keywords** — skills mentioned in the JD that are absent from your resume
- ✏️ **Bullet Point Rewriter** — rewrites weak bullets ("worked on", "helped with") into strong, metric-driven ones
- 💡 **ATS Tips** — specific formatting advice to pass Applicant Tracking Systems
- 📥 **Download Report** — export your full analysis as a text file

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, Flask |
| AI | Google Gemini API (gemini-2.5-flash) |
| Frontend | HTML, CSS, Vanilla JavaScript |
| Deployment | Render |

---

## 🚀 Run Locally

**1. Clone the repository**
```bash
git clone https://github.com/tanushrisao/SnapResume.git
cd SnapResume
```

**2. Create and activate virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Get a free Gemini API key**

Go to https://aistudio.google.com → Sign in → Get API Key → Create new key

**5. Create a `.env` file in the project root**
```
GEMINI_API_KEY=paste_your_key_here
```

**6. Run the app**
```bash
python app.py
```

Open http://127.0.0.1:5000 in your browser.

---

## 📁 Project Structure

```
SnapResume/
├── app.py              ← Flask backend + Gemini API integration
├── templates/
│   └── index.html      ← Main UI page
├── static/
│   ├── style.css       ← Styling and animations
│   └── script.js       ← Frontend logic, fetch calls, DOM rendering
├── .env                ← Your API key (never uploaded to GitHub)
├── .gitignore          ← Ignores venv, .env, pycache
├── requirements.txt    ← Python dependencies
└── README.md           ← You are here
```

---

## 💡 How It Works

1. User pastes resume text + job description into the web app
2. JavaScript sends both to the Flask backend via a POST request
3. Flask builds a structured prompt and calls the Gemini AI API
4. Gemini returns a JSON object with score, keywords, rewritten bullets, and tips
5. JavaScript parses the JSON and renders the animated results panel

---

## 👩‍💻 Author

**Tanushri Sao**
2nd Year ECE Student — IIIT Dharwad

- GitHub: @tanushrisao
- LinkedIn: https://github.com/tanushrisao

---

## ⭐ If this helped you, give it a star on GitHub!
