/* ============================================================
   ads.js — One True Infotainment
   Auto-fills ad containers (left rail + bottom row)
   v2: seamless desktop scroll, user-respecting motion
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const targets = [...document.querySelectorAll(".ad-container-left, .ad-row")];
  if (!targets.length) return;

  const mediaInventory = [
    "Angels-AD.png",
    "patriot-beer-AD.png",
    "patriot-games-AD.png",
    "you-AD-here.png"
     "golden-streets.png"
  ];

  // pick only names that look like ads
  const adImages = mediaInventory.filter(n =>
    /ad/i.test(n)
  );
  if (!adImages.length) return;

  // shuffle helper
  const shuffled = adImages.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  targets.forEach(container => {
    const isRow = container.classList.contains("ad-row");
    container.innerHTML = "";

    if (isRow) {
      // bottom row — build seamless belt
      const track = document.createElement("div");
      track.className = "track";
      const list = shuffled.slice(0, Math.min(4, shuffled.length));

      // helper to make one full set of ad tiles
      function makeSet() {
        return list.map(name => {
          const tile = document.createElement("div");
          tile.className = "ad-tile";
          const pill = document.createElement("span");
          pill.className = "ad-pill";
          pill.textContent = "Financial Patriotism";
          const img = document.createElement("img");
          img.src = `media/${name}`;
          img.alt = "Promotional image";
          img.loading = "lazy";
          img.decoding = "async";
          img.draggable = false;
          tile.append(pill, img);
          return tile;
        });
      }

      // append two identical sets for seamless loop
      makeSet().forEach(t => track.appendChild(t));
      makeSet().forEach(t => track.appendChild(t));

      container.appendChild(track);
    } else {
      // left-rail single ad
      const name = shuffled[Math.floor(Math.random() * shuffled.length)];
      const img = document.createElement("img");
      img.src = `media/${name}`;
      img.alt = "Promotional image";
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;
      container.appendChild(img);
    }
  });
});
