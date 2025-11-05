/* ============================================================
   ads.js — One True Infotainment
   v7.0 (clean/minimal): deterministic links, no async, no case fiddling
   ============================================================ */
(function () {
  const VERSION = "7.0";
  window.OTI_ADS_VERSION = VERSION;

  // Minimal fallback if no manifest and no window.OTI_ADS
  const FALLBACK = [
    "Angels-AD.jpg",
    "patriot-beer-AD.jpg",
    "patriot-games-AD.jpg",
    "primate-guidelines-AD.jpg",
    "grundymax-AD.jpg",
    "blacks-love-grundy-AD.jpg",
    "OTI-premium-AD.jpg",
    "cover-AD.jpg",
    "cover-AD.png",
    "you-AD-here.jpg"
  ];

  // Exact exceptions that don’t follow the “swap ext to .html” rule
  const SPECIAL = {
    "grundymax-AD.jpg": "grundymax-ad.html"
  };

  // --- Core helpers ---------------------------------------------------------
  function toHtmlHref(name) {
    // Use exact filename case; just change the extension to .html
    if (SPECIAL[name]) return "./" + SPECIAL[name];
    return "./" + String(name).replace(/\.(png|jpg)$/i, ".html");
  }

  function filterAdImages(list) {
    // Only AD tiles; accept JPG or PNG, preserve case
    return (list || []).filter(n => /-AD\.(png|jpg)$/i.test(n));
  }

  async function discoverInventory() {
    if (Array.isArray(window.OTI_ADS)) return filterAdImages(window.OTI_ADS);
    try {
      const res = await fetch("media/ads-manifest.json", { cache: "no-store" });
      if (res.ok) {
        const arr = await res.json();
        const ads = filterAdImages(arr);
        if (ads.length) return ads;
      }
    } catch (_) { /* optional */ }
    return filterAdImages(FALLBACK);
  }

  function createTile(name) {
    const a = document.createElement("a");
    a.className = "ad-link";
    a.href = toHtmlHref(name);

    const pill = document.createElement("span");
    pill.className = "ad-pill";
    pill.textContent = "Financial Patriotism";

    const img = document.createElement("img");
    img.src = "media/" + name;   // exact case for the image file
    img.alt = "Promotional image";
    img.loading = "lazy";
    img.decoding = "async";
    img.draggable = false;

    a.append(pill, img);

    const tile = document.createElement("div");
    tile.className = "ad-tile";
    tile.dataset.name = name;
    tile.appendChild(a);
    return tile;
  }

  function shuffle(a) {
    const arr = a.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // --- Renderers ------------------------------------------------------------
  function renderRow(container, inventory) {
    const track = document.createElement("div");
    track.className = "track";
    const tiles = shuffle(inventory).map(createTile);
    tiles.forEach(t => track.appendChild(t.cloneNode(true)));
    tiles.forEach(t => track.appendChild(t.cloneNode(true))); // seamless loop
    container.innerHTML = "";
    container.appendChild(track);
  }

  function renderSidebar(container, inventory) {
    if (!window.matchMedia("(min-width:701px)").matches) { container.innerHTML = ""; return; }
    // Simple, robust fill — no measurement gymnastics
    const count = Math.min(inventory.length, 6); // keep it tidy
    const picks = shuffle(inventory).slice(0, count).map(createTile);
    const frag = document.createDocumentFragment();
    picks.forEach(p => frag.appendChild(p));
    container.innerHTML = "";
    container.appendChild(frag);
  }

  // --- Boot -----------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", async () => {
    const targets = [...document.querySelectorAll(".ad-container-left, .ad-row")];
    if (!targets.length) return;

    const inventory = await discoverInventory();
    if (!inventory.length) return;

    targets.forEach(container => {
      if (container.classList.contains("ad-row")) {
        renderRow(container, inventory);
      } else {
        renderSidebar(container, inventory);
        const mq = window.matchMedia("(min-width:701px)");
        mq.addEventListener("change", () => renderSidebar(container, inventory));
      }
    });
  });
})();
