const adTiles = [
  "assets/jokeshieldDROP.jpg",
  "assets/bigjesusDROP.jpg",
  "assets/trumpmaxDROP.jpg"
];

function shuffleAds(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function loadRandomAds() {
  const rails = document.querySelectorAll(".ad-rail, .mobile-ad-rail");
  if (!rails.length) return;

  rails.forEach((rail) => {
    const count = Math.random() < 0.5 ? 2 : 3;
    const selectedAds = shuffleAds(adTiles).slice(0, count);

    rail.innerHTML = selectedAds.map((src) => `
      <div class="ad-unit">
        <img src="${src}" alt="Sponsored message" />
      </div>
    `).join("");
  });
}

document.addEventListener("DOMContentLoaded", loadRandomAds);
