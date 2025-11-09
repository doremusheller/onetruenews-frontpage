/* ============================================================
   One True Infotainment — gags.js
   v4.2 (autoscroll fix)
   ============================================================ */

(function () {
  if (window.__OTI_GAGS_INIT__) return;
  window.__OTI_GAGS_INIT__ = true;

  function getManifest() {
    if (Array.isArray(window.OTI_GAGS_MANIFEST) && window.OTI_GAGS_MANIFEST.length)
      return window.OTI_GAGS_MANIFEST.slice();/* ============================================================
   One True Infotainment — gags.js
   v4.3 (smooth scroll + no pills)
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
  "grundy-glow-GAG.jpg"
    ];
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else { fn(); }
  }

  ready(() => {
    const dock = document.getElementById("gags-dock");
    if (!dock) return;

    const manifest = getManifest();
    const gags = manifest.map(fn => {
      const base = fn.replace(/\.[^.]+$/, "");
      return {
        base,
        href: base + ".html",
        img: "media/" + fn
      };
    });

    function createTile(gag) {
      const a = document.createElement("a");
      a.className = "gag-tile";
      a.href = gag.href;
      a.rel = "nofollow";
      a.setAttribute("aria-label", gag.base);

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

      a.appendChild(img);
      return a;
    }

    function buildDock() {
      if (!gags.length) return;
      dock.textContent = "";
      const track = document.createElement("div");
      track.className = "gag-track";
      gags.forEach(gag => track.appendChild(createTile(gag)));
      dock.appendChild(track);
      setupAutoScroll(track);
    }

    // --- SMOOTH AUTO SCROLL ---
    function setupAutoScroll(track) {
      if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let pos = 0;
      let paused = false;
      const speed = 0.04; // balanced medium speed (px/ms)
      let last = performance.now();

      const loop = (now) => {
        const delta = now - last;
        last = now;
        if (!paused) {
          pos += delta * speed;
          if (pos >= track.scrollWidth - track.clientWidth) pos = 0;
          track.scrollLeft = pos;
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);

      const pause = (ms = 2000) => {
        paused = true;
        clearTimeout(track._resumeTimer);
        track._resumeTimer = setTimeout(() => { paused = false; }, ms);
      };
      track.addEventListener("mouseenter", () => pause());
      track.addEventListener("focusin", () => pause());
      track.addEventListener("pointerdown", () => pause(3000));
      track.addEventListener("wheel", () => pause(3000));
    }

    buildDock();
  });
})();


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
    const dock = document.getElementById("gags-dock");
    if (!dock) return;

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

    function buildDock() {
      if (!gags.length) return;
      dock.textContent = "";
      const track = document.createElement("div");
      track.className = "gag-track";
      gags.forEach(gag => track.appendChild(createTile(gag)));
      dock.appendChild(track);
      setupAutoScroll(track);
    }

    // --- AUTO SCROLL (medium speed) ---
    function setupAutoScroll(track) {
      if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let pos = 0;
      let paused = false;
      const speed = 0.4; // medium speed
      const loop = () => {
        if (!paused) {
          pos += speed;
          if (pos >= track.scrollWidth - track.clientWidth) pos = 0;
          track.scrollLeft = pos;
        }
        requestAnimationFrame(loop);
      };
      loop();

      // Pause on user interaction (but not on self-scroll)
      const pause = (ms = 2000) => {
        paused = true;
        clearTimeout(track._resumeTimer);
        track._resumeTimer = setTimeout(() => { paused = false; }, ms);
      };
      track.addEventListener("mouseenter", () => pause());
      track.addEventListener("focusin", () => pause());
      track.addEventListener("pointerdown", () => pause(3000));
      track.addEventListener("wheel", () => pause(3000));
      // Removed the self-scroll pause that caused auto-scroll lock
    }

    buildDock();
  });
})();
