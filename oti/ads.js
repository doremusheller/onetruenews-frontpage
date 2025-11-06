/* ads.js — OTI Ads Rail/Dock
   Requirements captured:
   - Read ads-manifest.json (array of "*.jpg")
   - For each image, make a story tile:
       • IMG src="media/<file>.jpg" (relative)
       • LINK href="./<slug>.html"    (flat link)
       • Hover-only pill: "Financial Patriotism" (DOM present; CSS controls visibility)
   - Desktop: vertical left column scroller with transparent background; scroll damped to 0.3×
   - Mobile: horizontal bottom scroller with transparent background; scroll damped to 0.3×
   - No uninvited DOM beyond mounting into existing #ads-rail and/or #ads-dock
*/

(() => {
  const MANIFEST_PATH = 'ads-manifest.json';
  const IMG_BASE = 'media/';
  const LINK_BASE = './'; // flat links at the root

  const SELECTOR_RAIL = '#ads-rail'; // vertical (desktop, left)
  const SELECTOR_DOCK = '#ads-dock'; // horizontal (mobile, bottom)

  const SPEED = 0.3; // 30% speed
  const REDUCED_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

  // Utility: create an element with classes/attrs
  function el(tag, opts = {}) {
    const node = document.createElement(tag);
    if (opts.class) node.className = opts.class;
    if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
    if (opts.text != null) node.textContent = opts.text;
    if (opts.children) opts.children.forEach(c => c && node.appendChild(c));
    return node;
  }

  function filenameToSlug(file) {
    // "grundy-glow-AD.jpg" => "grundy-glow-AD"
    return file.replace(/\.jpg$/i, '');
  }

  function buildTile(file) {
    const slug = filenameToSlug(file);
    const href = `${LINK_BASE}${slug}.html`;
    const src = `${IMG_BASE}${file}`;

    const img = el('img', {
      class: 'ad-img',
      attrs: {
        src,
        loading: 'lazy',
        decoding: 'async',
        alt: '' // decorative by default; consider aria-label on the link
      }
    });

    const pill = el('span', {
      class: 'ad-pill',
      text: 'Financial Patriotism'
    });

    const link = el('a', {
      class: 'ad-tile',
      attrs: {
        href,
        'aria-label': slug // simple label; you can override via CSS-generated content if needed
      },
      children: [img, pill]
    });

    // Keyboard focus should reveal the pill via :focus-within (CSS).
    link.addEventListener('keydown', (e) => {
      // Enter/Space to activate
      if ((e.key === 'Enter' || e.key === ' ') && !e.defaultPrevented) {
        e.preventDefault();
        link.click();
      }
    });

    return link;
  }

  async function loadManifest(path) {
    const res = await fetch(path, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`ads.js: failed to load ${path} (${res.status})`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('ads.js: manifest must be an array of filenames');
    // filter to *.jpg only, preserve order
    return data.filter(name => /\.jpg$/i.test(name));
  }

  function mountTiles(container, files) {
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (const file of files) frag.appendChild(buildTile(file));
    container.appendChild(frag);

    // Make the container keyboard-focusable for arrow scrolling; CSS can override outline.
    if (!container.hasAttribute('tabindex')) container.tabIndex = 0;

    // Attach scroll damping only if motion is not reduced
    if (!REDUCED_MOTION) {
      const isHorizontal = getComputedStyle(container).overflowX === 'auto' || container.dataset.axis === 'x';

      // Wheel damping
      container.addEventListener('wheel', (e) => {
        // allow native zoom with ctrl/cmd
        if (e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        const delta = isHorizontal ? (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) : e.deltaY;
        const scaled = delta * SPEED;

        if (isHorizontal) {
          container.scrollLeft += scaled;
        } else {
          container.scrollTop += scaled;
        }
      }, { passive: false });

      // Touch/Pointer damping (mobile)
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
          const dx = (e.clientX - startX) * SPEED;
          const dy = (e.clientY - startY) * SPEED;

          if (isHorizontal) {
            container.scrollLeft = baseLeft - dx;
          } else {
            container.scrollTop = baseTop - dy;
          }
        }
      }, { passive: false });

      container.addEventListener('pointerup', () => { active = false; });
      container.addEventListener('pointercancel', () => { active = false; });

      // Keyboard nudge
      container.addEventListener('keydown', (e) => {
        if (e.defaultPrevented) return;
        const H = isHorizontal;
        const key = e.key;
        let delta = 0;

        if (H && (key === 'ArrowRight' || key === 'ArrowLeft')) {
          delta = (key === 'ArrowRight' ? 80 : -80) * SPEED;
          e.preventDefault();
          container.scrollLeft += delta;
        } else if (!H && (key === 'ArrowDown' || key === 'ArrowUp')) {
          delta = (key === 'ArrowDown' ? 80 : -80) * SPEED;
          e.preventDefault();
          container.scrollTop += delta;
        }
      });
    }
  }

  function whichAxis(container, fallbackAxis = 'y') {
    // Allow opting-in via data-axis, else infer from CSS overflow directions.
    if (container?.dataset?.axis) return container.dataset.axis;
    const cs = container ? getComputedStyle(container) : null;
    if (!cs) return fallbackAxis;
    if ((cs.overflowX === 'auto' || cs.overflowX === 'scroll') &&
        (cs.overflowY !== 'auto' && cs.overflowY !== 'scroll')) return 'x';
    return 'y';
  }

  function flagAxis(container) {
    if (!container) return;
    const axis = whichAxis(container);
    container.dataset.axis = axis;
  }

  async function init() {
    const rail = document.querySelector(SELECTOR_RAIL);
    const dock = document.querySelector(SELECTOR_DOCK);

    // If neither mount exists, do nothing (no uninvited DOM work)
    if (!rail && !dock) return;

    flagAxis(rail);
    flagAxis(dock);

    let files = [];
    try {
      files = await loadManifest(MANIFEST_PATH);
    } catch (err) {
      console.error(err);
      return;
    }

    // Render into whichever containers exist. CSS decides which is visible per viewport.
    if (rail) mountTiles(rail, files);
    if (dock) mountTiles(dock, files);

    // Expose a tiny API for later tweaks
    window.OTIAds = {
      refresh: async () => {
        // Clear and re-render (e.g., if manifest changes)
        if (rail) rail.innerHTML = '';
        if (dock) dock.innerHTML = '';
        const fresh = await loadManifest(MANIFEST_PATH);
        if (rail) mountTiles(rail, fresh);
        if (dock) mountTiles(dock, fresh);
      }
    };
  }

  // Kickoff after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
