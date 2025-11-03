/* ============================================================
   ads.js — One True Infotainment
   v4.3: full-row population + desktop sidebar stack (no CSS edits)
   - .ad-row uses ALL AD images (duplicated set for seamless scroll)
   - .ad-container-left stacks N tiles to page bottom on desktop only
   - Zero HTML/CSS changes required; inline style applied to sidebar container
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

    const tile = document.createElement("div");
    tile.className = "ad-tile";
    tile.appendChild(link);
    return tile;
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

  function isDesktop(){
    return window.matchMedia('(min-width:701px)').matches;
  }

  function batchAppend(parent, nodes){
    const frag = document.createDocumentFragment();
    nodes.forEach(n => frag.appendChild(n));
    parent.appendChild(frag);
  }

  // Sidebar stack: compute how many tiles fit without extending page
  function populateSidebarStack(container, inventory){
    if (!isDesktop()) return; // mobile sidebar is hidden by CSS anyway

    // Inline styles avoid stylesheet edits
    container.style.display = 'grid';
    container.style.gridAutoRows = 'auto';
    container.style.rowGap = '8px';
    container.style.overflow = 'hidden';

    // Prepare a sample tile to measure actual height
    const sample = createAdLink(inventory[0]);
    sample.style.visibility = 'hidden';
    sample.style.pointerEvents = 'none';
    container.innerHTML = '';
    container.appendChild(sample);

    // Defer measurement until next frame to ensure styles applied
    requestAnimationFrame(() => {
      const tileH = Math.max(1, sample.getBoundingClientRect().height);
      // remove sample before real render
      container.removeChild(sample);

      const gap = 8; // matches rowGap above
      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const footerReserve = 12; // small breathing room
      const available = Math.max(0, Math.floor(viewportH - rect.top - footerReserve));

      const block = tileH + gap;
      let count = Math.floor((available + gap) / block); // +gap allows last tile to sit flush
      if (!Number.isFinite(count) || count < 1) count = 1;

      // Choose distinct ads up to count
      const pool = shuffle(inventory);
      const picks = [];
      for (let i=0; i<count; i++) picks.push(createAdLink(pool[i % pool.length]));

      container.innerHTML = '';
      batchAppend(container, picks);
    });
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

        // Use ALL available ads (no 4-cap). Duplicate set for seamless marquee.
        const set = shuffled.map(name => createAdLink(name));
        set.forEach(t => track.appendChild(t.cloneNode(true)));
        set.forEach(t => track.appendChild(t.cloneNode(true)));
        container.appendChild(track);

      } else {
        // Desktop-only stacked sidebar tiles to page bottom
        const render = () => populateSidebarStack(container, shuffled);
        render();

        // Recalculate on resize/desktop toggle
        const ro = new ResizeObserver(() => render());
        ro.observe(document.documentElement);
        window.matchMedia('(min-width:701px)').addEventListener('change', render);
      }
    });
  });
})();
