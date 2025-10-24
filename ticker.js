// ONE TRU INFOTAINMENT — ticker.js v7.4
// Sardonic, imperative headlines scroll continuously across the banner
// Adds a 3-second pause between loops

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

  const track = document.getElementById("ticker-track");
  if (!track) return;

  // Populate with 10 random headlines
  const shuffled = [...headlines].sort(() => Math.random() - 0.5).slice(0, 10);
  shuffled.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    track.appendChild(li);
  });

  // Animate scroll with 3-second loop delay
  const speed = 30_000; // 30s scroll time
  const pause = 3_000;  // 3s delay between loops
  let offset = 0;

  function loop() {
    offset -= 1;
    track.style.transform = `translateX(${offset}px)`;

    const width = track.scrollWidth;
    if (Math.abs(offset) >= width / 2) {
      // pause before resetting
      setTimeout(() => {
        offset = 0;
        track.style.transform = "translateX(0)";
        requestAnimationFrame(loop);
      }, pause);
    } else {
      requestAnimationFrame(loop);
    }
  }

  loop();
});
