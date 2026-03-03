document.addEventListener("DOMContentLoaded", function () {

  const generateBtn = document.getElementById("generateBtn");
  const preview = document.getElementById("cvPreview");

  generateBtn.addEventListener("click", generateCV);

  function generateCV() {

    const template = document.getElementById("templateSelect").value;
    const name = document.getElementById("fullName").value;
    const objective = document.getElementById("objective").value;
    const skills = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;
    const education = document.getElementById("education").value;
    const achievements = document.getElementById("achievements").value;

    const formattedSkills = formatSkills(skills);
    const formattedExperience = formatBullets(experience);
    const formattedAchievements = formatBullets(achievements);
    const improvedObjective = rewriteObjective(objective);

    if (template === "classic") {
      preview.innerHTML = classicTemplate(name, improvedObjective, formattedSkills, formattedExperience, education, formattedAchievements);
    }

    if (template === "modern") {
      preview.innerHTML = modernTemplate(name, improvedObjective, formattedSkills, formattedExperience, education, formattedAchievements);
    }

    if (template === "executive") {
      preview.innerHTML = executiveTemplate(name, improvedObjective, formattedSkills, formattedExperience, education, formattedAchievements);
    }
  }

  // ===============================
  // TEMPLATES
  // ===============================

  function classicTemplate(name, objective, skills, experience, education, achievements) {
    return `
      <div class="space-y-6 text-gray-800">
        <h1 class="text-3xl font-bold text-blue-700">${name || "Your Name"}</h1>
        <hr>

        <section>
          <h2 class="font-bold text-blue-600">Career Objective</h2>
          <p>${objective}</p>
        </section>

        <section>
          <h2 class="font-bold text-blue-600">Skills</h2>
          <ul class="list-disc ml-6">${skills}</ul>
        </section>

        <section>
          <h2 class="font-bold text-blue-600">Experience</h2>
          <ul class="list-disc ml-6">${experience}</ul>
        </section>

        <section>
          <h2 class="font-bold text-blue-600">Education</h2>
          <p>${education}</p>
        </section>

        <section>
          <h2 class="font-bold text-blue-600">Achievements</h2>
          <ul class="list-disc ml-6">${achievements}</ul>
        </section>
      </div>
    `;
  }

  function modernTemplate(name, objective, skills, experience, education, achievements) {
    return `
      <div class="space-y-6 text-gray-800">
        <h1 class="text-4xl font-extrabold">${name || "Your Name"}</h1>

        <p class="italic text-gray-600">${objective}</p>

        <div>
          <h2 class="font-semibold uppercase text-sm tracking-wider text-gray-500">Skills</h2>
          <ul class="list-disc ml-6">${skills}</ul>
        </div>

        <div>
          <h2 class="font-semibold uppercase text-sm tracking-wider text-gray-500">Experience</h2>
          <ul class="list-disc ml-6">${experience}</ul>
        </div>

        <div>
          <h2 class="font-semibold uppercase text-sm tracking-wider text-gray-500">Education</h2>
          <p>${education}</p>
        </div>

        <div>
          <h2 class="font-semibold uppercase text-sm tracking-wider text-gray-500">Achievements</h2>
          <ul class="list-disc ml-6">${achievements}</ul>
        </div>
      </div>
    `;
  }

  function executiveTemplate(name, objective, skills, experience, education, achievements) {
    return `
      <div class="grid grid-cols-3 gap-6 text-gray-800">
        <div class="col-span-1 bg-gray-100 p-4 rounded-lg space-y-6">
          <h1 class="text-2xl font-bold">${name || "Your Name"}</h1>

          <div>
            <h2 class="font-bold text-blue-600">Skills</h2>
            <ul class="list-disc ml-6">${skills}</ul>
          </div>

          <div>
            <h2 class="font-bold text-blue-600">Education</h2>
            <p>${education}</p>
          </div>
        </div>

        <div class="col-span-2 space-y-6">
          <section>
            <h2 class="font-bold text-blue-600">Professional Summary</h2>
            <p>${objective}</p>
          </section>

          <section>
            <h2 class="font-bold text-blue-600">Experience</h2>
            <ul class="list-disc ml-6">${experience}</ul>
          </section>

          <section>
            <h2 class="font-bold text-blue-600">Achievements</h2>
            <ul class="list-disc ml-6">${achievements}</ul>
          </section>
        </div>
      </div>
    `;
  }

  // ===============================
  // FORMATTING FUNCTIONS
  // ===============================

  function formatSkills(text) {
    if (!text) return "<li>Add skills here</li>";

    return text.split(",")
      .map(skill => `<li>${capitalize(skill.trim())}</li>`)
      .join("");
  }

  function formatBullets(text) {
    if (!text) return "<li>Add details here</li>";

    return text.split("\n")
      .filter(line => line.trim() !== "")
      .map(line => `<li>${improveSentence(line.trim())}</li>`)
      .join("");
  }

  function improveSentence(sentence) {

    const weakPhrases = [
      "responsible for",
      "worked on",
      "helped with",
      "did",
      "was in charge of"
    ];

    const strongVerbs = [
      "Led",
      "Implemented",
      "Developed",
      "Optimized",
      "Managed",
      "Coordinated",
      "Improved",
      "Executed"
    ];

    weakPhrases.forEach(phrase => {
      if (sentence.toLowerCase().includes(phrase)) {
        const randomVerb = strongVerbs[Math.floor(Math.random() * strongVerbs.length)];
        sentence = sentence.replace(new RegExp(phrase, "i"), randomVerb);
      }
    });

    return capitalize(sentence);
  }

  function rewriteObjective(text) {
    if (!text) {
      return "Results-driven professional committed to delivering measurable impact and continuous improvement.";
    }

    return "Results-driven professional with experience in " +
           text +
           ". Focused on driving performance, improving processes, and delivering exceptional value.";
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

});
