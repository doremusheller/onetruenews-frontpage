/* ============================================================
   ads.js — One True Infotainment
   Auto-fills ad containers with any /media image containing "AD"
   (case-insensitive). Non-interactive, lightweight, and canon-safe.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const adContainers = [
    ...document.querySelectorAll(".ad-container-left, .ad-row")
  ];

  if (adContainers.length === 0) return;

  // Predefined fallback list (for static environments like GitHub Pages)
  const mediaFiles = [
    "ad-here.png",
    "AngelsAd.png",
    "patriot-beer-ad.png",
    "patriot-games-promo.png",
    "CorrectedAaF.png"
  ];

  // Filter for ad-related images (filenames containing "ad" or "AD")
  const adImages = mediaFiles.filter(name => /ad/i.test(name));

  adContainers.forEach(container => {
    // Clear any placeholder content
    container.innerHTML = "";

    // Choose random ad or multiple ads depending on container type
    const isRow = container.classList.contains("ad-row");
    const adsToShow = isRow ? adImages : [adImages[Math.floor(Math.random() * adImages.length)]];

    adsToShow.forEach(imgName => {
      const img = document.createElement("img");
      img.src = `media/${imgName}`;
      img.alt = "Promotional image";
      img.loading = "lazy";
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.objectFit = "contain";

      // Wrap each in a tile for consistent styling
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
