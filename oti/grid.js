/* ============================================================
   grid.js — One True Infotainment v2
   Randomizes visible story tiles for freshness
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  // Collect all story tiles
  const tiles = Array.from(grid.querySelectorAll(".tile"));
  if (tiles.length <= 1) return; // Nothing to shuffle

  // Fisher–Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Re-append shuffled tiles to the grid
  tiles.forEach(tile => grid.appendChild(tile));
});
