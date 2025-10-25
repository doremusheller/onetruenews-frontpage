/* ============================================================
   base.js — One True Infotainment v2
   Core boot script: confirms CSS variables and JS readiness.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  console.log("%cOne True Infotainment v2: Base JS Loaded", "color:#b80000;font-weight:bold;");

  // --- Verify palette variables exist ---
  const root = getComputedStyle(document.documentElement);
  const vars = ["--bg", "--text", "--accent", "--banner-bg"];
  const missing = vars.filter(v => !root.getPropertyValue(v).trim());

  if (missing.length) {
    console.warn("⚠️ Missing palette variables:", missing.join(", "));
  } else {
    console.log("%cPalette verified.", "color:#071b36;");
  }

  // --- Basic status indicator (for quick page tests) ---
  const body = document.body;
  if (body) body.dataset.js = "ready";
});
