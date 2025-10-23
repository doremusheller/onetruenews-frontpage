// grid.js — puzzle-grid randomization v6.9 (root)
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".main-grid");
  if (!grid) return;

  // Collect and shuffle tiles
  const tiles = Array.from(grid.children);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Reinsert in new order
  const frag = document.createDocumentFragment();
  tiles.forEach(t => frag.appendChild(t));
  grid.innerHTML = "";
  grid.appendChild(frag);
});
