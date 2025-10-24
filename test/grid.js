/* ============================================================
   grid.js — OTI v8.2
   Handles randomization for story tiles and ad tiles.
   Works with flat file structure (no folders, no imports).
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* --- Utility: Shuffle child nodes --- */
  function shuffle(container) {
    if (!container) return;
    const cards = Array.from(container.children);
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    cards.forEach(c => container.appendChild(c));
  }

  /* --- STORY GRID RANDOMIZATION --- */
  const storyGrid = document.querySelector(".content.grid-layout");
  shuffle(storyGrid);

  /* --- AD GRID RANDOMIZATION (index bottom) --- */
  const adGrid = document.querySelector(".ad-grid");
  shuffle(adGrid);

  /* --- STORY PAGE AD RAIL LOGIC --- */
  const adRailLeft = document.querySelector(".sponsor-rail.left");
  const adRailRight = document.querySelector(".sponsor-rail.right");

  // Define the available ad images in /media (filename rule: includes 'ad' or 'Ad')
  const ads = [
    "AngelsAd.png",
    "ad-here..png",
    "patriot-beer-ad.png"
  ];

  // Random helper
  function pickRandom(list, exclude) {
    let choice;
    do {
      choice = list[Math.floor(Math.random() * list.length)];
    } while (choice === exclude && list.length > 1);
    return choice;
  }

  /* --- If on a story page, dynamically fill rails --- */
  if (adRailLeft && adRailRight) {
    const leftAd = pickRandom(ads);
    const rightAd = pickRandom(ads, leftAd);

    adRailLeft.innerHTML = `
      <article class="story-tile sponsor-tile">
        <a href="#" class="tile-link" aria-label="Sponsored">
          <img src="media/${leftAd}" alt="Sponsored message" class="tile-image" loading="lazy" width="400" height="300">
          <div class="tile-text">
            <span class="tile-tag">Sponsored</span>
            <h2 class="tile-title">A Proud Partner</h2>
            <p class="tile-summary">Presented for your correction.</p>
          </div>
        </a>
      </article>
    `;

    adRailRight.innerHTML = `
      <article class="story-tile sponsor-tile">
        <a href="#" class="tile-link" aria-label="Sponsored">
          <img src="media/${rightAd}" alt="Sponsored message" class="tile-image" loading="lazy" width="400" height="300">
          <div class="tile-text">
            <span class="tile-tag">Sponsored</span>
            <h2 class="tile-title">A Loyal Supporter</h2>
            <p class="tile-summary">Drink, serve, or believe responsibly.</p>
          </div>
        </a>
      </article>
    `;
  }

});
