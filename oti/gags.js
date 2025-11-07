/* ============================================================
   One True Infotainment — gags.js
   v4.1 (dock-only + gentle auto-scroll)
   - Always builds bottom dock
   - Removes broken tiles
   - Human-readable ARIA labels
   - NEW: Continuous, medium-speed auto-scroll with smart pause
   ============================================================ */

(function () {
  if (window.__OTI_GAGS_INIT__) return;
  window.__OTI_GAGS_INIT__ = true;

  function getManifest() {
    if (Array.isArray(window.OTI_GAGS_MANIFEST) && window.OTI_GAGS_MANIFEST.length)
      return window.OTI_GAGS_MANIFEST.slice();

    const tag = document.getElementById("gags-manifest");
    if (tag && tag.textContent.trim()) {
      try {
        const parsed = JSON.parse(tag.textContent);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }

    return [
      "Angels-GAG.jpg",
      "patriot-beer-GAG.jpg",
      "patriot-games-GAG.jpg",
      "you-GAG-here.jpg",
      "blacks-love-grundy-GAG.jpg",
      "OTI-premium-GAG.jpg",
      "grundymax-GAG.jpg",
      "golden-streets-GAG.jpg",
      "cover-GAG.jpg",
      "primate-guidelines-GAG.jpg",
      "grundy-glow-GAG.jpg"
    ];
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else { fn(); }
  }

  function humanizeLabel(slug) {
    const base = String(slug || "").replace(/\.[^.]+$/, "");
    const words = base.replace(/[_-]+/g, " ").trim().split(/\s+/);
    if (!words.length) return base || "Gag";
    const cleaned = words.filter((w, i) => !(i === words.length - 1 && /^gag$/i.test(w)));
    const titled = cleaned.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    return (titled.join(" ") || "Gag").trim();
  }

  ready(() => {
    const rail = document.getElementById("gags-rail");
    const dock = document.getElementById("gags-dock");
    if (!dock && !rail) return;

    const manifest = getManifest();
    const gags = manifest.map(fn => {
      const base = fn.replace(/\.[^.]+$/, "");
      return {
        base,
        href: base + ".html",
        img: "media/" + fn,
        label: fn.includes("golden") ? "Public Notice" : "Sponsored"
      };
    });

    function createTile(gag) {
      const a = document.createElement("a");
      a.className = "gag-tile";
      a.href = gag.href;
      a.setAttribute("aria-label", humanizeLabel(gag.base));

      const pill = document.createElement("span");
      pill.className = "gag-pill";
      pill.textContent = gag.label;

      const img = document.createElement("img");
      img.className = "gag-img";
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = humanizeLabel(gag.base);
      img.src = gag.img;
      img.addEventListener("error", () => {
        const parent = a.parentNode;
        if (parent) parent.removeChild(a);
      });

      a.appendChild(pill);
      a.appendChild(img);
      return a;
    }

    function clearRail() { if (rail) { rail.removeAttribute("data-live"); rail.textContent = ""; } }
    function clearDock() { if (dock) { dock.textContent = ""; } }

    function buildDock() {
      if (!dock || !gags.length) return;
      dock.textContent = "";
      const track = document.createElement("div");
      track.className = "gag-track";
      gags.forEach(gag => track.appendChild(createTile(gag)));
      dock.appendChild(track);
      setupAutoScroll(track);
    }

    // --- Dock-only behavior ---
    function apply() {
      buildDock();
      clearRail();
    }

    // Gentle auto-scroll that pauses on interaction or user setting
    function setupAutoScroll(track) {
      if (!track) return;

      // Respect user preference
      const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduce) return;

      let raf = null;
      let last = 0;
      let paused = false;
      let pauseUntil = 0;

      // ~30 px/sec feels “medium” at 60fps
      const PX_PER_SEC = 30;

      function tick(ts) {
        if (paused || ts < pauseUntil) {
          raf = requestAnimationFrame(tick);
          return;
        }
        if (!last) last = ts;
        const dt = ts - last;
        last = ts;

        // advance
        track.scrollLeft += (PX_PER_SEC * dt) / 1000;

        // loop seamlessly
        const max = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= max - 1) {
          track.scrollLeft = 0;
        }
        raf = requestAnimationFrame(tick);
      }

      function start() {
        if (raf) return;
        last = 0;
        raf = requestAnimationFrame(tick);
      }
      function stop() {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        last = 0;
      }
      function pause(ms = 3000) {
        pauseUntil = performance.now() + ms;
      }

      // Pause on user interaction; resume on idle
      track.addEventListener("mouseenter", () => paused = true);
      track.addEventListener("mouseleave", () => { paused = false; start(); });
      track.addEventListener("focusin",   () => paused = true);
      track.addEventListener("focusout",  () => { paused = false; start(); });
      track.addEventListener("pointerdown", () => pause(5000));
      track.addEventListener("wheel", () => pause(4000), { passive: true });
      track.addEventListener("scroll", () => pause(2000));

      // Tab visibility
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop(); else start();
      });

      // Kick off
      start();

      // Re-kick after images load
      window.addEventListener("load", () => { pause(1000); start(); }, { once: true });
    }

    // Init
    apply();

    window.addEventListener("load", apply);
    window.addEventListener("resize", () => {
      clearTimeout(window.__gagResizeTimer);
      window.__gagResizeTimer = setTimeout(apply, 250);
    });
  });
})();
