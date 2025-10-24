/* =========================================================
   grid.js — One True Infotainment v8.0
   Randomizes story tiles for spontaneous propaganda flow
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid-layout");
  if (!grid) return;

  const tiles = Array.from(grid.children);
  if (tiles.length < 2) return;

  // Fisher–Yates shuffle to randomize story order
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Re-append in randomized order
  tiles.forEach(tile => grid.appendChild(tile));

  // Optional subtle entrance animation
  tiles.forEach((tile, index) => {
    tile.style.opacity = "0";
    tile.style.transform = "translateY(20px)";
    tile.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    setTimeout(() => {
      tile.style.opacity = "1";
      tile.style.transform = "translateY(0)";
    }, 100 * index);
  });
});
