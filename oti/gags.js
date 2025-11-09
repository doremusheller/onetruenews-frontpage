/* OTI gags.js — SAFE BASELINE (no scroll, no pills) */
(function () {
  try {
    // Prevent double-runs
    if (window.__OTI_GAGS_INIT__ === 'done') return;

    // Only operate on the dock. If it's missing, do nothing.
    const host = document.getElementById('gags-dock');
    if (!host || host.tagName !== 'NAV') { window.__OTI_GAGS_INIT__ = 'done'; return; }

    window.__OTI_GAGS_INIT__ = 'done';

    // Read manifest or fall back
    const list =
      (Array.isArray(window.OTI_GAGS_MANIFEST) && window.OTI_GAGS_MANIFEST.length
        ? window.OTI_GAGS_MANIFEST.slice()
        : [
            "Angels-GAG.jpg","sauls-litters-GAG.jpg","patriot-beer-GAG.jpg","patriot-games-GAG.jpg",
            "gold-card-GAG.jpg","you-GAG-here.jpg","blacks-love-grundy-GAG.jpg","OTI-premium-GAG.jpg",
            "grundymax-GAG.jpg","golden-streets-GAG.jpg","cover-GAG.jpg","primate-guidelines-GAG.jpg",
            "grundy-glow-GAG.jpg"
          ]);

    // Build a minimal track INSIDE the dock only
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

    // Do not clear anything except the dock’s own contents
    host.textContent = '';
    host.appendChild(track);
  } catch (e) {
    // If anything goes wrong, mark done and do nothing else
    window.__OTI_GAGS_INIT__ = 'done';
  }
})();
