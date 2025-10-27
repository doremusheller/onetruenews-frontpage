/* grid.js — shuffle tiles except `.breaking` (pinned first) */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("storyGrid");
  if (!grid) return;

  const tiles = Array.from(grid.querySelectorAll(".tile"));
  if (!tiles.length) return;

  // Separate breaking (pinned) tiles from the rest
  const pinned = tiles.filter(t => t.classList.contains("breaking"));
  const rest = tiles.filter(t => !t.classList.contains("breaking"));

  // Fisher–Yates shuffle for the rest
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }

  // Rebuild the grid with pinned first
  grid.innerHTML = "";
  pinned.forEach(t => grid.appendChild(t));
  rest.forEach(t => grid.appendChild(t));
});
