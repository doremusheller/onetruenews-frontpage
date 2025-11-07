/* ============================================================
   One True Infotainment — ads.js
   v3.1 (rail always-on)
   - Never writes outside #ads-rail / #ads-dock
   - Uses manifest or fallback list
   - Desktop and anything over 700px: left rail
   - Mobile (≤700px): bottom dock
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
      img.addEventListener("error", () => {
        img.style.visibility = "hidden";
        img.style.minHeight = "120px";
      });

      a.appendChild(pill);
      a.appendChild(img);
      return a;
    }

    function buildRail() {
      if (!rail || !ads.length) return;
      rail.innerHTML = "";
      const frag = document.createDocumentFragment();

      const fixed = document.createElement("div");
      fixed.className = "ad-fixed";
      const topAd = createTile(ads[0]);
      fixed.appendChild(topAd);

      const scroll = document.createElement("div");
      scroll.className = "ad-scroll";
      ads.slice(1).forEach(ad => scroll.appendChild(createTile(ad)));

      frag.appendChild(fixed);
      frag.appendChild(scroll);
      rail.appendChild(frag);
      rail.dataset.live = "1";
    }

    function buildDock() {
      if (!dock || !ads.length) return;
      dock.innerHTML = "";
      const track = document.createElement("div");
      track.className = "ad-track";
      ads.forEach(ad => track.appendChild(createTile(ad)));
      dock.appendChild(track);
    }

    // Build rail for everything >700px, dock for ≤700px
    function apply() {
      const width = window.innerWidth || document.documentElement.clientWidth;
      if (width <= 700) {
        if (dock) buildDock();
        if (rail) rail.innerHTML = "";
      } else {
        if (rail) buildRail();
        if (dock) dock.innerHTML = "";
      }
    }

    apply();
    window.addEventListener("resize", apply);
  });
})();
