Here’s your **current `ads.js`** — the latest version with only one small addition: it now marks the rail as “live” after ads are added (to re-enable clicks).

```javascript
/* ads.js — OTI Ads Rail/Dock (updated for HOT AD / BOTTOM AD framing)
   - Reads ads-manifest.json (array of "*.jpg")
   - Builds a DESKTOP left rail with two fixed tiles:
       HOT AD (top) and BOTTOM AD (bottom)
     and a scrollable list BETWEEN them.
   - Builds a MOBILE bottom dock (horizontal scroller).
   - Tiles: image from "media/<file>.jpg", link to "./<slug>.html"
   - Hover-only red pill text: "Financial Patriotism"
   - Scroll damping at 0.3× for both rail (vertical) and dock (horizontal)
   - No CSS injection; structure only. Style via site style.css.
*/

(() => {
  const MANIFEST_PATH = 'ads-manifest.json';
  const IMG_BASE = 'media/';
  const LINK_BASE = './';

  const SELECTOR_RAIL = '#ads-rail'; // desktop left column
  const SELECTOR_DOCK = '#ads-dock'; // mobile bottom bar

  const SPEED = 0.3;
  const REDUCED_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

  const el = (tag, { class: cls, attrs, text, children } = {}) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (text != null) n.textContent = text;
    if (children) children.forEach(c => c && n.appendChild(c));
    return n;
  };

  const toSlug = (file) => file.replace(/\.jpg$/i, '');

  const buildTile = (file) => {
    const slug = toSlug(file);
    const href = `${LINK_BASE}${slug}.html`;
    const src = `${IMG_BASE}${file}`;

    const img = el('img', {
      class: 'ad-img',
      attrs: { src, loading: 'lazy', decoding: 'async', alt: '' }
    });

    const pill = el('span', { class: 'ad-pill', text: 'Financial Patriotism' });

    const link = el('a', {
      class: 'ad-tile',
      attrs: { href, 'aria-label': slug },
      children: [img, pill]
    });

    link.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.defaultPrevented) {
        e.preventDefault();
        link.click();
      }
    });

    return link;
  };

  const buildFixedTile = (label) => {
    const h = document.createElement('div');
    h.className = 'ad-fixed-label';
    h.textContent = label;
    const pill = document.createElement('span');
    pill.className = 'ad-pill';
    pill.textContent = 'Financial Patriotism';
    const frame = document.createElement('div');
    frame.className = 'ad-fixed';
    frame.appendChild(h);
    frame.appendChild(pill);
    return frame;
  };

  async function loadManifest(path) {
    const res = await fetch(path, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`ads.js: failed to load ${path} (${res.status})`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('ads.js: manifest must be an array of filenames');
    return data.filter(n => /\.jpg$/i.test(n));
  }

  function attachDamping(container, axis /* 'x' or 'y' */) {
    if (REDUCED_MOTION || !container) return;

    // Wheel
    container.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const raw = axis === 'x'
        ? (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY)
        : e.deltaY;
      const scaled = raw * 0.3;
      if (axis === 'x') container.scrollLeft += scaled;
      else container.scrollTop += scaled;
    }, { passive: false });

    // Touch/Pointer
    let active = false, startX = 0, startY = 0, baseLeft = 0, baseTop = 0;

    container.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        active = true;
        startX = e.clientX;
        startY = e.clientY;
        baseLeft = container.scrollLeft;
        baseTop = container.scrollTop;
        container.setPointerCapture?.(e.pointerId);
      }
    });

    container.addEventListener('pointermove', (e) => {
      if (!active) return;
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        e.preventDefault();
        const dx = (e.clientX - startX) * 0.3;
        const dy = (e.clientY - startY) * 0.3;
        if (axis === 'x') container.scrollLeft = baseLeft - dx;
        else container.scrollTop = baseTop - dy;
      }
    }, { passive: false });

    const stop = () => { active = false; };
    container.addEventListener('pointerup', stop);
    container.addEventListener('pointercancel', stop);

    // Keyboard nudge
    container.addEventListener('keydown', (e) => {
      if (e.defaultPrevented) return;
      let delta = 0;
      if (axis === 'x' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        delta = (e.key === 'ArrowRight' ? 80 : -80) * 0.3;
        e.preventDefault();
        container.scrollLeft += delta;
      } else if (axis === 'y' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        delta = (e.key === 'ArrowDown' ? 80 : -80) * 0.3;
        e.preventDefault();
        container.scrollTop += delta;
      }
    });
  }

  function mountDesktopRail(rail, files) {
    if (!rail) return;
    rail.innerHTML = '';

    const fixedTop = buildFixedTile('HOT AD');
    fixedTop.classList.add('ad-fixed-top');

    const fixedBottom = buildFixedTile('BOTTOM AD');
    fixedBottom.classList.add('ad-fixed-bottom');

    const scroller = el('div', {
      class: 'ad-scroll',
      attrs: { tabindex: '0', 'aria-label': 'Sponsored stories' }
    });

    const frag = document.createDocumentFragment();
    files.forEach(f => frag.appendChild(buildTile(f)));
    scroller.appendChild(frag);

    rail.appendChild(fixedTop);
    rail.appendChild(scroller);
    rail.appendChild(fixedBottom);

    attachDamping(scroller, 'y');

    // Minimal layout guarantees (non-invasive)
    rail.style.display = rail.style.display || 'flex';
    rail.style.flexDirection = rail.style.flexDirection || 'column';
    rail.style.background = rail.style.background || 'transparent';
    fixedTop.style.flex = '0 0 auto';
    fixedBottom.style.flex = '0 0 auto';
    scroller.style.flex = '1 1 auto';
    scroller.style.overflowY = scroller.style.overflowY || 'auto';
    scroller.style.overflowX = 'hidden';
    scroller.style.background = 'transparent';

    // ✅ New line: mark rail as live once ads exist
    rail?.setAttribute('data-live', '1');
  }

  function mountMobileDock(dock, files) {
    if (!dock) return;
    dock.innerHTML = '';

    const track = el('div', { class: 'ad-track', attrs: { tabindex: '0', 'aria-label': 'Sponsored stories' } });

    const frag = document.createDocumentFragment();
    files.forEach(f => frag.appendChild(buildTile(f)));
    track.appendChild(frag);

    dock.appendChild(track);

    attachDamping(track, 'x');

    // Minimal layout guarantees (non-invasive)
    dock.style.background = 'transparent';
    dock.style.overflow = 'hidden';
    track.style.display = 'flex';
    track.style.flexWrap = 'nowrap';
    track.style.overflowX = 'auto';
    track.style.overflowY = 'hidden';
    track.style.background = 'transparent';
  }

  async function init() {
    const rail = document.querySelector(SELECTOR_RAIL);
    const dock = document.querySelector(SELECTOR_DOCK);
    if (!rail && !dock) return;

    let files = [];
    try {
      files = await loadManifest(MANIFEST_PATH);
    } catch (err) {
      console.error(err);
      return;
    }

    if (rail) mountDesktopRail(rail, files);
    if (dock) mountMobileDock(dock, files);

    window.OTIAds = {
      refresh: async () => {
        const fresh = await loadManifest(MANIFEST_PATH);
        if (rail) mountDesktopRail(rail, fresh);
        if (dock) mountMobileDock(dock, fresh);
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
```
