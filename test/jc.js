/* ============================================================
   grid.js — One True Infotainment v8.2 Canon
   Handles randomized grid layouts and ad placement
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Randomize story tiles on the index page ---------- */
  const storyGrid = document.querySelector(".content.grid-layout");
  if (storyGrid) {
    const storyTiles = Array.from(
      storyGrid.querySelectorAll(".story-tile:not(.sponsor-tile)")
    );
    shuffleArray(storyTiles);
    storyTiles.forEach((tile) => storyGrid.appendChild(tile));
  }

  /* ---------- Populate ad grid on index page ---------- */
  const adGrid = document.querySelector(".ad-grid");
  if (adGrid) {
    const adTiles = generateAdTiles();
    shuffleArray(adTiles);
    adTiles.forEach((tile) => adGrid.appendChild(tile));
  }

  /* ---------- Populate sponsor rails on story pages ---------- */
  const leftRail = document.querySelector(".sponsor-rail.left");
  const rightRail = document.querySelector(".sponsor-rail.right");
  if (leftRail && rightRail) {
    const adTiles = generateAdTiles();
    shuffleArray(adTiles);
    // place one ad in each rail
    if (adTiles[0]) leftRail.appendChild(adTiles[0]);
    if (adTiles[1]) rightRail.appendChild(adTiles[1]);
  }
});

/* ============================================================
   Helper functions
   ============================================================ */

// Fisher–Yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* Create sponsor ad tiles programmatically */
function generateAdTiles() {
  const ads = [
    {
      src: "media/patriot-beer-ad.png",
      alt: "Patriot Beer advertisement",
      title: "Patriot Beer",
      summary: "Raise a can for correctness.",
    },
    {
      src: "media/AngelsAd.png",
      alt: "Angels recruitment ad",
      title: "Join the Angels",
      summary: "Serve brighter. March straighter.",
    },
    {
      src: "media/ad-here..png",
      alt: "Placement advertisement",
      title: "Placement Available",
      summary: "This space smiles back.",
    },
  ];

  return ads.map((ad) => {
    const article = document.createElement("article");
    article.className = "story-tile sponsor-tile";
    article.innerHTML = `
      <a href="#" class="tile-link" aria-label="Sponsored content">
        <img src="${ad.src}" alt="${ad.alt}" class="tile-image" width="800" height="450" />
        <div class="tile-text">
          <span class="tile-tag">Sponsored</span>
          <h2 class="tile-title">${ad.title}</h2>
          <p class="tile-summary">${ad.summary}</p>
        </div>
      </a>
    `;
    return article;
  });
}
