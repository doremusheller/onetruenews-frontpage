/* ============================================================
   ticker.js — One True Infotainment (central headlines)
   Injects a scrolling ticker into #ticker on every page.
   Plain JS, no deps. Honors prefers-reduced-motion.
   ============================================================ */

(function () {
  // Canon headlines (single source of truth)
  const HEADLINES = [
    "Officials certify surplus of certainty abroad",
    "Midnight trains now arrive at noon for efficiency audits",
    "Ministry of Metrics expands to feelings and fog",
    "Allies report record levels of coordinated smiling",
    "Border mirrors reinstalled to improve perspective",
    "Weather licensed for patriotic use in coastal capitals",
    "International irony permits reduced to ceremonial quotas",
    "Export-grade optimism cleared for global broadcast",
    "Angels salute the unbroken future at sunrise review"
  ];

  function initTicker() {
    const host = document.getElementById("ticker");
    if (!host) return;

    // Build the <p> once, feed headlines centrally
    const p = document.createElement("p");
    p.setAttribute("role", "text");
    p.textContent = HEADLINES.join(" • ") + " • ";

    // Respect reduced motion
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // No animation; just static, readable line
      p.style.animation = "none";
      p.style.paddingLeft = "0";
    }

    host.appendChild(p);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTicker);
  } else {
    initTicker();
  }

  // Optional: expose a way to update headlines without editing this file
  window.OTI_TICKER = {
    set(items) {
      if (!Array.isArray(items) || !items.length) return;
      const host = document.getElementById("ticker");
      if (!host) return;
      host.textContent = "";
      const p = document.createElement("p");
      p.setAttribute("role", "text");
      p.textContent = items.join(" • ") + " • ";
      host.appendChild(p);
    }
  };
})();
