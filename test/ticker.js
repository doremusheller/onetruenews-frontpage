// ticker.js — One True Infotainment v8.3 (no-delay start)

(function () {
  const headlines = [
    "Markets close up on belief alone",
    "Airborne Faith Exercise exceeds altitude limit",
    "River declared self-cleaning",
    "Breadline renamed Confidence Queue",
    "Patriotic pollen counts reach record highs",
    "Corrected States export surplus of certainty",
    "Candlelight drills extended to noon hours",
    "Public tears now taxable",
    "Neighbor reports highest loyalty rating",
    "Gravity temporarily privatized"
  ];

  function initTicker() {
    const strip = document.getElementById("alert-strip");
    if (!strip) return;

    // Clean legacy children
    while (strip.firstChild) strip.removeChild(strip.firstChild);

    // Create the lone <p> expected by style.css
    const p = document.createElement("p");
    p.setAttribute("aria-live", "polite");

    // Duplicate for long runway, starts immediately
    const text = headlines.join(" • ") + " • " + headlines.join(" • ") + " • ";
    p.textContent = text;

    strip.appendChild(p);

    // Removed reflow/reset block to eliminate startup delay
    // (animation begins immediately per CSS)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTicker);
  } else {
    initTicker();
  }
})();
