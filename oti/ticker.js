/* ============================================================
   ticker.js — One True Infotainment
   Injects canonical headlines into #ticker (single source of truth)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("ticker");
  if (!el) return;

  const headlines = [
    "Faithlynn rises from grief to guide the faithful — and the merch line.",
    "Patriotic hunger declared voluntary in new Grundy nutrition program.",
    "Ministry confirms the book ban was for everyone’s emotional safety.",
    "Christian death metal clears the Capitol; decibels under investigation.",
    "Angels praised for thwarting terror family’s suspicious attempt to live.",
    "Golden graffiti keeps spreading; officials blame conceptual contagion.",
    "Public Smiling Hours extended — morale to remain visibly excellent.",
    "Unauthorized empathy detected in lower districts — swiftly contained.",
    "Irregular primate threat ongoing; Ministry urges citizens to stay uncurious.",
    "Homeless Correction Act hailed as ‘a roof you can fight for.’",
    "First Citizen declares the wall complete and the journey ongoing.",
    "Color-Coded Census hailed as ‘clarity through chromatics.’",
    "River glow officially patriotic; officials advise against swimming.",
    "Faithlynn launches Rexurrection Coffee — brewed in remembrance.",
    "Ministry reminds citizens: irony is not a moral exemption."
  ];

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
