/* ============================================================
   grid.js — One True Infotainment v8.2.1
   Randomizes story tiles, populates index ad grid, and fills
   story-page ad rails. Robust to future ad additions via an
   optional JSON manifest. Flat-file friendly.
   ============================================================ */

/* Helper: Fisher–Yates shuffle */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* Helper: Create a sponsor/ad tile element */
function makeAdTile({ src, alt, title, summary }) {
  const article = document.createElement("article");
  article.className = "story-tile sponsor-tile";
  article.innerHTML = `
    <a href="#" class="tile-link" aria-label="Sponsored content">
      <img src="${src}" alt="${alt}" class="tile-image" width="800" height="450" />
      <div class="tile-text">
        <span class="tile-tag">Sponsored</span>
        <h2 class="tile-title">${title}</h2>
        <p class="tile-summary">${summary}</p>
      </div>
    </a>
  `;
  return article;
}

/* Helper: Load ad pool
   Priority:
   1) JSON manifest in DOM: <script id="ads-manifest" type="application/json">["fileA.png", ...]</script>
   2) Fallback to known filenames
*/
function loadAdPool() {
  const fallback = [
    "media/patriot-beer-ad.png",
    "media/AngelsAd.png",
    "media/ad-here..png",
  ];

  try {
    const node = document.getElementById("ads-manifest");
    if (!node) return fallback;

    const list = JSON.parse(node.textContent || "[]");
    // Sanity filter: keep only entries that look like /media/* and contain "ad"
    const cleaned = (Array.isArray(list) ? list : [])
      .map(String)
      .filter((p) => p.includes("media/") && p.toLowerCase().includes("ad"));
    return cleaned.length ? cleaned : fallback;
  } catch {
    return fallback;
  }
}

/* Build ad objects from filenames */
function buildAdObjects(paths) {
  // Simple label generator from filename
  const label = (p) =>
    p.split("/").pop().replace(/\.(png|jpg|jpeg|webp)$/i, "").replace(/[-_.]+/g, " ");
  return paths.map((src) => ({
    src,
    alt: "Sponsored message",
    title: label(src).replace(/\bad\b/i, "").trim() || "Sponsored",
    summary: "Presented for your correction.",
  }));
}

window.addEventListener("load", () => {
  /* ---------- Randomize story tiles on the index page ---------- */
  const storyGrid = document.querySelector(".content.grid-layout");
  if (storyGrid) {
    const storyTiles = Array.from(
      storyGrid.querySelectorAll(".story-tile:not(.sponsor-tile)")
    );
    shuffle(storyTiles).forEach((t) => storyGrid.appendChild(t));
  }

  /* ---------- Prepare ad pool once ---------- */
  const adPaths = loadAdPool();
  const adObjs = buildAdObjects(adPaths);
  shuffle(adObjs);

  /* ---------- Populate ad grid on index page (bottom) ---------- */
  const adGrid = document.querySelector(".ad-grid");
  if (adGrid) {
    // Use up to 3 ads for the index-footer grid
    const slice = adObjs.slice(0, Math.min(3, adObjs.length));
    slice.forEach((ad) => adGrid.appendChild(makeAdTile(ad)));
  }

  /* ---------- Populate sponsor rails on story pages ---------- */
  const leftRail = document.querySelector(".sponsor-rail.left");
  const rightRail = document.querySelector(".sponsor-rail.right");
  if (leftRail && rightRail) {
    const pool = shuffle([...adObjs]);
    if (pool[0]) leftRail.appendChild(makeAdTile(pool[0]));
    if (pool[1]) rightRail.appendChild(makeAdTile(pool[1]));
  }
});
