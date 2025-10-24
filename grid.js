// ONE TRU INFOTAINMENT — Grid Controller v2.2
// Masonry-fit + ads intermingled with MAX 3 ads visible

document.addEventListener("DOMContentLoaded", () => {
  const MAX_VISIBLE = 10;
  const MAX_ADS = 3;
  const ROW_PX = 8; // must match --row in styles.css

  // Collect all tiles (stories + ads)
  const allTiles = Array.from(document.querySelectorAll(".tile"));

  // Seeded Fisher–Yates shuffle (stable per visit)
  function shuffleSeeded(arr, seed = Date.now() % 1e9) {
    function rnd(){ seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Split into ads / stories, then shuffle independently
  const ads = shuffleSeeded(allTiles.filter(t => t.classList.contains("ad")));
  const stories = shuffleSeeded(allTiles.filter(t => !t.classList.contains("ad")));

  // Build the visible set: up to MAX_ADS ads, fill the rest with stories
  const chosenAds = ads.slice(0, Math.min(MAX_ADS, ads.length));
  const slotsLeft = Math.max(0, MAX_VISIBLE - chosenAds.length);
  const chosenStories = stories.slice(0, Math.min(slotsLeft, stories.length));

  const visible = shuffleSeeded([...chosenAds, ...chosenStories]); // light reshuffle for mix
  const hidden = allTiles.filter(t => !visible.includes(t));

  // Apply visibility
  hidden.forEach(t => t.classList.add("hidden"));
  visible.forEach(t => t.classList.remove("hidden"));

  // Quota for hero spans; respect any spans already in HTML
  const quota = { span2: 1, span2x: 1, span2y: 1 };
  quota.span2  = Math.max(0, quota.span2  - document.querySelectorAll(".tile.span-2").length);
  quota.span2x = Math.max(0, quota.span2x - document.querySelectorAll(".tile.span-2x").length);
  quota.span2y = Math.max(0, quota.span2y - document.querySelectorAll(".tile.span-2y").length);

  // Promote weighty tiles to width spans (height handled by masonry)
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

  // Masonry-fit: compute exact row spans after content loads
  function fitTile(el){
    el.style.gridRow = "auto";
    const total = el.offsetHeight;
    const span = Math.max(20, Math.ceil(total / ROW_PX)); // guard against too-small tiles
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
  queueMicrotask(fitAll);

  let raf;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fitAll);
  });

  console.log(`OTI Grid v2.2: showing ${visible.length}/${allTiles.length}; ads capped at ${Math.min(MAX_ADS, chosenAds.length)}.`);
});
