/* ============================================================
   ads.js — One True Infotainment
   v4: clickable ads, patriotic glow, 404 redirect
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
    "grundymax-ad.png",
    "max-supplement-AD.png"
  ];

  const adImages = mediaInventory.filter(n => /ad/i.test(n));
  if (!adImages.length) return;

  const shuffled = adImages.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  targets.forEach(container => {
    const isRow = container.classList.contains("ad-row");
    container.innerHTML = "";

    function createAdLink(name) {
      const htmlTarget = "./" + name.replace(/\.png$/i, ".html");
      const link = document.createElement("a");
      link.href = htmlTarget;

      // fallback redirect to 404 if the ad page doesn’t exist
      fetch(htmlTarget, { method: "HEAD" })
        .then(res => { if (!res.ok) link.href = "./404.html"; })
        .catch(() => { link.href = "./404.html"; });

      link.className = "ad-link";

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
