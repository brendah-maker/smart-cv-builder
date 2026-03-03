document.addEventListener("DOMContentLoaded", () => {

  const generateBtn = document.getElementById("generateBtn");
  const generateWithAI = document.getElementById("generateWithAI");
  const insertObjectiveSample = document.getElementById("insertObjectiveSample");
  const preview = document.getElementById("cvPreview");
  const atsReport = document.getElementById("atsReport");

  generateBtn.addEventListener("click", onGenerate);
  generateWithAI.addEventListener("click", onPolishObjective);
  insertObjectiveSample.addEventListener("click", onInsertObjectiveSample);

  // Role-based verbs
  const roleVerbs = {
    "Customer Success": ["Led", "Enhanced", "Optimized", "Improved", "Drove", "Facilitated"],
    "Software Engineer": ["Developed", "Implemented", "Optimized", "Built", "Designed", "Engineered"],
    "Project Manager": ["Managed", "Coordinated", "Directed", "Delivered", "Executed", "Oversaw"],
    "Marketing": ["Launched", "Promoted", "Executed", "Strategized", "Enhanced", "Optimized"],
    "Finance": ["Analyzed", "Optimized", "Audited", "Forecasted", "Managed", "Reported"]
  };

  // Get form values
  function getForm() {
    return {
      template: document.getElementById("templateSelect").value,
      name: document.getElementById("fullName").value.trim(),
      title: document.getElementById("jobTitle").value.trim(),
      objective: document.getElementById("objective").value.trim(),
      skills: document.getElementById("skills").value.trim(),
      experience: document.getElementById("experience").value.trim(),
      achievements: document.getElementById("achievements").value.trim(),
      education: document.getElementById("education").value.trim(),
      jobDesc: document.getElementById("jobDescription") ? document.getElementById("jobDescription").value.trim() : ""
    };
  }

  function onGenerate() {
    const f = getForm();

    const skillsHTML = formatSkills(f.skills);
    const experienceHTML = formatParagraphs(f.experience, f.title);
    const achievementsHTML = formatParagraphs(f.achievements, f.title);
    const objective = f.objective || polishObjective(f.title, f.skills);

    // Highlight ATS keywords if job description is provided
    let experienceWithATS = experienceHTML;
    if (f.jobDesc) {
      const jdKeywords = extractKeywords(f.jobDesc);
      experienceWithATS = highlightKeywords(experienceHTML, jdKeywords);
      atsReport.innerHTML = `ATS Keywords Highlighted. Matched: <span class="keyword-hit">${jdKeywords.join(", ")}</span>`;
    } else {
      atsReport.innerHTML = "";
    }

    // Choose template
    let html = "";
    if (f.template === "classic") html = classicTemplate(f.name, objective, skillsHTML, experienceWithATS, f.education, achievementsHTML);
    if (f.template === "modern") html = modernTemplate(f.name, objective, skillsHTML, experienceWithATS, f.education, achievementsHTML);
    if (f.template === "executive") html = executiveTemplate(f.name, objective, skillsHTML, experienceWithATS, f.education, achievementsHTML);

    preview.innerHTML = html;
  }

  function onPolishObjective() {
    const f = getForm();
    const polished = polishObjective(f.title, f.skills);
    document.getElementById("objective").value = polished;
    onGenerate();
  }

  function onInsertObjectiveSample() {
    document.getElementById("objective").value = "Motivated professional seeking to contribute strong skills and deliver measurable impact.";
  }

  // =========================
  // Formatting Helpers
  // =========================

  function formatSkills(text) {
    if(!text) return "<li>Add skills here</li>";
    return text.split(",").map(s=>`<li>${capitalize(s.trim())}</li>`).join("");
  }

  // Paragraph-level rephrasing
  function formatParagraphs(text, title="") {
    if(!text) return "<li>Add details here</li>";
    const roleKey = Object.keys(roleVerbs).find(r=> title.toLowerCase().includes(r.toLowerCase())) || "";
    const verbs = roleVerbs[roleKey] || ["Led","Managed","Executed"];
    const paragraphs = text.split("\n").filter(p=>p.trim()!=="");
    return paragraphs.map(p=>{
      const cleaned = p.trim();
      return `<li>${rephraseParagraph(cleaned, verbs)}</li>`;
    }).join("");
  }

  // Rephrase using strong verbs
  function rephraseParagraph(text, verbs) {
    // Replace weak verbs with strong ones
    const weakToStrong = {
      "responsible for": verbs,
      "worked on": verbs,
      "helped with": verbs,
      "did": verbs,
      "was in charge of": verbs
    };
    for(const [weak, strongList] of Object.entries(weakToStrong)){
      const regex = new RegExp(weak,"i");
      if(regex.test(text)){
        const v = strongList[Math.floor(Math.random()*strongList.length)];
        text = text.replace(regex, v);
        break;
      }
    }
    // Capitalize first letter & ensure punctuation
    text = text.charAt(0).toUpperCase() + text.slice(1);
    if(!/[.!?]$/.test(text)) text += ".";
    return text;
  }

  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  function polishObjective(title, skills){
    const t = title || "professional";
    const s = skills ? skills.split(",").slice(0,3).join(", ") : "customer service";
    return `Results-driven ${t} with skills in ${s}. Focused on achieving measurable outcomes and excellence in performance.`;
  }

  // =========================
  // ATS Keyword Highlighting
  // =========================
  function extractKeywords(jd){
    return jd.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  }

  function highlightKeywords(textHTML, keywords){
    keywords = [...new Set(keywords)]; // unique
    keywords.forEach(k=>{
      const regex = new RegExp(`\\b(${k})\\b`, "gi");
      textHTML = textHTML.replace(regex, `<span class="keyword-hit">$1</span>`);
    });
    return textHTML;
  }

  // =========================
  // Templates
  // =========================
  function classicTemplate(name,obj,skills,exp,edu,ach){
    return `
      <div class="space-y-6 text-gray-800">
        <h1 class="text-3xl font-bold text-blue-700">${name||"Your Name"}</h1>
        <hr>
        <section><h2 class="font-bold text-blue-600">Career Objective</h2><p>${obj}</p></section>
        <section><h2 class="font-bold text-blue-600">Skills</h2><ul class="list-disc ml-6">${skills}</ul></section>
        <section><h2 class="font-bold text-blue-600">Experience</h2><ul class="list-disc ml-6">${exp}</ul></section>
        <section><h2 class="font-bold text-blue-600">Education</h2><p>${edu}</p></section>
        <section><h2 class="font-bold text-blue-600">Achievements</h2><ul class="list-disc ml-6">${ach}</ul></section>
      </div>
    `;
  }

  function modernTemplate(name,obj,skills,exp,edu,ach){
    return `
      <div class="space-y-6 text-gray-800">
        <h1 class="text-4xl font-extrabold">${name||"Your Name"}</h1>
        <p class="italic text-gray-600">${obj}</p>
        <div><h2 class="font-semibold uppercase text-sm text-gray-500">Skills</h2><ul class="list-disc ml-6">${skills}</ul></div>
        <div><h2 class="font-semibold uppercase text-sm text-gray-500">Experience</h2><ul class="list-disc ml-6">${exp}</ul></div>
        <div><h2 class="font-semibold uppercase text-sm text-gray-500">Education</h2><p>${edu}</p></div>
        <div><h2 class="font-semibold uppercase text-sm text-gray-500">Achievements</h2><ul class="list-disc ml-6">${ach}</ul></div>
      </div>
    `;
  }

  function executiveTemplate(name,obj,skills,exp,edu,ach){
    return `
      <div class="grid grid-cols-3 gap-6 text-gray-800">
        <div class="col-span-1 bg-gray-100 p-4 rounded-lg space-y-4">
          <h1 class="text-2xl font-bold">${name||"Your Name"}</h1>
          <div><h3 class="font-bold text-blue-600">Skills</h3><ul class="list-disc ml-6">${skills}</ul></div>
          <div><h3 class="font-bold text-blue-600">Education</h3><p>${edu}</p></div>
        </div>
        <div class="col-span-2 space-y-4">
          <section><h3 class="font-bold text-blue-600">Professional Summary</h3><p>${obj}</p></section>
          <section><h3 class="font-bold text-blue-600">Experience</h3><ul class="list-disc ml-6">${exp}</ul></section>
          <section><h3 class="font-bold text-blue-600">Achievements</h3><ul class="list-disc ml-6">${ach}</ul></section>
        </div>
      </div>
    `;
  }

});
