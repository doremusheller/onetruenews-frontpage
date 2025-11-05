/* ============================================================
   ads.js — One True Infotainment
   v4.1 (desktop: left rail only • mobile: bottom stack)
   ============================================================ */
(function () {
  const VERSION = '4.1';
  window.OTI_ADS_VERSION = VERSION;

  // ------- helpers -------
  const isMobile = () => matchMedia('(max-width:700px)').matches;

  function normalizeList(list) {
    // keep only .jpg/.png that look like ads
    const seen = new Set();
    return list
      .filter(n => /\.(jpg|png)$/i.test(n))
      .filter(n => /-?AD\.(jpg|png)$/i.test(n))
      .map(n => n.trim())
      .filter(n => (seen.has(n) ? false : seen.add(n)));
  }

  function pageHrefFor(imageName) {
    // turn "patriot-beer-AD.jpg" -> "./patriot-beer.html"
    const justName = imageName.split('/').pop();               // drop any folder prefix
    const base = justName.replace(/\.(jpg|png)$/i, '')         // remove extension
                         .replace(/-AD$/i, '');                 // drop "-AD" suffix if present
    return `./${base}.html`;
  }

  function imageSrcFor(name) {
    // accept absolute URLs, root-relative, or items already under "media/"
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

  // ------- rendering -------
  function renderDesktop(ads) {
    // left rail only; hide any bottom row if present
    const left = document.querySelector('.ad-container-left');
    const bottom = document.querySelector('.ad-row');

    if (bottom) bottom.style.display = 'none';
    if (!left) return;

    // ensure vertical stack in the narrow gutter, without touching site CSS files
    left.style.display = 'flex';
    left.style.flexDirection = 'column';
    left.style.alignItems = 'stretch';
    left.style.gap = '8px';

    empty(left);
    // a tidy set in the gutter — keep it focused
    ads.slice(0, 6).forEach(n => left.appendChild(createTile(n)));
  }

  function renderMobile(ads) {
    // bottom stack only; no left rail on mobile
    const bottom = document.querySelector('.ad-row');
    const left = document.querySelector('.ad-container-left');

    if (left) left.style.display = 'none';
    if (!bottom) return;

    // make it a simple vertical list at the very bottom
    bottom.style.display = 'flex';
    bottom.style.flexDirection = 'column';
    bottom.style.alignItems = 'stretch';
    bottom.style.gap = '12px';
    bottom.style.overflowX = 'visible';

    // kill any old scroller track if it exists
    empty(bottom);

    ads.forEach(n => bottom.appendChild(createTile(n)));
  }

  // ------- data -------
  async function getAds() {
    try {
      const res = await fetch('media/ads-manifest.json', { cache: 'no-store' });
      if (res.ok) {
        const list = await res.json();
        const cleaned = normalizeList(list);
        if (cleaned.length) return cleaned;
      }
    } catch (e) {}
    // fallback
    return normalizeList([
      'Angels-AD.jpg',
      'patriot-beer-AD.jpg',
      'patriot-games-AD.jpg',
      'you-AD-here.jpg',
      'blacks-love-grundy-AD.jpg',
      'OTI-premium-AD.jpg',
      'grundymax-AD.jpg',
      'golden-streets-AD.jpg',
      'cover-AD.png',
      'primate-guidelines-AD.jpg'
    ]);
  }

  // ------- boot -------
  let lastMode = null; // 'mobile' | 'desktop'

  async function boot() {
    const ads = await getAds();
    if (!ads.length) return;

    const mode = isMobile() ? 'mobile' : 'desktop';
    if (mode === lastMode) return; // avoid redundant re-renders
    lastMode = mode;

    if (mode === 'desktop') renderDesktop(ads);
    else renderMobile(ads);
  }

  document.addEventListener('DOMContentLoaded', boot);
  // Optional responsiveness if the user resizes the window
  window.addEventListener('resize', () => {
    // basic debounce
    clearTimeout(window.__oti_ads_rs__);
    window.__oti_ads_rs__ = setTimeout(boot, 120);
  });
})();
