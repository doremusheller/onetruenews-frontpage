/* ticker.js — injects canonical headlines into #ticker (single source of truth) */
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("ticker");
  if (!el) return;

  const headlines = [
    "Patriot Games relocates; wild monkey still at large",
    "Ministry clarifies travel restrictions for Holiday Freedom season",
    "Veteran Visibility Week expands to Reaility Show!",
    "Patriotic Census Phase II—verification reminders",
    "First Citizen addresses wellness regimen rumors with full jerk disclosure",
    "Nightworks scheduled along riverfront lighting grid after suspect sighting"
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
