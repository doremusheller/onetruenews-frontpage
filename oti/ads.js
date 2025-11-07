/* ============================================================
   One True Infotainment — ads.js
   v3.0 (clean contract): rail/dock only, manifest-driven, idempotent
   - Never writes outside #ads-rail / #ads-dock
   - No document.write, no body/innerHTML clobbering
   - Uses a manifest (global, inline JSON, or built-in fallback)
   - Desktop (≥1100px): sticky left rail
   - Mobile (≤700px): bottom dock
   - Mid-range (701–1099px): neither surface renders (per CSS)
   ============================================================ */

(function () {
  if (window.__OTI_ADS_INIT__) return;
  window.__OTI_ADS_INIT__ = true;

  // ---- Manifest sourcing (priority order) ----
  function getManifest() {
    // 1) Global injected, e.g., window.OTI_ADS_MANIFEST = [...]
    if (Array.isArray(window.OTI_ADS_MANIFEST) && window.OTI_ADS_MANIFEST.length) {
      return window.OTI_ADS_MANIFEST.slice();
    }
    // 2) Inline JSON: <script type="application/json" id="ads-manifest">[...]</script>
    const tag = document.getElementById("ads-manifest");
    if (tag && tag.textContent.trim()) {
      try {
        const parsed = JSON.parse(tag.textContent);
        if (Array.isArray(parsed)) return parsed;
      } catch (_e) {}
    }
    // 3) Built-in safe fallback
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

  const onReady = (fn) =>
    (document.readyState === "loading")
      ? document.addEventListener("DOMContentLoaded", fn, { once: true })
      : fn();

  onReady(() => {
    const rail = document.getElementById("ads-rail");
    const dock = document.getElementById("ads-dock");
    if (!rail && !dock) return;

    const manifest = getManifest();

    // Build normalized ad objects
    const ads = manifest
      .filter(fn => typeof fn === "string" && fn.trim())
      .map(fn => {
        const filename = fn.trim();
        const base = filename.replace(/\.[^.]+$/, ""); // strip extension
        const href = base + ".html";
        const img = "media/" + filename;
        return { base, href, img, label: filename.includes("golden") ? "Public Notice" : "Sponsored" };
      });

    // Helpers
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

    function clearRail() {
      if (!rail) return;
      rail.removeAttribute("data-live");
      rail.textContent = "";
    }

    function clearDock() {
      if (!dock) return;
      dock.textContent = "";
    }

    // Desktop rail builder (≥1100px)
    function buildRail() {
      if (!rail || !ads.length) { clearRail(); return; }
      clearRail();

      const frag = document.createDocumentFragment();

      const fixed = document.createElement("div");
      fixed.className = "ad-fixed";
      const topAd = createTile(ads[0]);
      topAd.classList.add("ad-tile", "ad-fixed-cover");
      fixed.appendChild(topAd);

      const scroll = document.createElement("div");
      scroll.className = "ad-scroll";
      ads.slice(1).forEach(ad => scroll.appendChild(createTile(ad)));

      frag.appendChild(fixed);
      frag.appendChild(scroll);
      rail.appendChild(frag);

      rail.dataset.live = "1";
    }

    // Mobile dock builder (≤700px)
    function buildDock() {
      if (!dock || !ads.length) { clearDock(); return; }
      clearDock();

      const track = document.createElement("div");
      track.className = "ad-track";

      const frag = document.createDocumentFragment();
      ads.forEach(ad => frag.appendChild(createTile(ad)));
      track.appendChild(frag);
      dock.appendChild(track);
    }

    // Responsive orchestration — one surface active at a time
    const mqDesktop = window.matchMedia("(min-width:1100px)");
    const mqMobile  = window.matchMedia("(max-width:700px)");

    function apply() {
      if (mqDesktop.matches) {
        buildRail();
        clearDock();
      } else if (mqMobile.matches) {
        buildDock();
        clearRail();
      } else {
        clearRail();
        clearDock();
      }
    }

    apply();

    (mqDesktop.addEventListener || mqDesktop.addListener).call(mqDesktop, "change", apply);
    (mqMobile.addEventListener  || mqMobile.addListener ).call(mqMobile , "change", apply);
  });
})();
