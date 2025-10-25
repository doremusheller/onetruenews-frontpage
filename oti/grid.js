// grid.js — OTI v9: light shuffle, no ad limits, current classnames
document.addEventListener("DOMContentLoaded", () => {
  // Shuffle main stories (exclude ads)
  const storyGrid = document.querySelector(".content.grid-layout");
  if (storyGrid) {
    const stories = Array.from(storyGrid.querySelectorAll(".story-tile:not(.ad)"));
    shuffle(stories).forEach(el => storyGrid.appendChild(el));
  }

  // Shuffle ads within their own section, show ALL
  const adSection = document.querySelector(".ad-section");
  if (adSection) {
    const ads = Array.from(adSection.querySelectorAll(".story-tile.ad"));
    shuffle(ads).forEach(el => adSection.appendChild(el));
  }
});

function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
