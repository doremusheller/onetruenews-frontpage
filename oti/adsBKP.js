/* ============================================================
   ads.js — One True Infotainment
   v4.5 (JPG-only • correct links • scrollable left rail • img guard)
   ============================================================ */
(function () {
  const VERSION = '4.5';
  window.OTI_ADS_VERSION = VERSION;

  const isMobile = () => matchMedia('(max-width:700px)').matches;

  function normalizeList(list) {
    const seen = new Set(), out = [];
    for (const n of list || []) {
      const name = String(n).trim();
      if (!/\.jpg$/i.test(name)) continue;     // JPG only
      if (seen.has(name)) continue;
      seen.add(name);
      out.push(name);
    }
    return out;
  }

  function pageHrefFor(imageName) {
    const justName = imageName.split('/').pop();
    const base = justName.replace(/\.jpg$/i, ''); // keep -AD
    return `./${base}.html`;
  }

  function imageSrcFor(name) {
    if (/^https?:\/\//i.test(name) || name.startsWith('/') || /^media\//i.test(name)) return name;
    return `media/${name}`;
  }

  // required ads (prepended)
  const REQUIRED_ADS = normalizeList([
    'OTI-premium-AD.jpg',
    'primate-guidelines-AD.jpg',
    'cover-AD.jpg',
    'golden-streets-AD.jpg'
  ]);

  function ensureRequiredFirst(list) {
    const have = new Set(list);
    const out = [...REQUIRED_ADS.filter(n => !have.has(n)), ...list];
    return out;
    // result = required first, then everything else de-duped
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
    // make images fit the gutter and avoid truncation
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';

    // if an image fails (e.g., file missing), drop the tile
    img.onerror = () => tile.remove();

    const tile = document.createElement('div');
    tile.className = 'ad-tile';
    tile.style.display = 'block';  // ensure block stacking
    a.append(pill, img);
    tile.appendChild(a);
    return tile;
  }

  function empty(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

  // ------- rendering -------
  function renderDesktop(ads) {
    const left = document.querySelector('.ad-container-left');
    const bottom = document.querySelector('.ad-row');
    if (bottom) bottom.style.display = 'none';
    if (!left) return;

    // vertical stack, viewport-limited height with scroll
    left.style.display = 'flex';
    left.style.flexDirection = 'column';
    left.style.alignItems = 'stretch';
    left.style.gap = '8px';
    left.style.maxHeight = 'calc(100vh - 16px)';
    left.style.overflowY = 'auto';
    left.style.overflowX = 'hidden';

    empty(left);
    // render ALL ads; scroll will handle overflow
    ads.forEach(n => left.appendChild(createTile(n)));
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
      if (res.ok) cleaned = normalizeList(await res.json());
    } catch (e) {}

    if (!cleaned.length) {
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
    return ensureRequiredFirst(cleaned);
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
