const adTiles = [
  { img: "assets/jokeshieldDROP.jpg" },
  { img: "assets/bigjesusDROP.jpg" },
  { img: "assets/trumpmaxDROP.jpg" },
  {
    img: "assets/coverDROP.jpg",
    url: "https://www.amazon.com/When-Happened-Here-American-Production-ebook/dp/B0FZ6TCB9P",
    alt: "When It Happened Here — Available Now"
  }
];

function shuffleAds(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function loadRandomAds() {
  const rails = document.querySelectorAll("[data-random-ads]");
  if (!rails.length) return;

  rails.forEach((rail) => {
    const count = Math.random() < 0.5 ? 2 : 3;
    const selectedAds = shuffleAds(adTiles).slice(0, count);

    rail.innerHTML = selectedAds.map((ad) => {
      const imgTag = `<img src="${ad.img}" alt="${ad.alt || ''}" />`;

      if (ad.url) {
        return `
          <div class="ad-unit">
            <a href="${ad.url}" target="_blank" rel="noopener">
              ${imgTag}
            </a>
          </div>
        `;
      }

      return `
        <div class="ad-unit">
          ${imgTag}
        </div>
      `;
    }).join("");
  });
}

document.addEventListener("DOMContentLoaded", loadRandomAds);
