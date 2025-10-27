/* ticker.js — injects canonical headlines into #ticker (single source of truth) */
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("ticker");
  if (!el) return;

  // Canon headlines (edit order/content here only)
  const headlines = [
    "Patriot Games relocates; traffic advisories in effect",
    "Ministry clarifies travel window for winter departures",
    "Veteran Visibility Week expands to River District",
    "Patriotic Census Phase II—verification reminders",
    "First Citizen addresses wellness regimen rumors",
    "Nightworks scheduled along riverfront lighting grid"
  ];

  const sep = "  •  ";
  // Duplicate content to ensure long scroll track
  const text = (headlines.join(sep) + sep + headlines.join(sep));

  const p = document.createElement("p");
  p.textContent = text;
  el.appendChild(p);

  // Respect reduced motion: if user prefers, show static rolling text
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) {
    p.style.animation = "none";
    p.style.paddingLeft = "0";
  }
});
