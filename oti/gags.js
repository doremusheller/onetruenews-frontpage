/* ============================================================
   One True Infotainment — gags.js
   v4.0 (dock-only, always-on bottom scroller)
   - Always builds the bottom dock across all screen sizes
   - Retires the left rail (no desktop rail logic)
   - Safer image handling (remove broken tiles)
   - Improved, human-readable ARIA labels
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
    // Turn "golden-streets-GAG" into "Golden streets"
    const base = String(slug || "").replace(/\.[^.]+$/, "");
    const words = base.replace(/[_-]+/g, " ").trim().split(/\s+/);
    if (!words.length) return base || "Gag";
    // Drop trailing "GAG" token if present
    const cleaned = words.filter((w, i) => !(i === words.length - 1 && /^gag$/i.test(w)));
    const titled = cleaned.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    return (titled.join(" ") || "Gag").trim();
  }

  ready(() => {
    const rail = document.getElementById("gags-rail");
    const dock = document.getElementById("gags-dock");
    if (!dock && !rail) return; // nothing to do

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
      a.href = gag.href;                 // keep internal hotlink
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
        // Remove broken tiles to avoid empty holes
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
    }

    // --- Dock-only behavior: always build dock, retire rail ---
    function apply() {
      buildDock();   // populate bottom scroller on all screens
      clearRail();   // ensure legacy rail is empty/inactive
    }
    // ----------------------------------------------------------

    // Run initial build once DOM is ready
    apply();

    // Ensure rebuild after full load (image/layout safety)
    window.addEventListener("load", apply);

    // Throttled rebuild on resize/orientation changes
    window.addEventListener("resize", () => {
      clearTimeout(window.__gagResizeTimer);
      window.__gagResizeTimer = setTimeout(apply, 250);
    });
  });
})();
