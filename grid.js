// ONE TRU INFOTAINMENT — Grid Controller v1.0 (root-level version)

document.addEventListener("DOMContentLoaded", () => {
  const tiles = Array.from(document.querySelectorAll(".tile:not(.ad)"));
  const maxVisible = 10;
  const heroQuota = { span2: 1, span2x: 1, span2y: 1 };

  if (tiles.length > maxVisible) {
    // Shuffle with deterministic session seed
    const seed = Math.floor(performance.now()) % 100000;
    tiles.sort((a, b) => (Math.sin(seed + tiles.indexOf(a)) > 0 ? 1 : -1));
  }

  // Apply hero spans by weight and fit
  const heroes = tiles.filter(
    t => t.dataset.weight === "hero" || t.dataset.weight === "strong"
  );
  heroes.forEach(t => {
    const fit = t.dataset.fit;
    if (fit === "wide" && heroQuota.span2x) {
      t.classList.add("span-2x");
      heroQuota.span2x--;
    } else if (fit === "tall" && heroQuota.span2y) {
      t.classList.add("span-2y");
      heroQuota.span2y--;
    } else if (heroQuota.span2) {
      t.classList.add("span-2");
      heroQuota.span2--;
    }
  });

  // Hide extras beyond 10
  tiles.slice(maxVisible).forEach(t => t.classList.add("hidden"));

  console.log(`OTI Grid initialized — showing ${Math.min(tiles.length, maxVisible)} of ${tiles.length} stories.`);
});
