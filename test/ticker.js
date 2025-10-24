// One True Infotainment — Ticker (readable, rhythmic, accessible)

const headlines = [
  "China Finally Admits the Sky Was Borrowed.",
  "Russia Declares Peace, Invades Celebration.",
  "Taiwan Wins War of Courtesy, Loses Internet.",
  "Poland Relocates Border to Avoid Arguments.",
  "India Credits Silence as Exportable Resource.",
  "Germany Launches New Efficiency Index: Breath Per Minute.",
  "France Bans Clouds After Weekend of Indecision.",
  "Britain Applies for Entry Into Its Own Empire.",
  "Canada Issues Polite Warning, Immediately Apologizes.",
  "Japan Announces Emotional Support Robot for Emotional Support Robots."
];

function buildTickerLine(items) {
  // Thin bullet with readable spacing
  const SEP = " \u2022\u00A0\u00A0"; // •␠␠ (non-breaking spaces)
  return items.join(SEP);
}

function populateTicker() {
  const strip = document.querySelector(".alert-strip");
  const ticker = document.querySelector(".ticker");
  if (!strip || !ticker) return;

  // Respect reduced motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Build content and duplicate for seamless loop
  const line = buildTickerLine(headlines);
  // Duplicate 3x to ensure there is always content beyond the viewport
  ticker.textContent = `${line}  ${line}  ${line}`;

  // If reduced motion, stop here (static line)
  if (prefersReduced) {
    ticker.style.animation = "none";
    return;
  }

  // After paint, measure full width and set duration so speed is ~90px/sec
  requestAnimationFrame(() => {
    const totalWidth = ticker.scrollWidth;           // full content width
    const pxPerSecond = 90;                          // target speed (tweakable)
    const durationSec = Math.max(15, totalWidth / pxPerSecond);

    // Attach a unique animation with computed duration
    ticker.style.animationDuration = `${durationSec}s`;
  });
}

document.addEventListener("DOMContentLoaded", populateTicker);
