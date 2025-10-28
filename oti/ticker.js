/* ============================================================
   ticker.js — One True Infotainment
   Injects canonical headlines into #ticker (single source of truth)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("ticker");
  if (!el) return;

  const headlines = [
    "Patriot Games relocates; wild monkey still at large",
    "Ministry clarifies travel restrictions for Holiday Freedom season",
    "Veteran Visibility Week expands to Reality Show!",
    "How much do YOU support our troops? Take the quiz!",
    "First Citizen to provide first-in-class 'Color Coded Census'",
    "First Citizen addresses wellness rumors with full jerky disclosure",
    "Nightworks scheduled along riverfront after suspect sighting"
  ];

  // wider spacing between items (NBSPs around the bullet)
  const sep = "\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0";
  const text = (headlines.join(sep) + sep + headlines.join(sep));

  const p = document.createElement("p");
  p.textContent = text;
  el.appendChild(p);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    p.style.animation = "none";
    p.style.paddingLeft = "0";
  }
});
