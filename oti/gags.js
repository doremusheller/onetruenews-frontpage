/* ============================================================
   OTI gags.js — Seamless Fixed Window + Interactive Autoscroll
   - Users can drag/scroll with finger, wheel, or pointer
   - Dock stays fixed; tiles loop smoothly inside
   - Autoscroll targets a ~100s cycle, pauses on interaction
   ============================================================ */
(function () {
  try {
    // Prevent double-runs
    if (window.__OTI_GAGS_INIT__ === 'done') return;

    // Only operate on the dock. If it's missing, do nothing.
    const host = document.getElementById('gags-dock');
    if (!host || host.tagName !== 'NAV') {
      window.__OTI_GAGS_INIT__ = 'done';
      return;
    }
    window.__OTI_GAGS_INIT__ = 'done';

    // Read manifest or fall back
    const list =
      (Array.isArray(window.OTI_GAGS_MANIFEST) && window.OTI_GAGS_MANIFEST.length
        ? window.OTI_GAGS_MANIFEST.slice()
        : [
            "Angels-GAG.jpg",
            "sauls-litters-GAG.jpg",
            "patriot-beer-GAG.jpg",
            "patriot-games-GAG.jpg",
            "gold-card-GAG.jpg",
            "you-GAG-here.jpg",
            "blacks-love-grundy-GAG.jpg",
            "OTI-premium-GAG.jpg",
            "grundymax-GAG.jpg",
            "golden-streets-GAG.jpg",
            "cover-GAG.jpg",
            "jesus-merch-GAG.jpg",
            "primate-guidelines-GAG.jpg",
            "grundy-glow-GAG.jpg",
            "faithlynn-GAG.jpg"
          ]);

    // Helper to build a single track of tiles
    const buildTrack = () => {
      const track = document.createElement('div');
      track.className = 'gag-track';

      list.forEach(fn => {
        const base = fn.replace(/\.[^.]+$/, "");
        const a = document.createElement('a');
        a.className = 'gag-tile';
        a.href = base + ".html";
        a.rel = 'nofollow';
        a.setAttribute('aria-label', base);

        const img = document.createElement('img');
        img.className = 'gag-img';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.alt = base.replace(/[-_]/g, ' ');
        img.src = "media/" + fn;
        img.addEventListener('error', () => { img.style.visibility = 'hidden'; });

        a.appendChild(img);
        track.appendChild(a);
      });

      return track;
    };

    // === Build DOM structure ===
    // <nav id="gags-dock">
    //   <div class="gag-mask">
    //     <div class="gag-reel">
    //       <div class="gag-track">…(tiles)…</div>
    //       <div class="gag-track">…(tiles)…</div>
    //     </div>
    //   </div>
    // </nav>
    const mask = document.createElement('div');
    mask.className = 'gag-mask';

    const reel = document.createElement('div');
    reel.className = 'gag-reel';

    const track1 = buildTrack();
    const track2 = buildTrack();

    reel.appendChild(track1);
    reel.appendChild(track2);
    mask.appendChild(reel);

    host.textContent = '';
    host.appendChild(mask);

    // === INTERACTIVE AUTOSCROLL CONTROLLER ====================
    // Make the viewport natively scrollable (finger/wheel drag),
    // and run a gentle JS autoscroll that loops seamlessly.
    // We also disable any CSS animation set on .gag-reel to avoid conflicts.
    reel.style.animation = 'none';

    // Ensure native horizontal scroll on the mask (CSS fallback guard)
    mask.style.overflowX = 'auto';
    mask.style.overflowY = 'hidden';
    mask.style.webkitOverflowScrolling = 'touch';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = null;
    let paused = false;
    let resumeTimer = null;
    let pxPerFrame = 0.5; // will be recalculated to target ~100s per loop
    let wrapWidth = 0;

    const getGap = () => {
      const g = getComputedStyle(reel).gap;
      const n = parseFloat(g);
      return Number.isFinite(n) ? n : 0;
    };

    const measure = () => {
      // Width of a single track + the inter-track gap
      const gap = getGap();
      // Use scrollWidth for full content width; fallback to offsetWidth
      const w1 = track1.scrollWidth || track1.offsetWidth || 0;
      wrapWidth = w1 + gap;

      // Target duration ~100s per full cycle
      if (wrapWidth > 0) {
        const targetSeconds = 100;
        const framesPerSecond = 60;
        pxPerFrame = wrapWidth / (targetSeconds * framesPerSecond);
      }
    };

    // Recalculate when images load, and on resize
    const imgs = reel.querySelectorAll('img');
    imgs.forEach(img => img.addEventListener('load', measure, { once: true }));
    window.addEventListener('resize', () => {
      measure();
      // Keep scroll position within new bounds
      if (wrapWidth && mask.scrollLeft >= wrapWidth) {
        mask.scrollLeft = mask.scrollLeft % wrapWidth;
      }
    });

    // Initial measure (may be refined as images load)
    measure();

    // Autoscroll loop
    const tick = () => {
      if (!paused && !prefersReduced && wrapWidth > 0) {
        mask.scrollLeft += pxPerFrame;
        if (mask.scrollLeft >= wrapWidth) {
          mask.scrollLeft -= wrapWidth; // seamless wrap
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    // Pause on any user interaction; resume after quiet period
    const pauseAndResumeSoon = () => {
      paused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, 2000);
    };

    ['pointerdown','touchstart','wheel'].forEach(evt =>
      mask.addEventListener(evt, pauseAndResumeSoon, { passive: true })
    );

    if (!prefersReduced) {
      rafId = requestAnimationFrame(tick);
    }

  } catch (e) {
    // Fail-safe: mark done and silently stop
    window.__OTI_GAGS_INIT__ = 'done';
  }
})();
