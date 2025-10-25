/* grid.js — OTI v9: shuffle stories, respect pinned, no ads */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".content.grid-layout");
  if (!grid) return;

  // Collect story tiles, exclude any explicitly pinned
  const pinned = Array.from(grid.querySelectorAll(".story-tile[data-fit-fixed]"));
  const stories = Array.from(grid.querySelectorAll(".story-tile:not([data-fit-fixed])"));

  // Shuffle non-pinned tiles and re-append
  shuffle(stories).forEach(tile => grid.appendChild(tile));

  // Re-append pinned tiles in original DOM order at the top
  // (Ensures they stay leading even after reflows)
  if (pinned.length) {
    pinned.reverse().forEach(tile => grid.insertBefore(tile, grid.firstElementChild));
  }
});

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
