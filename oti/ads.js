/* ============================================================
   ads.js — One True Infotainment (SIMPLE)
   v6.0: zero special-cases, zero async, deterministic links
   ============================================================ */
(function () {
  const VERSION = '6.0';
  window.OTI_ADS_VERSION = VERSION;

  // Minimal fallback inventory (only used if no window.OTI_ADS and no manifest)
  const LEGACY = [
    "Angels-AD.jpg",
    "patriot-beer-AD.jpg",
    "patriot-games-AD.jpg",
    "primate-guidelines-AD.jpg",
    "grundymax-AD.jpg",
    "blacks-love-grundy-AD.jpg",
    "OTI-premium-AD.jpg",
    "cover-AD.png"
  ];

  // ---- Core helpers --------------------------------------------------------
  function toHtmlHref(name) {
    // derive ./<basename>.html, lowercased for the page only
    const base = String(name).split('/').pop();
    const html = base.replace(/\.(png|jpg)$/i, '.html').toLowerCase();
    return './' + html;
  }

  function filterAdImages(list) {
    return (list || []).filter(n => /AD\.(png|jpg)$/i.test(n));
  }

  async function discoverInventory() {
    if (Array.isArray(window.OTI_ADS)) return filterAdImages(window.OTI_ADS);
    try {
      const res = await fetch('media/ads-manifest.json', { cache: 'no-store' });
      if (res.ok) {
        const arr = await res.json();
        const ads = filterAdImages(arr);
        if (ads.length) return ads;
      }
    } catch (_) { /* optional manifest */ }
    return filterAdImages(LEGACY);
  }

  function createAdLink(name) {
    const a = document.createElement('a');
    a.className = 'ad-link';
    a.href = toHtmlHref(name);            // single, deterministic assignment

    const pill = document.createElement('span');
    pill.className = 'ad-pill';
    pill.textContent = 'Financial Patriotism';

    const img = document.createElement('img');
    img.src = `media/${name}`;            // use exact case for the IMAGE
    img.alt = 'Promotional image';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;

    a.append(pill, img);

    const tile = document.createElement('div');
    tile.className = 'ad-tile';
    tile.dataset.name = name;
    tile.appendChild(a);
    return tile;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function batchAppend(parent, nodes) {
    const frag = document.createDocumentFragment();
    nodes.forEach(n => frag.appendChild(n));
    parent.appendChild(frag);
  }

  function populateSidebar(container, inventory) {
    if (!window.matchMedia('(min-width:701px)').matches) { container.innerHTML = ''; return; }
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
      const picks = shuffle(inventory).slice(0, slots).map(createAdLink);

      container.innerHTML = '';
      batchAppend(container, picks);
    });
  }

  // ---- Boot ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', async () => {
    const targets = [...document.querySelectorAll('.ad-container-left, .ad-row')];
    if (!targets.length) return;

    const inventory = await discoverInventory();
    if (!inventory.length) return;

    const ads = shuffle(inventory).map(createAdLink);

    targets.forEach(container => {
      container.innerHTML = '';
      const isRow = container.classList.contains('ad-row');
      if (isRow) {
        const track = document.createElement('div');
        track.className = 'track';
        // duplicate for seamless scroll
        ads.forEach(t => track.appendChild(t.cloneNode(true)));
        ads.forEach(t => track.appendChild(t.cloneNode(true)));
        container.appendChild(track);
      } else {
        const render = () => populateSidebar(container, inventory);
        const debounced = (fn => { let t; return () => { clearTimeout(t); t = setTimeout(fn, 120); }; })(render);
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
})();
