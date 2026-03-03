document.addEventListener("DOMContentLoaded", () => {

  // --- elements ---
  const generateBtn = document.getElementById("generateBtn");
  const generateWithAI = document.getElementById("generateWithAI");
  const insertObjectiveSample = document.getElementById("insertObjectiveSample");
  const suggestBulletsBtn = document.getElementById("suggestBulletsBtn");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const preview = document.getElementById("cvPreview");
  const atsReport = document.getElementById("atsReport");

  // --- events ---
  generateBtn.addEventListener("click", onGenerate);
  generateWithAI.addEventListener("click", onGenerateAI);
  insertObjectiveSample.addEventListener("click", onInsertObjectiveSample);
  suggestBulletsBtn.addEventListener("click", onSuggestBullets);
  analyzeBtn.addEventListener("click", onAnalyzeJD);

  // --- helpers: form getters ---
  function getForm() {
    return {
      template: document.getElementById("templateSelect").value,
      name: document.getElementById("fullName").value.trim(),
      title: document.getElementById("jobTitle").value.trim(),
      jobDesc: document.getElementById("jobDescription").value.trim().toLowerCase(),
      objective: document.getElementById("objective").value.trim(),
      skills: document.getElementById("skills").value.trim(),
      experience: document.getElementById("experience").value.trim(),
      achievements: document.getElementById("achievements").value.trim(),
      education: document.getElementById("education").value.trim()
    };
  }

  // --- generate CV (main) ---
  function onGenerate() {
    const f = getForm();
    const skillsHTML = formatSkills(f.skills);
    const expHTML = formatBullets(f.experience);
    const achHTML = formatBullets(f.achievements);
    const obj = rewriteObjectiveSimple(f.objective, f.title, f.skills);

    // do ATS check (if jobDesc provided)
    if (f.jobDesc) {
      const report = analyzeKeywords(f.jobDesc, f.skills);
      renderATSReport(report);
    } else {
      atsReport.innerHTML = "";
    }

    // choose template
    if (f.template === "classic") preview.innerHTML = classicTemplate(f.name, obj, skillsHTML, expHTML, f.education, achHTML);
    if (f.template === "modern")  preview.innerHTML = modernTemplate(f.name, obj, skillsHTML, expHTML, f.education, achHTML);
    if (f.template === "executive") preview.innerHTML = executiveTemplate(f.name, obj, skillsHTML, expHTML, f.education, achHTML);
  }

  // --- simple rule-based "AI" generator (cheap MVP) ---
  function onGenerateAI() {
    const f = getForm();
    // For MVP we use a small rule-based generator to create a stronger objective and 3 sample bullets:
    const generatedObjective = `Results-focused ${f.title || "professional"} with experience in ${f.skills || "customer service and operations"}. Proven ability to improve processes, increase customer satisfaction, and drive retention.`;
    document.getElementById("objective").value = generatedObjective;

    // Suggest 3 achievement bullets based on title and skills
    const sampleBullets = generateSampleBullets(f.title, f.skills).join("\n");
    // If experience is empty, insert sample bullets into experience; otherwise append.
    const expField = document.getElementById("experience");
    expField.value = expField.value.trim() ? expField.value.trim() + "\n" + sampleBullets : sampleBullets;

    // auto-generate preview
    onGenerate();
  }

  // --- insert a quick objective sample ---
  function onInsertObjectiveSample() {
    document.getElementById("objective").value = "Motivated customer-focused professional seeking to contribute strong communication and retention skills to a growing team.";
  }

  // --- suggest bullets for experience/achievements ---
  function onSuggestBullets() {
    const f = getForm();
    const bullets = generateSampleBullets(f.title, f.skills);
    const exp = document.getElementById("experience");
    exp.value = bullets.join("\n") + (exp.value ? "\n" + exp.value : "");
    onGenerate();
  }

  // --- JD analysis (ATS keywords) ---
  function onAnalyzeJD() {
    const f = getForm();
    if (!f.jobDesc) {
      atsReport.innerHTML = "<div class='text-sm text-gray-500'>Paste a job description above to extract keywords for ATS.</div>";
      return;
    }
    const keywordsToCheck = extractKeywordsFromJD(f.jobDesc);
    const report = analyzeKeywords(f.jobDesc, f.skills);
    renderATSReport(report, keywordsToCheck);
  }

  // =========================
  // Small utility functions
  // =========================

  function formatSkills(text) {
    if (!text) return "<li>Add skills here</li>";
    return text.split(",").map(s => `<li>${capitalize(s.trim())}</li>`).join("");
  }

  function formatBullets(text) {
    if (!text) return "<li>-</li>";
    return text.split("\n").filter(l => l.trim()).map(l => `<li>${improveSentence(l.trim())}</li>`).join("");
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // weak-to-strong rewrite for one sentence (same as earlier but usable)
  function improveSentence(sentence) {
    const weak = ["responsible for","worked on","helped with","did","was in charge of"];
    const strong = ["Led","Implemented","Developed","Optimized","Managed","Coordinated","Improved","Executed"];
    weak.forEach(p => {
      if (sentence.toLowerCase().includes(p)) {
        const rv = strong[Math.floor(Math.random()*strong.length)];
        sentence = sentence.replace(new RegExp(p,"i"), rv);
      }
    });
    // ensure sentence ends properly
    if (!/[.!?]$/.test(sentence)) sentence = sentence + ".";
    return capitalize(sentence);
  }

  // very small objective enhancer if empty
  function rewriteObjectiveSimple(text, title, skills) {
    if (text && text.trim().length>0) return text;
    const t = title || "professional";
    const s = skills ? skills.split(",").slice(0,3).join(", ") : "customer service";
    return `Results-driven ${t} with skills in ${s}. Focused on improving outcomes, customer satisfaction, and driving measurable results.`;
  }

  // --- generate small role-based bullets (rule-based MVP) ---
  function generateSampleBullets(title, skills) {
    const t = (title || "").toLowerCase();
    const sk = skills ? skills.toLowerCase() : "";

    const generic = [
      "Led onboarding sessions that improved product adoption and reduced early churn.",
      "Improved customer satisfaction by proactively resolving issues and following up on outcomes.",
      "Collaborated with product and ops teams to implement process improvements."
    ];

    if (t.includes("customer") || t.includes("success") || t.includes("experience")) {
      return [
        "Educated customers on product features and options, enabling informed decisions and stronger customer trust.",
        "Proactively followed up across the sales pipeline to reduce drop-offs and improve closure rates.",
        "Upsold relevant products to increase average deal value while ensuring good fit for customer budgets."
      ];
    }

    if (t.includes("data") || t.includes("analyst")) {
      return [
        "Analyzed datasets to find usage trends and opportunities for product improvement.",
        "Built dashboards to enable data-driven decisions and track KPIs.",
        "Automated routine reports to save time and increase accuracy."
      ];
    }

    if (t.includes("frontend") || t.includes("developer")) {
      return [
        "Optimized front-end performance by reducing bundle size and lazy-loading assets.",
        "Implemented responsive UI improvements and accessibility fixes.",
        "Collaborated with designers to ship polished user-facing features."
      ];
    }

    // fallback: mix generic + keyword-driven sample if skills include keywords
    const picks = generic.slice(0,3);
    if (sk.includes("lead") || sk.includes("manage")) picks[0] = "Managed cross-functional workstreams to deliver projects on time.";
    return picks;
  }

  // --- extract keywords from job description (very small heuristic) ---
  function extractKeywordsFromJD(text) {
    // look for common skill words and return unique matches
    const skillBank = ["python","sql","excel","javascript","react","node","communication","customer","sales","crm","onboarding","leadership","management","analysis"];
    const found = [];
    skillBank.forEach(k => { if (text.includes(k)) found.push(k); });
    return found;
  }

  // --- compare JD keywords vs candidate skills and produce report ---
  function analyzeKeywords(jdText, candidateSkills) {
    const jdKeywords = extractKeywordsFromJD(jdText.toLowerCase());
    const candidate = (candidateSkills || "").toLowerCase();
    const hits = jdKeywords.filter(k => candidate.includes(k));
    const misses = jdKeywords.filter(k => !candidate.includes(k));
    return { jdKeywords, hits, misses };
  }

  function renderATSReport(report) {
    if (!report) { atsReport.innerHTML = ""; return; }
    const { jdKeywords, hits, misses } = report;
    if (!jdKeywords || jdKeywords.length === 0) {
      atsReport.innerHTML = `<div class="text-sm text-gray-600">No common keywords detected from the pasted JD (try another JD or add skills).</div>`;
      return;
    }
    atsReport.innerHTML = `
      <div class="text-sm">
        <div><strong>Detected keywords in JD:</strong> ${jdKeywords.map(k => `<span class="mr-2 ${hits.includes(k)?'keyword-hit':'keyword-miss'}">${k}</span>`).join(" ")}</div>
        <div class="mt-1"><strong>Matches:</strong> ${hits.length} / ${jdKeywords.length}</div>
        <div class="mt-1 text-xs text-gray-500">Tip: add missing keywords to your Skills or Experience to improve ATS match.</div>
      </div>
    `;
  }

  // =========================
  // Templates (HTML fragments)
  // =========================

  function classicTemplate(name, objective, skills, experience, education, achievements) {
    return `
      <div class="space-y-6 text-gray-800">
        <h1 class="text-3xl font-bold text-blue-700">${name || "Your Name"}</h1>
        <hr>
        <section><h2 class="font-bold text-blue-600">Career Objective</h2><p>${objective}</p></section>
        <section><h2 class="font-bold text-blue-600">Skills</h2><ul class="list-disc ml-6">${skills}</ul></section>
        <section><h2 class="font-bold text-blue-600">Experience</h2><ul class="list-disc ml-6">${experience}</ul></section>
        <section><h2 class="font-bold text-blue-600">Education</h2><p>${education}</p></section>
        <section><h2 class="font-bold text-blue-600">Achievements</h2><ul class="list-disc ml-6">${achievements}</ul></section>
      </div>
    `;
  }

  function modernTemplate(name, objective, skills, experience, education, achievements) {
    return `
      <div class="space-y-6 text-gray-800">
        <h1 class="text-4xl font-extrabold">${name || "Your Name"}</h1>
        <p class="italic text-gray-600">${objective}</p>
        <div><h2 class="font-semibold uppercase text-sm text-gray-500">Skills</h2><ul class="list-disc ml-6">${skills}</ul></div>
        <div><h2 class="font-semibold uppercase text-sm text-gray-500">Experience</h2><ul class="list-disc ml-6">${experience}</ul></div>
        <div><h2 class="font-semibold uppercase text-sm text-gray-500">Education</h2><p>${education}</p></div>
        <div><h2 class="font-semibold uppercase text-sm text-gray-500">Achievements</h2><ul class="list-disc ml-6">${achievements}</ul></div>
      </div>
    `;
  }

  function executiveTemplate(name, objective, skills, experience, education, achievements) {
    return `
      <div class="grid grid-cols-3 gap-6 text-gray-800">
        <div class="col-span-1 bg-gray-100 p-4 rounded-lg space-y-4">
          <h1 class="text-2xl font-bold">${name || "Your Name"}</h1>
          <div><h3 class="font-bold text-blue-600">Skills</h3><ul class="list-disc ml-6">${skills}</ul></div>
          <div><h3 class="font-bold text-blue-600">Education</h3><p>${education}</p></div>
        </div>
        <div class="col-span-2 space-y-4">
          <section><h3 class="font-bold text-blue-600">Professional Summary</h3><p>${objective}</p></section>
          <section><h3 class="font-bold text-blue-600">Experience</h3><ul class="list-disc ml-6">${experience}</ul></section>
          <section><h3 class="font-bold text-blue-600">Achievements</h3><ul class="list-disc ml-6">${achievements}</ul></section>
        </div>
      </div>
    `;
  }

  // =========================
  // Future: Hook to real server / AI
  // =========================
  /* Example: If you later add a server endpoint /api/generate that uses OpenAI,
     replace onGenerateAI's rule-based logic with a fetch to your server:

  fetch('/api/generate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title: f.title, skills: f.skills, experience: f.experience})
  }).then(r=>r.json()).then(data=>{
    // data.objective, data.bullets ...
  });

  Note: calling OpenAI from client-side exposes keys. Always call from a server.
  */

});
