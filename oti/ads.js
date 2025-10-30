/* ============================================================
   ads.js — One True Infotainment
   v4.1: clickable ads, patriotic glow, 404 redirect
   - GrundyMax: image/HTML mapping fixed (grundymax-AD.png → grundymax-ad.html)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const targets = [...document.querySelectorAll(".ad-container-left, .ad-row")];
  if (!targets.length) return;

  const mediaInventory = [
    "Angels-AD.png",
    "patriot-beer-AD.png",
    "patriot-games-AD.png",
    "you-AD-here.png",
    "golden-streets.png",
    "grundymax-AD.png",        // corrected asset name (was grundymax-ad.png)
  
  ];

  // Whitelist images whose names clearly indicate ads (e.g., *ad*/*AD*)
  const adImages = mediaInventory.filter(n => /ad/i.test(n));
  if (!adImages.length) return;

  // Optional: map image filenames to specific landing pages (case-insensitive where needed)
  const pageMap = {
    "grundymax-ad.png": "grundymax-ad.html",
    "grundymax-AD.png": "grundymax-ad.html" // ensure correct page regardless of case in asset
  };

  // Shuffle
  const shuffled = adImages.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  targets.forEach(container => {
    const isRow = container.classList.contains("ad-row");
    container.innerHTML = "";

    function createAdLink(name) {
      const mapped = pageMap[name] || name.replace(/\.png$/i, ".html");
      const htmlTarget = "./" + mapped;

      const link = document.createElement("a");
      link.href = htmlTarget;
      link.className = "ad-link";

      // fallback redirect to 404 if the ad page doesn’t exist
      fetch(htmlTarget, { method: "HEAD" })
        .then(res => { if (!res.ok) link.href = "./404.html"; })
        .catch(() => { link.href = "./404.html"; });

      const pill = document.createElement("span");
      pill.className = "ad-pill";
      pill.textContent = "Financial Patriotism";

      const img = document.createElement("img");
      img.src = `media/${name}`;
      img.alt = "Promotional image";
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;

      link.append(pill, img);
      return link;
    }

    if (isRow) {
      const track = document.createElement("div");
      track.className = "track";
      const list = shuffled.slice(0, Math.min(4, shuffled.length));

      const makeSet = () => list.map(name => {
        const tile = document.createElement("div");
        tile.className = "ad-tile";
        tile.appendChild(createAdLink(name));
        return tile;
      });

      makeSet().forEach(t => track.appendChild(t));
      makeSet().forEach(t => track.appendChild(t));
      container.appendChild(track);

    } else {
      const name = shuffled[Math.floor(Math.random() * shuffled.length)];
      const tile = document.createElement("div");
      tile.className = "ad-tile";
      tile.appendChild(createAdLink(name));
      container.appendChild(tile);
    }
  });
});
