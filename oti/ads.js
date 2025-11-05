/* ============================================================
   ads.js — One True Infotainment
   v7.1 — emergency stable: static sidebar + static bottom row,
           exact hrefs, zero animation, zero measurement.
   ============================================================ */
(function () {
  const VERSION = "7.1";
  window.OTI_ADS_VERSION = VERSION;

  // Exact map to your live pages (case-accurate)
  const PAGE_MAP = {
    "Angels-AD.jpg": "Angels-AD.html",
    "OTI-premium-AD.jpg": "OTI-premium-AD.html",
    "blacks-love-grundy-AD.jpg": "blacks-love-grundy-AD.html",
    "patriot-beer-AD.jpg": "patriot-beer-AD.html",
    "patriot-games-AD.jpg": "patriot-games-AD.html",
    "primate-guidelines-AD.jpg": "primate-guidelines-AD.html",
    "cover-AD.jpg": "cover-AD.html",
    "cover-AD.png": "cover-AD.html",
    "grundymax-AD.jpg": "grundymax-ad.html" // the one lowercase page
  };

  // Minimal fallback if there’s no manifest or window.OTI_ADS
  const FALLBACK = [
    "Angels-AD.jpg",
    "patriot-beer-AD.jpg",
    "patriot-games-AD.jpg",
    "you-AD-here.jpg",
    "blacks-love-grundy-AD.jpg",
    "OTI-premium-AD.jpg",
    "grundymax-AD.jpg",
    "golden-streets-AD.jpg",
    "cover-AD.png",
    "primate-guidelines-AD.jpg"
  ];

  // -------- helpers --------
  function filterAds(list) {
    return (list || []).filter(n => /-AD\.(png|jpg)$/i.test(n));
  }
  function hrefFor(name) {
    if (PAGE_MAP[name]) return "./" + PAGE_MAP[name];
    return "./" + String(name).replace(/\.(png|jpg)$/i, ".html"); // preserve case
  }
  function makeTile(name) {
    const a = document.createElement("a");
    a.className = "ad-link";
    a.href = hrefFor(name);

    const pill = document.createElement("span");
    pill.className = "ad-pill";
    pill.textContent = "Financial Patriotism";

    const img = document.createElement("img");
    img.src = "media/" + name;  // exact-case image
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
  async function loadInventory() {
    if (Array.isArray(window.OTI_ADS)) return filterAds(window.OTI_ADS);
    try {
      const res = await fetch("media/ads-manifest.json", { cache: "no-store" });
      if (res.ok) {
        const arr = await res.json();
        const ads = filterAds(arr);
        if (ads.length) return ads;
      }
    } catch(_) {}
    return filterAds(FALLBACK);
  }

  // -------- renderers (static only) --------
  function renderSidebar(container, inv) {
    const picks = shuffle(inv).slice(0, Math.min(6, inv.length));
    const frag = document.createDocumentFragment();
    picks.map(makeTile).forEach(n => frag.appendChild(n));
    container.innerHTML = "";
    container.appendChild(frag);
  }
  function renderRow(container, inv) {
    // Just a plain row of tiles — no track, no animation
    const picks = shuffle(inv);
    const frag = document.createDocumentFragment();
    picks.map(makeTile).forEach(n => frag.appendChild(n));
    container.innerHTML = "";
    container.appendChild(frag);
  }

  // -------- boot --------
  document.addEventListener("DOMContentLoaded", async () => {
    const targets = [...document.querySelectorAll(".ad-container-left, .ad-row")];
    if (!targets.length) return;

    const inventory = await loadInventory();
    if (!inventory.length) return;

    targets.forEach(el => {
      if (el.classList.contains("ad-row")) renderRow(el, inventory);
      else renderSidebar(el, inventory);
    });
  });
})();
