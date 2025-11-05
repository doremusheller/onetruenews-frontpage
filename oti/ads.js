/* ============================================================
   ads.js — One True Infotainment
   v5.2 — Restored stable version
   Purpose: restore static left sidebar, scrolling bottom row,
   and correct hyperlinks to every AD page.
   ============================================================ */
(function(){
  const VERSION = '5.2';
  window.OTI_ADS_VERSION = VERSION;

  /* -----------------------------
     PAGE MAP — exact file matches
     ----------------------------- */
  const PAGE_MAP = {
    "Angels-AD.jpg": "Angels-AD.html",
    "OTI-premium-AD.jpg": "OTI-premium-AD.html",
    "blacks-love-grundy-AD.jpg": "blacks-love-grundy-AD.html",
    "patriot-beer-AD.jpg": "patriot-beer-AD.html",
    "patriot-games-AD.jpg": "patriot-games-AD.html",
    "primate-guidelines-AD.jpg": "primate-guidelines-AD.html",
    "cover-AD.jpg": "cover-AD.html",
    "cover-AD.png": "cover-AD.html",
    "grundymax-AD.jpg": "grundymax-ad.html"
  };

  const LEGACY_INVENTORY = [
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

  /* -----------------------------
     CORE HELPERS
     ----------------------------- */
  function filterAdImages(list){
    return (list || []).filter(n => /-AD\.(png|jpg)$/i.test(n));
  }

  function resolveAdPage(name){
    if (PAGE_MAP[name]) return "./" + PAGE_MAP[name];
    // fallback — just swap extension, preserve case
    return "./" + name.replace(/\.(png|jpg)$/i, ".html");
  }

  function createAdLink(name){
    const link = document.createElement("a");
    link.className = "ad-link";
    link.href = resolveAdPage(name);

    const pill = document.createElement("span");
    pill.className = "ad-pill";
    pill.textContent = "Financial Patriotism";

    const img = document.createElement("img");
    img.src = "media/" + name;
    img.alt = "Promotional image";
    img.loading = "lazy";
    img.decoding = "async";
    img.draggable = false;

    link.append(pill, img);

    const tile = document.createElement("div");
    tile.className = "ad-tile";
    tile.dataset.name = name;
    tile.appendChild(link);
    return tile;
  }

  function shuffle(arr){
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function discoverInventory(){
    if (Array.isArray(window.OTI_ADS)) return filterAdImages(window.OTI_ADS);
    try {
      const res = await fetch("media/ads-manifest.json", { cache: "no-store" });
      if (res.ok) {
        const arr = await res.json();
        const ads = filterAdImages(arr);
        if (ads.length) return ads;
      }
    } catch(_){}
    return filterAdImages(LEGACY_INVENTORY);
  }

  /* -----------------------------
     RENDER FUNCTIONS
     ----------------------------- */
  function populateSidebar(container, inventory){
    // static, non-scrolling sidebar
    const count = Math.min(6, inventory.length);
    const picks = shuffle(inventory).slice(0, count);
    container.innerHTML = "";
    picks.map(createAdLink).forEach(tile => container.appendChild(tile));
  }

  function populateRow(container, inventory){
    // scrolling bottom row
    const track = document.createElement("div");
    track.className = "track";
    const shuffled = shuffle(inventory);
    shuffled.forEach(t => track.appendChild(createAdLink(t).cloneNode(true)));
    shuffled.forEach(t => track.appendChild(createAdLink(t).cloneNode(true)));
    container.innerHTML = "";
    container.appendChild(track);
  }

  /* -----------------------------
     INITIALIZATION
     ----------------------------- */
  document.addEventListener("DOMContentLoaded", async () => {
    const targets = [...document.querySelectorAll(".ad-container-left, .ad-row")];
    if (!targets.length) return;

    const inventory = await discoverInventory();
    if (!inventory.length) return;

    targets.forEach(container => {
      if (container.classList.contains("ad-row")) {
        populateRow(container, inventory);
      } else {
        populateSidebar(container, inventory);
      }
    });
  });
})();
