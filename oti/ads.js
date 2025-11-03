/* ============================================================
   ads.js — One True Infotainment
   v4.2: full-row population, optional manifest, graceful fallbacks
   - Autopopulates .ad-row with ALL available AD images (no hard 4-cap)
   - Optional discovery via window.OTI_ADS or media/ads-manifest.json
   - Retains page mapping & 404 safety
   ============================================================ */

(function(){
  const PAGE_MAP = {
    "grundymax-ad.png": "grundymax-ad.html",
    "grundymax-AD.png": "grundymax-ad.html" // case-insensitive support
  };

  // Legacy built-in inventory as final fallback
  const LEGACY_INVENTORY = [
    "Angels-AD.png",
    "patriot-beer-AD.png",
    "patriot-games-AD.png",
    "you-AD-here.png",
    "golden-streets.png",
    "grundymax-AD.png"
  ];

  function filterAdImages(list){
    return (list || []).filter(n => /AD\.png$/i.test(n));
  }

  function resolveAdPage(name){
    const mapped = PAGE_MAP[name] || name.replace(/\.png$/i, ".html");
    return "./" + mapped;
  }

  function createAdLink(name){
    const link = document.createElement("a");
    link.className = "ad-link";
    const htmlTarget = resolveAdPage(name);
    link.href = htmlTarget;

    // 404 fallback if target page is missing
    try {
      fetch(htmlTarget, { method: "HEAD" })
        .then(res => { if (!res.ok) link.href = "./404.html"; })
        .catch(() => { link.href = "./404.html"; });
    } catch(_) { link.href = "./404.html"; }

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

  function shuffle(arr){
    const a = arr.slice();
    for (let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function discoverInventory(){
    // Priority 1: window.OTI_ADS provided by page
    if (Array.isArray(window.OTI_ADS)) {
      return filterAdImages(window.OTI_ADS);
    }

    // Priority 2: try manifest at media/ads-manifest.json (array of filenames)
    try {
      const res = await fetch("media/ads-manifest.json", { cache: "no-store" });
      if (res.ok) {
        const arr = await res.json();
        const ads = filterAdImages(arr);
        if (ads.length) return ads;
      }
    } catch(_) { /* noop fallback */ }

    // Priority 3: fallback to legacy list
    return filterAdImages(LEGACY_INVENTORY);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const targets = [...document.querySelectorAll(".ad-container-left, .ad-row")];
    if (!targets.length) return;

    const inventory = await discoverInventory();
    if (!inventory.length) return;

    // Randomize once per page for variety
    const shuffled = shuffle(inventory);

    targets.forEach(container => {
      const isRow = container.classList.contains("ad-row");
      container.innerHTML = "";

      if (isRow) {
        const track = document.createElement("div");
        track.className = "track";

        // Use ALL available ads (no 4-cap). Duplicate set for seamless scroll.
        const set = shuffled.map(name => {
          const tile = document.createElement("div");
          tile.className = "ad-tile";
          tile.appendChild(createAdLink(name));
          return tile;
        });

        // Append two full sets to allow continuous marquee effect in CSS
        set.forEach(t => track.appendChild(t.cloneNode(true)));
        set.forEach(t => track.appendChild(t.cloneNode(true)));

        container.appendChild(track);
      } else {
        // Sidebar container: single random ad from the shuffled list
        const name = shuffled[Math.floor(Math.random()*shuffled.length)];
        const tile = document.createElement("div");
        tile.className = "ad-tile";
        tile.appendChild(createAdLink(name));
        container.appendChild(tile);
      }
    });
  });
})();
