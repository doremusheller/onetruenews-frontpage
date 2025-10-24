/* =========================================================
   ticker.js — One True Infotainment v8.0
   Scrolls global propaganda headlines from "When It Happened Here"
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const ticker = document.querySelector(".ticker");
  if (!ticker) return;

  // Headlines: short, sardonic global updates from WIHH
  const headlines = [
    "Poland reopens gratitude camps for tourists",
    "Russia reports successful containment of freedom fire",
    "China unveils mood-based passport system",
    "Taiwan launches first reusable surrender declaration",
    "France renames wine ‘liquid compliance’",
    "Canada extends politeness embargo on dissenters",
    "Germany declares efficiency a protected emotion",
    "Australia relocates coastline for better optics",
    "India announces nationwide nap for digital detox",
    "United Kingdom adopts cloudier forecast of unity"
  ];

  // Shuffle for variation between reloads
  const shuffled = headlines
    .map(h => ({ value: h, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(h => h.value);

  // Create continuous ticker text
  ticker.textContent = shuffled.join("  •  ") + "  •  ";

  // Duplicate content for seamless looping
  const clone = ticker.cloneNode(true);
  ticker.parentNode.appendChild(clone);
});
