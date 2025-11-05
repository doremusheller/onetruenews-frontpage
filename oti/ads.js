/* ============================================================
   ads.js — One True Infotainment
   v4.8: Added cover ad mapping and inventory entry
   ============================================================ */
(function(){
  const VERSION = '4.8';

  const PAGE_MAP = {
    "grundymax-ad.jpg": "grundymax-ad.html",
    "grundymax-AD.jpg": "grundymax-ad.html",
    "OTI-premium-AD.jpg": "oti-premium-ad.html",
    "blacks-love-grundy-AD.jpg": "blacks-love-grundy-ad.html",
    // New: explicit mapping for cover ad
    "cover-AD.jpg": "cover-ad.html"
  };

  const LEGACY_INVENTORY = [
    "Angels-AD.jpg",
    "patriot-beer-AD.jpg",
    "patriot-games-AD.jpg",
    "you-AD-here.jpg",
    "golden-streets-AD.jpg",
    "primate-guidelines-AD.jpg",
    "grundymax-AD.jpg",
    "OTI-premium-AD.jpg",
    "blacks-love-grundy-AD.jpg",
    // Added cover ad to legacy inventory
    "cover-AD.jpg"
  ];

  function filterAdImages(list){
    return (list || []).filter(n => /AD\.(png|jpg)$/i.test(n));
  }

  function resolveAdPage(name){
    if (PAGE_MAP[name]) return "./" + PAGE_MAP[name];
    const html = name.replace(/\.(png|jpg)$/i, ".html");
    return "./" + html;
  }

  const headCache = new Map();
  async function verifyOrFallback(href){
    if (headCache.has(href)) return headCache.get(href);
    let target = href;
    try {
      let res = await fetch(target, { method: 'HEAD' });
      if (!res.ok) {
        const lower = target.replace(/([^\/]+)$/, m => m.toLowerCase());
        res = await fetch(lower, { method: 'HEAD' });
        target = res.ok ? lower : './404.html';
      }
    } catch(_) { target = './404.html'; }
    headCache.set(href, target);
    return target;
  }

  function createAdLink(name){
    const link = document.createElement("a");
    link.className = "ad-link";
    link.href = resolveAdPage(name);

    verifyOrFallback(link.href).then(valid => { link.href = valid; });

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

  function isDesktop(){ return window.matchMedia('(min-width:701px)').matches; }

  function batchAppend(parent, nodes){
    const frag = document.createDocumentFragment();
    nodes.forEach(n => frag.appendChild(n));
    parent.appendChild(frag);
  }

  function uniquePick(list, count){
    const slice = list.slice(0, Math.max(0, Math.min(count, list.length)));
    return slice;
  }

  function populateSidebar(container, inventory){
    if (!isDesktop()) { container.innerHTML = ''; return; }

    container.style.display = 'grid';
    container.style.gridAutoRows = 'auto';
    container.style.rowGap = '8px';
    container.style.overflow = 'hidden';

    const sample = createAdLink(inventory[0]);
    sample.style.visibility = 'hidden';
    sample.style.pointerEvents = 'none';
    container.innerHTML = '';
    container.appendChild(sample);

    requestAnimationFrame(() => {
      const tileH = Math.max(1, sample.getBoundingClientRect().height);
      const gap = 8;

      const page = document.querySelector('.page');
      const pageRect = page ? page.getBoundingClientRect() : { bottom: window.innerHeight };
      const containerRect = container.getBoundingClientRect();

      const maxHeight = Math.max(120, Math.floor(pageRect.bottom - containerRect.top - 12));
      container.style.maxHeight = maxHeight + 'px';

      const slots = Math.max(1, Math.floor((maxHeight + gap) / (tileH + gap)));
      const picks = uniquePick(shuffle(inventory), slots).map(createAdLink);

      container.innerHTML = '';
      batchAppend(container, picks);
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const targets = [...document.querySelectorAll(".ad-container-left, .ad-row")];
    if (!targets.length) return;

    const inventory = await discoverInventory();
    if (!inventory.length) return;

    const shuffled = shuffle(inventory);

    targets.forEach(container => {
      const isRow = container.classList.contains("ad-row");
      container.innerHTML = "";

      if (isRow) {
        const track = document.createElement("div");
        track.className = "track";
        const ads = shuffled.map(createAdLink);
        ads.forEach(t => track.appendChild(t.cloneNode(true)));
        ads.forEach(t => track.appendChild(t.cloneNode(true)));
        container.appendChild(track);
      } else {
        const render = () => populateSidebar(container, shuffled);
        const debounced = debounce(render, 120);
        render();

        const ro = new ResizeObserver(() => debounced());
        ro.observe(document.documentElement);

        const grid = document.getElementById('storyGrid');
        if (grid) {
          const mo = new MutationObserver(() => debounced());
          mo.observe(grid, { childList: true });
        }

        window.matchMedia('(min-width:701px)').addEventListener('change', () => debounced());
      }
    });
  });

  function debounce(fn, ms){
    let t; return function(){ clearTimeout(t); t = setTimeout(fn, ms); };
  }
})();
