/* ============================================================
   ticker2.js — One True Infotainment v2
   Minimal self-contained ticker logic.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const host = document.getElementById("alert-strip");
  if (!host) return;

  // Canonical ticker lines (from original site copy)
  const messages = [
    "Official guidance: Remain Correct.",
    "Tonight: Hammer of Grundy — measured thunder approved.",
    "Public Smiling Hours extended while spirits are high.",
    "TAFAJ rebuttal scheduled following devotional programming.",
    "Census participation exceeds expectations — be sure you’ve been counted.",
    "Friendship Correction Initiative enters second phase of outreach.",
    "Officials clarify that irony remains restricted to designated zones.",
  ];

  // Build continuous scroll content
  const tickerLine = messages.join("  •  ");
  const p = document.createElement("p");
  p.textContent = tickerLine + "  •  " + tickerLine; // doubled for seamless loop
  host.appendChild(p);
});
