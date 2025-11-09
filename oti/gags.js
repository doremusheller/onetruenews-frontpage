/* ============================================================
   One True Infotainment — gags.js
   v4.4 (seamless loop, no pills, safe DOM scope)
   ============================================================ */
(function () {
  if (window.__OTI_GAGS_INIT__) return;
  window.__OTI_GAGS_INIT__ = true;

  function getManifest() {
    if (Array.isArray(window.OTI_GAGS_MANIFEST) && window.OTI_GAGS_MANIFEST.length) {
      return window.OTI_GAGS_MANIFEST.slice();
    }
    const tag = document.getElementById("gags-manifest");
    if (tag && tag.textContent.trim()) {
      try {
        const parsed = JSON.parse(tag.textContent);
        if (Array.isArray(parsed)) return parsed;
      } catch(_) {}
    }
    return [
      "Angels-GAG.jpg","sauls-litters-GAG.jpg","patriot-beer-GAG.jpg","patriot-games-GAG.jpg",
      "gold-card-GAG.jpg","you-GAG-here.jpg","blacks-love-grundy-GAG.jpg","OTI-premium-GAG.jpg",
      "grundymax-GAG.jpg","golden-streets-GAG.jpg","cover-GAG.jpg","primate-guidelines-GAG.jpg",
      "grundy-glow-GAG.jpg"
    ];
  }

  function ready(fn){
    (document.readyState === "loading")
      ? document.addEventListener("DOMContentLoaded", fn, { once:true })
      : fn();
  }

  ready(() => {
    const host = document.getElementById("gags-dock");
    if (!host) return;                  // never touch anything else

    // viewport + track
    host.textContent = "";              // only clear inside the dock
    const viewport = document.createElement("div");
    viewport.className = "gags-viewport";
    const track = document.createElement("div");
    track.className = "gags-track";
    viewport.appendChild(track);
    host.appendChild(viewport);

    const manifest = getManifest().map(fn => ({
      base: fn.replace(/\.[^.]+$/, ""),
      href: fn.replace(/\.[^.]+$/, "") + ".html",
      img : "media/" + fn
    }));

    function mountSet(into){
      manifest.forEach(g => {
        const a = document.createElement("a");
        a.className = "gag-tile";
        a.href = g.href;
        a.rel = "nofollow";
        a.setAttribute("aria-label", g.base);

        const img = document.createElement("img");
        img.className = "gag-img";
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = g.base.replace(/[-_]/g, " ");
        img.src = g.img;
        img.addEventListener("error", () => {
          img.style.visibility = "hidden";
          img.style.minHeight = "110px";
        });

        a.appendChild(img);
        into.appendChild(a);
      });
    }

    // duplicate once for seamless loop
    mountSet(track);
    mountSet(track);

    // smooth continuous scroll; loop at half width
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let pos = 0, paused = false, last = performance.now();
      const speed = 0.04; // px per ms — adjust for faster/slower
      const half = () => (track.scrollWidth / 2) - 1;

      function step(now){
        const dt = now - last; last = now;
        if (!paused) {
          pos += dt * speed;
          if (pos >= half()) pos -= half();
          track.scrollLeft = pos;
        }
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);

      const pause = (ms=2000) => {
        paused = true;
        clearTimeout(track._resumeTimer);
        track._resumeTimer = setTimeout(() => paused = false, ms);
      };
      viewport.addEventListener("mouseenter", () => pause());
      viewport.addEventListener("focusin",   () => pause());
      viewport.addEventListener("pointerdown",() => pause(3000));
      viewport.addEventListener("wheel",     () => pause(3000));
    }
  });
})();
