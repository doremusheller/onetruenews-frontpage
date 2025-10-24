/* ============================================================
   ticker.js — One True Infotainment v8.2 Canon
   Populates the scrolling headline ticker (static strip above banner)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".ticker");
  if (!el) return;

  // Default WIHH-style sardonic headlines (under 10 words each)
  const HEADLINES = [
    "First Citizen explains tomorrow later",
    "River glow officially reclassified as night morale",
    "Patriotic census counts smiles, not people",
    "Veteran Visibility improves lighting, questions persist",
    "Public Smiling Hours extended through winter",
    "Angels salute louder than yesterday",
    "Europe mandates optimism; paperwork optional",
    "Poland bans rain; clouds under investigation",
    "China celebrates year of the same dragon",
    "Taiwan renamed Island of Mutual Understanding",
    "Canada accidentally invades itself again",
    "TAFAJ weather machine under gentle repair",
    "Markets close up on belief alone",
    "Grundy promises to explain later"
  ];

  // Build a single line with separators
  const sep = " • ";
  const line = HEADLINES.join(sep);

  // Write to DOM (text only to avoid HTML issues)
  el.textContent = line;

  // Optional: if you want extra-long scroll, duplicate the content
  // el.textContent = line + sep + line;
});
