/* ============================================================
   ads.js — One True Infotainment
   Auto-fills ad containers (left rail + bottom row)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const targets = [
    ...document.querySelectorAll(".ad-container-left, .ad-row")
  ];
  if (!targets.length) return;

  // Canonical inventory (from /media)
  const mediaInventory = [
    "Angels-AD.png",
    "patriot-beer-AD.png",
    "patriot-games-AD.png",
    "you-AD-here.png"
  ];

  // Filter only valid ad images (contains "AD")
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

    // Left ad: 1 random image; Bottom row: up to 4
    const list = isRow
      ? shuffled.slice(0, Math.min(4, Math.max(2, shuffled.length)))
      : [shuffled[Math.floor(Math.random() * shuffled.length)]];

    list.forEach(name => {
      const img = document.createElement("img");
      img.src = `media/${name}`;
      img.alt = "Promotional image";
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;

      // Create tile wrapper for bottom ads
      if (isRow) {
        const tile = document.createElement("div");
        tile.className = "ad-tile";

        // Add “Financial Patriotism” pill
        const pill = document.createElement("span");
        pill.className = "ad-pill";
        pill.textContent = "Financial Patriotism";
        tile.appendChild(pill);

        tile.appendChild(img);
        container.appendChild(tile);
      } else {
        container.appendChild(img);
      }
    });
  });
});
