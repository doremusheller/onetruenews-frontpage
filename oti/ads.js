✅ **Delilah:** Ready.
Here is the optimized **ads.js** (v4.6).

```javascript
/* ============================================================
   ads.js — One True Infotainment
   v4.6 (aligned with style v147 and index v147)
   ============================================================ */
(function () {
  const VERSION = '4.6';
  window.OTI_ADS_VERSION = VERSION;

  const isMobile = () => matchMedia('(max-width:700px)').matches;

  function normalizeList(list) {
    const seen = new Set(), out = [];
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
    const justName = imageName.split('/').pop();
    const base = justName.replace(/\.jpg$/i, '');
    return `./${base}.html`;
  }

  function imageSrcFor(name) {
    if (/^(https?:\/\/|\/|media\/)/i.test(name)) return name;
    return `media/${name}`;
  }

  const REQUIRED_ADS = normalizeList([
    'OTI-premium-AD.jpg',
    'primate-guidelines-AD.jpg',
    'cover-AD.jpg',
    'golden-streets-AD.jpg'
  ]);

  function ensureRequiredFirst(list) {
    const have = new Set(list);
    return [...REQUIRED_ADS.filter(n => !have.has(n)), ...list];
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
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';

    const tile = document.createElement('div');
    tile.className = 'ad-tile';
    a.append(pill, img);
    tile.appendChild(a);

    img.onerror = () => tile.remove();
    return tile;
  }

  function empty(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

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

  function renderDesktop(ads) {
    const left = document.querySelector('.ad-container-left');
    const bottom = document.querySelector('.ad-row');
    if (bottom) bottom.style.display = 'none';
    if (!left) return;

    empty(left);
    left.style.display = 'flex';
    left.style.flexDirection = 'column';
    left.style.alignItems = 'stretch';
    left.style.gap = '8px';
    left.style.overflowY = 'auto';
    left.style.overflowX = 'hidden';
    left.style.maxHeight = 'calc(100vh - var(--ticker-h) - 12px)';

    ads.forEach(n => left.appendChild(createTile(n)));
  }

  function renderMobile(ads) {
    const bottom = document.querySelector('.ad-row');
    const left = document.querySelector('.ad-container-left');
    if (left) left.style.display = 'none';
    if (!bottom) return;

    empty(bottom);
    bottom.style.display = 'flex';
    bottom.style.flexDirection = 'column';
    bottom.style.alignItems = 'stretch';
    bottom.style.gap = '12px';
    ads.forEach(n => bottom.appendChild(createTile(n)));
  }

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
```
