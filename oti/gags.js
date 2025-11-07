/* ============================================================
   One True Infotainment — gags.js
   v3.3 (stable desktop fix)
   - Rail builds ONLY when CSS desktop media query is true
   - Otherwise, build dock (so no blank states)
   - Adds resize + load fallback to ensure desktop rail appears
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

  ready(() => {
    const rail = document.getElementById("gags-rail");
    const dock = document.getElementById("gags-dock");
    if (!rail && !dock) return;

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
      a.rel = "nofollow";
      a.setAttribute("aria-label", gag.base);

      const pill = document.createElement("span");
      pill.className = "gag-pill";
      pill.textContent = gag.label;

      const img = document.createElement("img");
      img.className = "gag-img";
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = gag.base.replace(/[-_]/g, " ");
      img.src = gag.img;
      img.addEventListener("error", () => {
        img.style.visibility = "hidden";
        img.style.minHeight = "120px";
      });

      a.appendChild(pill);
      a.appendChild(img);
      return a;
    }

    function clearRail() { if (rail) { rail.removeAttribute("data-live"); rail.textContent = ""; } }
    function clearDock() { if (dock) { dock.textContent = ""; } }

    function buildRail() {
      if (!rail || !gags.length) return;
      rail.textContent = "";
      const frag = document.createDocumentFragment();

      const fixed = document.createElement("div");
      fixed.className = "gag-fixed";
      fixed.appendChild(createTile(gags[0]));

      const scroll = document.createElement("div");
      scroll.className = "gag-scroll";
      gags.slice(1).forEach(gag => scroll.appendChild(createTile(gag)));

      frag.appendChild(fixed);
      frag.appendChild(scroll);
      rail.appendChild(frag);
      rail.dataset.live = "1";
    }

    function buildDock() {
      if (!dock || !gags.length) return;
      dock.textContent = "";
      const track = document.createElement("div");
      track.className = "gag-track";
      gags.forEach(gag => track.appendChild(createTile(gag)));
      dock.appendChild(track);
    }

    // Mirror the CSS desktop breakpoint exactly
    const mqDesktop = window.matchMedia("(min-width:1100px)");

    function apply() {
      if (mqDesktop.matches) {
        // Desktop CSS grid is active → safe to build rail
        buildRail();
        clearDock();
      } else {
        // Not in desktop CSS → never build rail; use dock instead
        buildDock();
        clearRail();
      }
    }

    // Run initial build once DOM is ready
    apply();

    // Rebuild on breakpoint change (modern browsers)
    if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", apply);
    else mqDesktop.addListener(apply);

    // --- NEW: ensure rebuild after full load and any resize ---
    window.addEventListener("load", apply);
    window.addEventListener("resize", () => {
      // throttle to prevent spam rebuilds
      clearTimeout(window.__gagResizeTimer);
      window.__gagResizeTimer = setTimeout(apply, 250);
    });
    // --- END NEW FIX ---
  });
})();
