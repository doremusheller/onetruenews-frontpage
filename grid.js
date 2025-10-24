// ONE TRU INFOTAINMENT — Grid Controller v2.0 (masonry-fit, root-level)

document.addEventListener("DOMContentLoaded", () => {
  const MAX_VISIBLE = 10;
  const ROW_PX = 8; // must match CSS --row
  const allTiles = Array.from(document.querySelectorAll(".tile:not(.ad)"));

  // Seeded Fisher–Yates for stable shuffle per visit
  function shuffleSeeded(arr, seed = Date.now() % 1e9) {
    function rnd(){ seed = (seed*1664525+1013904223) % 4294967296; return seed/4294967296; }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Respect pre-marked spans in HTML
  const quota = { span2: 1, span2x: 1, span2y: 1 };
  quota.span2  -= document.querySelectorAll(".tile.span-2:not(.ad)").length;
  quota.span2x -= document.querySelectorAll(".tile.span-2x:not(.ad)").length;
  quota.span2y -= document.querySelectorAll(".tile.span-2y:not(.ad)").length;
  quota.span2  = Math.max(0, quota.span2);
  quota.span2x = Math.max(0, quota.span2x);
  quota.span2y = Math.max(0, quota.span2y);

  // 1) Shuffle + show only 10
  const tiles = allTiles.slice();
  if (tiles.length > MAX_VISIBLE) shuffleSeeded(tiles);
  tiles.slice(MAX_VISIBLE).forEach(t => t.classList.add("hidden"));
  const visible = tiles.slice(0, MAX_VISIBLE);

  // 2) Promote a few to wide/tall/2x2 based on data-fit/weight
  visible.forEach(t => {
    if (t.classList.contains("span-2") || t.classList.contains("span-2x") || t.classList.contains("span-2y")) return;
    const fit = t.dataset.fit;        // wide | tall | square
    const weight = t.dataset.weight;  // hero | strong | normal
    if (weight === "hero" || weight === "strong") {
      if (fit === "wide" && quota.span2x) { t.classList.add("span-2x"); quota.span2x--; return; }
      if (fit === "tall" && quota.span2y) { t.classList.add("span-2y"); quota.span2y--; return; }
      if (quota.span2) { t.classList.add("span-2"); quota.span2--; return; }
    }
  });

  // 3) Masonry fit pass — compute exact row spans after images load
  function fitTile(el){
    // Temporarily let the tile size itself, then measure total height
    el.style.gridRow = "auto";
    const total = el.offsetHeight;
    const span = Math.max(20, Math.ceil(total / ROW_PX)); // floor for very small items
    el.style.setProperty("--span", span);
    el.style.gridRow = `span ${span}`;
  }

  function whenReady(el, cb){
    const img = el.querySelector("img.thumb");
    if (!img) return cb();
    if (img.complete && img.naturalHeight > 0) return cb();
    img.addEventListener("load", cb, { once: true });
    img.addEventListener("error", cb, { once: true });
  }

  function fitAll(){ visible.forEach(fitTile); }

  visible.forEach(t => whenReady(t, () => fitTile(t)));
  // Also refit on resize (debounced)
  let raf;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fitAll);
  });

  console.log(`OTI Grid v2: showing ${visible.length} (of ${allTiles.length}); masonry-fit active.`);
});
