// ONE TRU INFOTAINMENT — ticker.js v7.3
// Sardonic, imperative headlines scroll continuously across the banner

document.addEventListener("DOMContentLoaded", () => {
  const headlines = [
    "Eat faster, supplies delayed again",
    "Smile for cameras, ration joy",
    "TAFAJ raises threat to festive",
    "Water futures beat the market",
    "Citizens urged to rehearse gratitude",
    "Local man thanks algorithm twice",
    "New patriot app replaces memory",
    "Neighbors compete in loyalty bakeoff",
    "Curfew lifted, morale remains steady",
    "Experts confirm confusion at record highs",
    "Children pledge daily to Correctness",
    "Fireworks celebrate minor compliance surge",
    "Ministry denies rumors of laughter ban",
    "Grundy promises more air on Fridays",
    "Patriot Beer lowers proof for unity",
    "Public asked to imagine calm skies",
    "Survey finds doubt at unsafe levels",
    "Officials applaud citizens for staying home",
    "Broadcast repeats, applause still mandatory",
    "Study links irony to lowered morale"
  ];

  const list = document.getElementById("ticker-track");
  if (!list) return;

  // Shuffle and pick 10 per load
  const shuffled = [...headlines].sort(() => Math.random() - 0.5).slice(0, 10);
  shuffled.forEach(line => {
    const li = document.createElement("li");
    li.textContent = line;
    list.appendChild(li);
  });
});
