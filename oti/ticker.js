/* ============================================================
   ticker.js — One True Infotainment v2
   Simple continuous scroll for Breaking News strip
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const ticker = document.getElementById("ticker");
  if (!ticker) return;

  // Canonical headlines
  const headlines = [
    "Officials certify surplus of certainty abroad",
    "Midnight trains now arrive at noon for efficiency audits",
    "Friendship Correction opens satellite embassy in Neutral Waters",
    "Ministry of Metrics expands to feelings and fog",
    "Allies report record levels of coordinated smiling",
    "Border mirrors reinstalled to improve perspective",
    "Weather licensed for patriotic use in coastal capitals",
    "International irony permits reduced to ceremonial quotas",
    "Export-grade optimism cleared for global broadcast",
    "Angels salute the unbroken future at sunrise review"
  ];

  // Create ticker text
  const text = headlines.join(" • ");
  const p = document.createElement("p");
  p.textContent = text;
  ticker.innerHTML = "";
  ticker.appendChild(p);
});
