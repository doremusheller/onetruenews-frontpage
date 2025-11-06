/* ============================================================
   ads.js — One True Infotainment
   v4.4 (JPG-only • correct links • required ads)
   ============================================================ */
(function () {
  const VERSION = '4.4';
  window.OTI_ADS_VERSION = VERSION;

  // ------- helpers -------
  const isMobile = () => matchMedia('(max-width:700px)').matches;

  function normalizeList(list) {
    // JPGs only; trim & de-dupe; keep original order for manifest-provided items
    const seen = new Set();
    const out = [];
    for (const n of list || []) {
      const name = String(n).trim();
      if (!/\.jpg$/i.test(name)) continue;
      if (seen.has(name)) continue;
      seen.add(name);
      out.push(name);
    }
    return out;
  }

  function pageHrefFor(imageName) {
    // "patriot-beer-AD.jpg" -> "./patriot-beer-AD.html"
    const justName = imageName.split('/').pop();
    const base = justName.replace(/\.jpg$/i, '');
    return `./${base}.html`;
  }

  function imageSrcFor(name) {
    // accept absolute, root-relative, or items already under "media/"
    if (/^https?:\/\//i.test(name) || name.startsWith('/') || /^media\//i.test(name)) {
      return name;
    }
    return `media/${name}`;
  }

  function createTile(name) {
    const a = document.createElement('a');
    a.className = 'ad-link';
    a.href = pageHrefFor(name);

    const pill = document.createElement('span');
    pill.className = 'ad-pill';
    pill.textContent = 'Financial Patriotism';

    const img = document.createElement('img');
    img.src = imageSrcFor(name);
    img.alt = 'Promotional image';
    img.loading = 'lazy';
    img.decoding = 'async';

    const tile = document.createElement('div');
    tile.className = 'ad-tile';
    a.append(pill, img);
    tile.appendChild(a);
    return tile;
  }

  function empty(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

  // ------- ensure required ads -------
  const REQUIRED_ADS = normalizeList([
    'OTI-premium-AD.jpg',
    'primate-guidelines-AD.jpg',
    'cover-AD.jpg',
    'golden-streets-AD.jpg'
  ]);

  function ensureRequiredAds(list) {
    const set = new Set(list);
    for (const req of REQUIRED_ADS) {
      if (!set.has(req)) {
        set.add(req);
        list.push(req); // append any missing required items
      }
    }
    return list;
  }

  // ------- rendering -------
  function renderDesktop(ads) {
    const left = document.querySelector('.ad-container-left');
    const bottom = document.querySelector('.ad-row');
    if (bottom) bottom.style.display = 'none';
    if (!left) return;

    left.style.display = 'flex';
    left.style.flexDirection = 'column';
    left.style.alignItems = 'stretch';
    left.style.gap = '8px';

    empty(left);
    ads.slice(0, 6).forEach(n => left.appendChild(createTile(n)));
  }

  function renderMobile(ads) {
    const bottom = document.querySelector('.ad-row');
    const left = document.querySelector('.ad-container-left');
    if (left) left.style.display = 'none';
    if (!bottom) return;

    bottom.style.display = 'flex';
    bottom.style.flexDirection = 'column';
    bottom.style.alignItems = 'stretch';
    bottom.style.gap = '12px';
    bottom.style.overflowX = 'visible';

    empty(bottom);
    ads.forEach(n => bottom.appendChild(createTile(n)));
  }

  // ------- data -------
  async function getAds() {
    let cleaned = [];
    try {
      const res = await fetch('media/ads-manifest.json', { cache: 'no-store' });
      if (res.ok) {
        const list = await res.json();
        cleaned = normalizeList(list);
      }
    } catch (e) {}

    if (!cleaned.length) {
      // JPG-only fallback; safe defaults
      cleaned = normalizeList([
        'Angels-AD.jpg',
        'patriot-beer-AD.jpg',
        'patriot-games-AD.jpg',
        'you-AD-here.jpg',
        'blacks-love-grundy-AD.jpg',
        'OTI-premium-AD.jpg',
        'grundymax-AD.jpg',
        'golden-streets-AD.jpg',
        'cover-AD.jpg',
        'primate-guidelines-AD.jpg'
      ]);
    }

    // Always make sure required items are present
    return ensureRequiredAds(cleaned);
  }

  // ------- boot -------
  let lastMode = null;
  async function boot() {
    const ads = await getAds();
    if (!ads.length) return;

    const mode = isMobile() ? 'mobile' : 'desktop';
    if (mode === lastMode) return;
    lastMode = mode;

    if (mode === 'desktop') renderDesktop(ads);
    else renderMobile(ads);
  }

  document.addEventListener('DOMContentLoaded', boot);
  window.addEventListener('resize', () => {
    clearTimeout(window.__oti_ads_rs__);
    window.__oti_ads_rs__ = setTimeout(boot, 120);
  });
})();
