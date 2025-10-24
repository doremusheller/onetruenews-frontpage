// ONE TRU INFOTAINMENT — Grid Controller v1.1 (root-level)

document.addEventListener("DOMContentLoaded", () => {
  const allTiles = Array.from(document.querySelectorAll(".tile:not(.ad)"));
  const maxVisible = 10;
  const heroQuota = { span2: 1, span2x: 1, span2y: 1 };

  // Seeded Fisher–Yates for stable per-load shuffle
  function shuffleSeeded(arr, seed = Date.now() % 1e9) {
    function rnd() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Respect existing spans in HTML (don’t double-assign)
  const existing = {
    span2:  document.querySelectorAll(".tile.span-2:not(.ad)").length,
    span2x: document.querySelectorAll(".tile.span-2x:not(.ad)").length,
    span2y: document.querySelectorAll(".tile.span-2y:not(.ad)").length
  };
  heroQuota.span2  = Math.max(0, heroQuota.span2  - existing.span2);
  heroQuota.span2x = Math.max(0, heroQuota.span2x - existing.span2x);
  heroQuota.span2y = Math.max(0, heroQuota.span2y - existing.span2y);

  // Shuffle and pick up to 10
  const tiles = allTiles.slice();
  if (tiles.length > maxVisible) shuffleSeeded(tiles);
  tiles.slice(maxVisible).forEach(t => t.classList.add("hidden"));

  // Promote weights to spans (only if tile doesn’t already have one)
  tiles.slice(0, maxVisible).forEach(t => {
    if (t.classList.contains("span-2") || t.classList.contains("span-2x") || t.classList.contains("span-2y")) return;

    const fit = t.dataset.fit; // wide | tall | square
    const weight = t.dataset.weight; // hero | strong | normal

    if (weight === "hero" || weight === "strong") {
      if (fit === "wide" && heroQuota.span2x) { t.classList.add("span-2x"); heroQuota.span2x--; return; }
      if (fit === "tall" && heroQuota.span2y) { t.classList.add("span-2y"); heroQuota.span2y--; return; }
      if (heroQuota.span2) { t.classList.add("span-2"); heroQuota.span2--; return; }
    }
  });

  console.log(`OTI Grid: showing ${Math.min(allTiles.length, maxVisible)} of ${allTiles.length} stories.`);
});
