/* ============================================================
   One True Infotainment — ads.js
   v3.4 (Round 33)
   - Adds visible test tile + outline to confirm rail is rendering
   ============================================================ */

(function () {
  if (window.__OTI_ADS_INIT__) return;
  window.__OTI_ADS_INIT__ = true;

  function getManifest() {
    if (Array.isArray(window.OTI_ADS_MANIFEST) && window.OTI_ADS_MANIFEST.length)
      return window.OTI_ADS_MANIFEST.slice();

    const tag = document.getElementById("ads-manifest");
    if (tag && tag.textContent.trim()) {
      try {
        const parsed = JSON.parse(tag.textContent);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }

    return [
      "Angels-AD.jpg",
      "patriot-beer-AD.jpg",
      "patriot-games-AD.jpg",
      "you-AD-here.jpg",
      "blacks-love-grundy-AD.jpg",
      "OTI-premium-AD.jpg",
      "grundymax-AD.jpg",
      "golden-streets-AD.jpg",
      "cover-AD.jpg",
      "primate-guidelines-AD.jpg",
      "grundy-glow-AD.jpg"
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
    const rail = document.getElementById("ads-rail");
    const dock = document.getElementById("ads-dock");
    if (!rail && !dock) return;

    const manifest = getManifest();
    const ads = manifest.map(fn => {
      const base = fn.replace(/\.[^.]+$/, "");
      return {
        base,
        href: base + ".html",
        img: "media/" + fn,
        label: fn.includes("golden") ? "Public Notice" : "Sponsored"
      };
    });

    function createTile(ad) {
      const a = document.createElement("a");
      a.className = "ad-tile";
      a.href = ad.href;
      a.rel = "nofollow";
      a.setAttribute("aria-label", ad.base);

      const pill = document.createElement("span");
      pill.className = "ad-pill";
      pill.textContent = ad.label;

      const img = document.createElement("img");
      img.className = "ad-img";
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = ad.base.replace(/[-_]/g, " ");
      img.src = ad.img;

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

    /* ===== PATCH: OTI-AD-RAIL FIX 002 ===== */
    function addTestTile(target) {
      if (!target) return;
      target.style.outline = "2px dashed red"; // temporary visual border
      const test = document.createElement("div");
      test.style.cssText =
        "background:#ffe5e5;color:#900;font-weight:bold;padding:6px;border-radius:6px;text-align:center;";
      test.textContent = "TEST TILE — RAIL IS ACTIVE";
      target.prepend(test);
    }
    /* ===== END PATCH ===== */

    function buildRail() {
      if (!rail || !ads.length) return;
      rail.textContent = "";
      const frag = document.createDocumentFragment();

      const fixed = document.createElement("div");
      fixed.className = "ad-fixed";
      fixed.appendChild(createTile(ads[0]));

      const scroll = document.createElement("div");
      scroll.className = "ad-scroll";
      ads.slice(1).forEach(ad => scroll.appendChild(createTile(ad)));

      frag.appendChild(fixed);
      frag.appendChild(scroll);
      rail.appendChild(frag);
      rail.dataset.live = "1";

      addTestTile(rail); // <<< confirm visibility
    }

    function buildDock() {
      if (!dock || !ads.length) return;
      dock.textContent = "";
      const track = document.createElement("div");
      track.className = "ad-track";
      ads.forEach(ad => track.appendChild(createTile(ad)));
      dock.appendChild(track);
    }

    // Mirror the CSS desktop breakpoint exactly
    const mqDesktop = window.matchMedia("(min-width:1100px)");

    function apply() {
      if (mqDesktop.matches) {
        buildRail();
        clearDock();
      } else {
        buildDock();
        clearRail();
      }
    }

    apply();

    if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", apply);
    else mqDesktop.addListener(apply);
  });
})();
