/* ads.js — auto-fill ad containers from /media where name contains "AD" (case-insensitive) */
document.addEventListener("DOMContentLoaded", () => {
  const targets = [...document.querySelectorAll(".ad-container-left, .ad-row")];
  if (!targets.length) return;

  // Canonical inventory (reindexed from /media)
  const mediaInventory = [
    "Angels-AD.png",
    "patriot-beer-AD.png",
    "patriot-games-AD.png",
    "you-AD-here.png",

    // non-ad images present (ignored by filter):
    // "banner.png","banner-wide.png","border-banners.png","domestic-smiles.png",
    // "friendship-rebuild.png","grundy-accuses-host.png","grundy-explains-health.png",
    // "hammer-of-grundy-concert.png","patriot-games-promo.png","patriotic-census.png",
    // "public-smiling.png","river-glow.png","tafaj-bulletin.jpg.png","tafajsatan.png",
    // "threatmeter.png","veteran-visibility.png"
  ];

  const adImages = mediaInventory.filter(n => /(^|[-_])ad(\.|-)/i.test(n) || /-AD\.png$/i.test(n) || /AD/i.test(n));
  if (!adImages.length) return;

  targets.forEach(container => {
    container.innerHTML = "";
    const isRow = container.classList.contains("ad-row");

    const list = isRow ? adImages : [adImages[Math.floor(Math.random()*adImages.length)]];
    list.forEach(name => {
      const img = document.createElement("img");
      img.src = `media/${name}`;
      img.alt = "Promotional image";
      img.loading = "lazy";
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.objectFit = "contain";

      if (isRow) {
        const tile = document.createElement("div");
        tile.className = "ad-tile";
        tile.appendChild(img);
        container.appendChild(tile);
      } else {
        container.appendChild(img);
      }
    });
  });
});
