/* ============================================================
   ads.js — One True Infotainment
   v4.4: desktop sidebar unique tiles + page-synced height (no CSS edits)
   - Left sidebar shows each AD exactly once (no duplicates)
   - Sidebar height clamps to page bottom & viewport, never extends page
   - Recalculates on resize, grid mutations, and breakpoint changes
   - Ad row remains full inventory with seamless track
   ============================================================ */

(function(){
  const PAGE_MAP = {
    "grundymax-ad.png": "grundymax-ad.html",
    "grundymax-AD.png": "grundymax-ad.html" // case-insensitive support
  };

  const LEGACY_INVENTORY = [
    "Angels-AD.png",
    "patriot-beer-AD.png",
    "patriot-games-AD.png",/* ============================================================
   ads.js — One True Infotainment
   v4.4: desktop sidebar unique tiles + page-synced height (no CSS edits)
   - Left sidebar shows each AD exactly once (no duplicates)
   - Sidebar height clamps to page bottom & viewport, never extends page
   - Recalculates on resize, grid mutations, and breakpoint changes
   - Ad row remains full inventory with seamless track
   ============================================================ */

(function(){
  const PAGE_MAP = {
    "grundymax-ad.png": "grundymax-ad.html",
    "grundymax-AD.png": "grundymax-ad.html" // case-insensitive support
  };

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
    tile.dataset.name = name; // for diffing
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

  function namesIn(container){
    return Array.from(container.querySelectorAll('.ad-tile')).map(t => t.dataset.name);
  }

  function uniquePick(list, count){
    const slice = list.slice(0, Math.max(0, Math.min(count, list.length)));
    return slice;
  }

  // Sidebar stack synced to page height, no duplicates
  function populateSidebarStack(container, inventory){
    if (!isDesktop()) { container.innerHTML = ''; return; }

    // Inline styles (no stylesheet edits)
    container.style.display = 'grid';
    container.style.gridAutoRows = 'auto';
    container.style.rowGap = '8px';
    container.style.overflow = 'hidden';

    // Create a temporary sample tile for accurate measurement
    const sample = createAdLink(inventory[0]);
    sample.style.visibility = 'hidden';
    sample.style.pointerEvents = 'none';
    container.innerHTML = '';
    container.appendChild(sample);

    requestAnimationFrame(() => {
      const tileH = Math.max(1, sample.getBoundingClientRect().height);
      const gap = 8; // matches rowGap

      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;

      // Sync to page bottom: use the .page container as boundary if present
      const page = document.querySelector('.page');
      const pageRect = page ? page.getBoundingClientRect() : { bottom: viewportH };

      const footerReserve = 12;
      const limitByViewport = Math.max(0, Math.floor(viewportH - rect.top - footerReserve));
      const limitByPage = Math.max(0, Math.floor(pageRect.bottom - rect.top - footerReserve));
      const maxHeight = Math.min(limitByViewport, limitByPage);

      container.style.maxHeight = maxHeight + 'px';

      const block = tileH + gap;
      let slots = Math.floor((maxHeight + gap) / block);
      if (!Number.isFinite(slots) || slots < 1) slots = 1;

      const picks = uniquePick(shuffle(inventory), slots).map(createAdLink);

      // Diff against current content to avoid unnecessary rerenders
      const current = namesIn(container).join(',');
      const next = picks.map(t => t.dataset.name).join(',');
      if (current === next) { container.removeChild(sample); return; }

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
        const set = shuffled.map(name => createAdLink(name));
        set.forEach(t => track.appendChild(t.cloneNode(true)));
        set.forEach(t => track.appendChild(t.cloneNode(true)));
        container.appendChild(track);
      } else {
        const render = () => populateSidebarStack(container, shuffled);
        const debounced = debounce(render, 120);
        render();

        // Observe size and grid mutations to keep in sync with index height
        const ro = new ResizeObserver(() => debounced());
        ro.observe(document.documentElement);

        const grid = document.getElementById('storyGrid');
        if (grid) {
          const mo = new MutationObserver(() => debounced());
          mo.observe(grid, { childList: true, subtree: false });
        }

        window.matchMedia('(min-width:701px)').addEventListener('change', () => debounced());
      }
    });
  });

  function debounce(fn, ms){
    let t; return function(){ clearTimeout(t); t = setTimeout(fn, ms); };
  }
})();

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
    tile.dataset.name = name; // for diffing
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

  function namesIn(container){
    return Array.from(container.querySelectorAll('.ad-tile')).map(t => t.dataset.name);
  }

  function uniquePick(list, count){
    const slice = list.slice(0, Math.max(0, Math.min(count, list.length)));
    return slice;
  }

  // Sidebar stack synced to page height, no duplicates
  function populateSidebarStack(container, inventory){
    if (!isDesktop()) { container.innerHTML = ''; return; }

    // Inline styles (no stylesheet edits)
    container.style.display = 'grid';
    container.style.gridAutoRows = 'auto';
    container.style.rowGap = '8px';
    container.style.overflow = 'hidden';

    // Create a temporary sample tile for accurate measurement
    const sample = createAdLink(inventory[0]);
    sample.style.visibility = 'hidden';
    sample.style.pointerEvents = 'none';
    container.innerHTML = '';
    container.appendChild(sample);

    requestAnimationFrame(() => {
      const tileH = Math.max(1, sample.getBoundingClientRect().height);
      const gap = 8; // matches rowGap

      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;

      // Sync to page bottom: use the .page container as boundary if present
      const page = document.querySelector('.page');
      const pageRect = page ? page.getBoundingClientRect() : { bottom: viewportH };

      const footerReserve = 12;
      const limitByViewport = Math.max(0, Math.floor(viewportH - rect.top - footerReserve));
      const limitByPage = Math.max(0, Math.floor(pageRect.bottom - rect.top - footerReserve));
      const maxHeight = Math.min(limitByViewport, limitByPage);

      container.style.maxHeight = maxHeight + 'px';

      const block = tileH + gap;
      let slots = Math.floor((maxHeight + gap) / block);
      if (!Number.isFinite(slots) || slots < 1) slots = 1;

      const picks = uniquePick(shuffle(inventory), slots).map(createAdLink);

      // Diff against current content to avoid unnecessary rerenders
      const current = namesIn(container).join(',');
      const next = picks.map(t => t.dataset.name).join(',');
      if (current === next) { container.removeChild(sample); return; }

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
        const set = shuffled.map(name => createAdLink(name));
        set.forEach(t => track.appendChild(t.cloneNode(true)));
        set.forEach(t => track.appendChild(t.cloneNode(true)));
        container.appendChild(track);
      } else {
        const render = () => populateSidebarStack(container, shuffled);
        const debounced = debounce(render, 120);
        render();

        // Observe size and grid mutations to keep in sync with index height
        const ro = new ResizeObserver(() => debounced());
        ro.observe(document.documentElement);

        const grid = document.getElementById('storyGrid');
        if (grid) {
          const mo = new MutationObserver(() => debounced());
          mo.observe(grid, { childList: true, subtree: false });
        }

        window.matchMedia('(min-width:701px)').addEventListener('change', () => debounced());
      }
    });
  });

  function debounce(fn, ms){
    let t; return function(){ clearTimeout(t); t = setTimeout(fn, ms); };
  }
})();
