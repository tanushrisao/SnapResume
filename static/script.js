async function analyzeResume() {

    const resume = document.getElementById("resume").value;
    const job = document.getElementById("job").value;

    const response = await fetch("/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            resume: resume,
            job_description: job
        })
    });

    const data = await response.json();

    document.getElementById("result").innerHTML = `
        <p>Score: ${data.score}</p>
        <p>Missing Keywords: ${data.missing_keywords.join(", ")}</p>
    `;
}