/* ============================================================
   OTI gags.js — Seamless, Fixed Window, Continuous GAG Reel
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
            "primate-guidelines-GAG.jpg",
            "grundy-glow-GAG.jpg",
            "faithlynn-GAG.jpg"
          ]);

    // Helper to build a track of tiles
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
    //       <div class="gag-track">…</div>
    //       <div class="gag-track">…</div>
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

    // Replace host contents with mask
    host.textContent = '';
    host.appendChild(mask);
  } catch (e) {
    // Fail-safe: mark done and silently stop
    window.__OTI_GAGS_INIT__ = 'done';
  }
})();
