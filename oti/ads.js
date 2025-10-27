/* ads.js — auto-fill ad containers from /media where name contains "AD" (case-insensitive) */
document.addEventListener("DOMContentLoaded", () => {
  const targets = [...document.querySelectorAll(".ad-container-left, .ad-row")];
  if (!targets.length) return;

  // Canonical inventory (indexed from /media)
  const mediaInventory = [
    "Angels-AD.png",
    "patriot-beer-AD.png",
    "patriot-games-AD.png",
    "you-AD-here.png",
    // Non-ad images present (ignored by filter)
    // "banner.png","banner-wide.png","border-banners.png","domestic-smiles.png",
    // "friendship-rebuild.png","grundy-accuses-host.png","grundy-explains-health.png",
    // "hammer-of-grundy-concert.png","patriot-games-promo.png","patriotic-census.png",
    // "public-smiling.png","river-glow.png","tafaj-bulletin.jpg.png","tafajsatan.png",
    // "threatmeter.png","veteran-visibility.png"
  ];

  // Filter for filenames indicating ads
  const adImages = mediaInventory.filter(n =>
    /(^|[-_])ad(\.|-)/i.test(n) || /-AD\.png$/i.test(n) || /AD/i.test(n)
  );
  if (!adImages.length) return;

  // Shuffle once
  const shuffled = adImages.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  targets.forEach(container => {
    container.innerHTML = "";
    const isRow = container.classList.contains("ad-row");

    // Left ad: one random; bottom row: 2–4 random tiles
    const list = isRow
      ? shuffled.slice(0, Math.min(4, Math.max(2, shuffled.length)))
      : [shuffled[Math.floor(Math.random() * shuffled.length)]];

    list.forEach(name => {
      const img = document.createElement("img");
      img.src = `media/${name}`;   // correct relative path (same folder)
      img.alt = "Promotional image";
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;
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
