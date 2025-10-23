// ticker.js — continuous scrolling ticker (v6.9, root placement)

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("ticker-track");
  if (!track) return;

  // Sardonic, imperative headlines (rotated randomly)
  const headlines = [
    "Remain calm, purchase.",
    "Today’s confusion is patriotic.",
    "Report happiness discrepancies immediately.",
    "Remember: speculation is theft.",
    "Facts are under review.",
    "Truth maintenance scheduled for later.",
    "Be louder, be right.",
    "Smile for surveillance.",
    "Questioning means you’re winning.",
    "Data loves you back.",
    "Comply cheerfully.",
    "Ignore unauthorized irony.",
    "Panic only when instructed."
  ];

  // Pick 10 random headlines each load
  const shuffled = headlines.sort(() => Math.random() - 0.5).slice(0, 10);

  track.innerHTML = shuffled.map(h => `<li>${h}</li>`).join("");
});
