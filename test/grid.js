// grid.js — One True Infotainment v8.3
// Randomizes order of story and ad tiles without breaking layout or load times.

document.addEventListener("DOMContentLoaded", () => {

  // Randomize visible story tiles
  const grid = document.querySelector(".content.grid-layout");
  if (grid) {
    const storyTiles = Array.from(grid.querySelectorAll(".story-tile:not(.ad)"));
    const shuffled = storyTiles.sort(() => Math.random() - 0.5);
    shuffled.forEach(tile => grid.appendChild(tile));
  }

  // Randomize ad tiles independently, but only in ad section
  const adSection = document.querySelector(".ad-section");
  if (adSection) {
    const ads = Array.from(adSection.querySelectorAll(".story-tile.ad"));
    const shuffledAds = ads.sort(() => Math.random() - 0.5);
    shuffledAds.forEach(ad => adSection.appendChild(ad));
  }

  // Optional: balance ad load for story pages (side rails)
  const sideRails = document.querySelectorAll(".ad-rail");
  if (sideRails.length) {
    sideRails.forEach(rail => {
      const ads = Array.from(document.querySelectorAll(".story-tile.ad"));
      const randomAd = ads[Math.floor(Math.random() * ads.length)];
      if (randomAd) {
        const clone = randomAd.cloneNode(true);
        clone.classList.add("side-ad");
        rail.appendChild(clone);
      }
    });
  }
});
