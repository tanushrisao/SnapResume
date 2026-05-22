// Stores the last result for download
let lastResult = null;

async function analyzeResume() {
  const resume = document.getElementById("resume").value.trim();
  const job    = document.getElementById("job").value.trim();
  const btn    = document.getElementById("analyzeBtn");
  const btnText   = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");
  const errorMsg  = document.getElementById("errorMsg");

  // --- Basic validation ---
  if (!resume || !job) {
    showError("Please paste both your resume and a job description.");
    return;
  }
  if (resume.length < 50) {
    showError("Your resume looks too short. Paste the full text.");
    return;
  }

  // --- Loading state ---
  hideError();
  btn.disabled = true;
  btnText.classList.add("hidden");
  btnLoader.classList.remove("hidden");
  document.getElementById("placeholder").classList.add("hidden");
  document.getElementById("results").classList.add("hidden");

  try {
    const response = await fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume: resume, job_description: job })
    });

    const data = await response.json();

    // --- Handle backend errors ---
    if (!response.ok || data.error) {
      showError(data.error || "Something went wrong. Please try again.");
      return;
    }

    // --- Render results ---
    lastResult = data;
    renderResults(data);

  } catch (err) {
    showError("Could not connect to the server. Make sure Flask is running.");
    console.error(err);
  } finally {
    btn.disabled = false;
    btnText.classList.remove("hidden");
    btnLoader.classList.add("hidden");
  }
}

function renderResults(data) {
  // Show results panel
  document.getElementById("results").classList.remove("hidden");

  // --- SCORE RING ---
  const score = data.score || 0;
  document.getElementById("scoreNumber").textContent = score;
  document.getElementById("scoreReason").textContent = data.score_reason || "";

  // Animate ring: circumference = 2 * pi * 50 = ~314
  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;
  const ring = document.getElementById("ringFill");

  // Color based on score
  if (score >= 75) ring.style.stroke = "#22c55e";       // green
  else if (score >= 50) ring.style.stroke = "#f59e0b";  // amber
  else ring.style.stroke = "#ef4444";                   // red

  // Animate after a tiny delay so transition fires
  setTimeout(() => { ring.style.strokeDashoffset = offset; }, 50);

  // Animate number counting up
  animateCount("scoreNumber", score);

  // --- PRESENT KEYWORDS ---
  const presentDiv = document.getElementById("presentKeywords");
  presentDiv.innerHTML = "";
  if (data.present_keywords && data.present_keywords.length > 0) {
    data.present_keywords.forEach(kw => {
      const span = document.createElement("span");
      span.className = "kw-badge kw-present";
      span.textContent = kw;
      presentDiv.appendChild(span);
    });
  } else {
    presentDiv.innerHTML = '<span class="kw-empty">None found</span>';
  }

  // --- MISSING KEYWORDS ---
  const missingDiv = document.getElementById("missingKeywords");
  missingDiv.innerHTML = "";
  if (data.missing_keywords && data.missing_keywords.length > 0) {
    data.missing_keywords.forEach(kw => {
      const span = document.createElement("span");
      span.className = "kw-badge kw-missing";
      span.textContent = kw;
      missingDiv.appendChild(span);
    });
  } else {
    missingDiv.innerHTML = '<span class="kw-empty">No major gaps!</span>';
  }

  // --- WEAK BULLET REWRITES ---
  const bulletsDiv = document.getElementById("weakBullets");
  bulletsDiv.innerHTML = "";
  if (data.weak_bullets && data.weak_bullets.length > 0) {
    data.weak_bullets.forEach(item => {
      const card = document.createElement("div");
      card.className = "bullet-card";
      card.innerHTML = `
        <div class="bullet-original">
          <span class="bullet-tag tag-before">Before</span>
          <p>${escapeHtml(item.original)}</p>
        </div>
        <div class="bullet-arrow">→</div>
        <div class="bullet-improved">
          <span class="bullet-tag tag-after">After</span>
          <p>${escapeHtml(item.improved)}</p>
          <button class="copy-btn" onclick="copyText(this, '${escapeForAttr(item.improved)}')">Copy</button>
        </div>
      `;
      bulletsDiv.appendChild(card);
    });
  } else {
    bulletsDiv.innerHTML = '<p class="kw-empty">No weak bullets found — great job!</p>';
  }

  // --- ATS TIPS ---
  const tipsList = document.getElementById("atsTips");
  tipsList.innerHTML = "";
  if (data.ats_tips && data.ats_tips.length > 0) {
    data.ats_tips.forEach(tip => {
      const li = document.createElement("li");
      li.textContent = tip;
      tipsList.appendChild(li);
    });
  }

  // Scroll to results on mobile
  document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" });
}

// Animate number counting from 0 to target
function animateCount(elementId, target) {
  const el = document.getElementById(elementId);
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 30);
}

function copyText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "Copied!";
    setTimeout(() => { btn.textContent = "Copy"; }, 2000);
  });
}

function downloadReport() {
  if (!lastResult) return;
  const d = lastResult;
  let report = `SnapResume — ATS Analysis Report\n`;
  report += `================================\n\n`;
  report += `ATS MATCH SCORE: ${d.score}/100\n`;
  report += `${d.score_reason}\n\n`;
  report += `PRESENT KEYWORDS:\n${(d.present_keywords || []).join(", ")}\n\n`;
  report += `MISSING KEYWORDS:\n${(d.missing_keywords || []).join(", ")}\n\n`;
  report += `REWRITTEN BULLET POINTS:\n`;
  (d.weak_bullets || []).forEach((b, i) => {
    report += `\n${i+1}. BEFORE: ${b.original}\n   AFTER:  ${b.improved}\n`;
  });
  report += `\nATS TIPS:\n`;
  (d.ats_tips || []).forEach((t, i) => { report += `${i+1}. ${t}\n`; });

  const blob = new Blob([report], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "snapresume_report.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function showError(msg) {
  const el = document.getElementById("errorMsg");
  el.textContent = msg;
  el.classList.remove("hidden");
}
function hideError() {
  document.getElementById("errorMsg").classList.add("hidden");
}
function escapeHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function escapeForAttr(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, "&quot;");
}