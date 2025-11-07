/* ============================================================
   One True Infotainment — gags.js
   v4.0 (GAGS-aligned)
   - Rail builds ONLY when CSS desktop media query is true
   - Otherwise, builds dock (so no blank states)
   - Scoped to #gags-rail / #gags-dock only
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

    // fallback list if manifest missing
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
    } else {
      fn();
    }
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

    function clearRail() {
      if (rail) {
        rail.removeAttribute("data-live");
        rail.textContent = "";
      }
    }

    function clearDock() {
      if (dock) {
        dock.textContent = "";
      }
    }

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
        // Desktop CSS grid active → build rail
        buildRail();
        clearDock();
      } else {
        // Not in desktop CSS → build dock
        buildDock();
        clearRail();
      }
    }

    apply();

    // Keep in sync with CSS when window/zoom/scaling changes
    if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", apply);
    else mqDesktop.addListener(apply);
  });
})();
