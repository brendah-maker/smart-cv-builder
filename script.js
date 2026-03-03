document.addEventListener("DOMContentLoaded", function () {

  const generateBtn = document.getElementById("generateBtn");
  const preview = document.getElementById("cvPreview");

  generateBtn.addEventListener("click", generateCV);

  function generateCV() {

    const name = document.getElementById("fullName").value;
    const objective = document.getElementById("objective").value;
    const skills = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;
    const education = document.getElementById("education").value;
    const achievements = document.getElementById("achievements").value;

    const formattedExperience = formatBullets(experience);
    const formattedAchievements = formatBullets(achievements);
    const formattedSkills = formatSkills(skills);

    preview.innerHTML = `
      <div class="space-y-6 text-gray-800">

        <div>
          <h1 class="text-3xl font-bold text-blue-700">${name || "Your Name"}</h1>
          <hr class="mt-2">
        </div>

        <div>
          <h2 class="font-bold text-lg text-blue-600">Career Objective</h2>
          <p>${rewriteObjective(objective)}</p>
        </div>

        <div>
          <h2 class="font-bold text-lg text-blue-600">Skills</h2>
          <ul class="list-disc ml-6">${formattedSkills}</ul>
        </div>

        <div>
          <h2 class="font-bold text-lg text-blue-600">Experience</h2>
          <ul class="list-disc ml-6">${formattedExperience}</ul>
        </div>

        <div>
          <h2 class="font-bold text-lg text-blue-600">Education</h2>
          <p>${education}</p>
        </div>

        <div>
          <h2 class="font-bold text-lg text-blue-600">Achievements</h2>
          <ul class="list-disc ml-6">${formattedAchievements}</ul>
        </div>

      </div>
    `;
  }

  // ===============================
  // Format Skills
  // ===============================
  function formatSkills(skillsText) {
    if (!skillsText) return "<li>List your skills here</li>";

    return skillsText.split(",")
      .map(skill => `<li>${capitalize(skill.trim())}</li>`)
      .join("");
  }

  // ===============================
  // Format Bullets + Auto Action Verbs
  // ===============================
  function formatBullets(text) {
    if (!text) return "<li>Add details here</li>";

    const lines = text.split("\n");

    return lines.map(line => {
      let cleanLine = line.trim();
      if (!cleanLine) return "";

      cleanLine = improveSentence(cleanLine);

      return `<li>${cleanLine}</li>`;
    }).join("");
  }

  // ===============================
  // Achievement Rewriter
  // ===============================
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
      "Improved"
    ];

    weakPhrases.forEach(phrase => {
      if (sentence.toLowerCase().includes(phrase)) {
        const randomVerb = strongVerbs[Math.floor(Math.random() * strongVerbs.length)];
        sentence = sentence.replace(new RegExp(phrase, "i"), randomVerb);
      }
    });

    return capitalize(sentence);
  }

  // ===============================
  // Rewrite Objective (Simple Enhancement)
  // ===============================
  function rewriteObjective(text) {
    if (!text) return "Motivated professional seeking opportunity to contribute skills and grow within a dynamic organization.";

    return "Results-driven professional with expertise in " +
           text +
           ". Committed to delivering measurable impact and continuous improvement.";
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

});
