const adTiles = [
  "assets/jokeshieldDROP.jpg",
  "assets/bigjesusDROP.jpg",
  "assets/trumpmaxDROP.jpg"
];

function shuffleAds(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function loadRandomAds() {
  const rails = document.querySelectorAll(".ad-rail");
  if (!rails.length) return;

  const count = Math.random() < 0.5 ? 2 : 3;
  const selectedAds = shuffleAds(adTiles).slice(0, count);

  rails.forEach((rail) => {
    rail.innerHTML = selectedAds.map((src) => `
      <div class="ad-unit">
        <img src="${src}" alt="Sponsored message" />
      </div>
    `).join("");
  });
}

document.addEventListener("DOMContentLoaded", loadRandomAds);
