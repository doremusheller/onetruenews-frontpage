/* ============================================================
   grid.js — One True Infotainment v8.2.1
   Randomizes story tiles, populates index promo grid (sponsors),
   and fills story-page side rails. Flat-file friendly.
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
function makeSponsorTile({ src, alt, title, summary }) {
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

/* Load sponsor pool (filenames fixed to /media) */
function loadSponsorPool() {
  return [
    { src: "media/patriot-beer-ad.png", alt: "Patriot Beer advertisement", title: "Patriot Beer", summary: "Raise a can for correctness." },
    { src: "media/AngelsAd.png", alt: "Angels recruitment", title: "Join the Angels", summary: "Serve brighter. March straighter." },
    { src: "media/ad-here..png", alt: "Placement Available", title: "Placement Available", summary: "This space smiles back." }
  ];
}

window.addEventListener("load", () => {
  /* ---------- Randomize story tiles on the index page ---------- */
  const storyGrid = document.querySelector(".content.grid-layout");
  if (storyGrid) {
    const storyTiles = Array.from(storyGrid.querySelectorAll(".story-tile:not(.sponsor-tile)"));
    shuffle(storyTiles).forEach((t) => storyGrid.appendChild(t));
  }

  /* ---------- Populate promo (sponsor) grid on index page ---------- */
  const promoGrid = document.querySelector(".promo-grid");
  if (promoGrid) {
    const pool = shuffle(loadSponsorPool());
    // Use up to 3 sponsors
    pool.slice(0, 3).forEach((ad) => promoGrid.appendChild(makeSponsorTile(ad)));
  }

  /* ---------- Populate sponsor rails on story pages ---------- */
  const leftRail = document.querySelector(".sponsor-rail.left");
  const rightRail = document.querySelector(".sponsor-rail.right");
  if (leftRail && rightRail) {
    const pool = shuffle(loadSponsorPool());
    if (pool[0]) leftRail.appendChild(makeSponsorTile(pool[0]));
    if (pool[1]) rightRail.appendChild(makeSponsorTile(pool[1]));
  }
});
