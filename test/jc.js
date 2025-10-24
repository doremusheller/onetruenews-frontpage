/* One True Infotainment — jc.js (flat, no deps) */

(function () {
  // ===== Smooth anchor scroll (optional, flat-safe) =====
  function smoothAnchor(e) {
    const a = e.target.closest('a[href^="./"][href*="#"], a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    const hash = href.startsWith('#') ? href : href.split('#')[1] ? '#' + href.split('#')[1] : null;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', hash);
  }
  document.addEventListener('click', smoothAnchor);

  // ===== BREAKING ROTATOR =====
  const ROTATE_MS = 15000; // 15s per story
  const breakingRoot = document.getElementById('breaking');

  function getTiles() {
    return breakingRoot ? Array.from(breakingRoot.querySelectorAll('.tile--breaking')) : [];
  }

  function ensureOneActive(tiles) {
    if (!tiles.length) return;
    const anyActive = tiles.some(t => t.classList.contains('is-active'));
    if (!anyActive) tiles[0].classList.add('is-active');
  }

  let tiles = getTiles();
  let idx = 0;
  let paused = false;

  if (breakingRoot && tiles.length) {
    ensureOneActive(tiles);

    function next() {
      if (paused || document.hidden) return;
      tiles = getTiles(); // pick up newly added tiles
      if (tiles.length <= 1) return;

      // Find current active index
      const curIdx = tiles.findIndex(t => t.classList.contains('is-active'));
      const from = curIdx >= 0 ? curIdx : idx % tiles.length;
      const to = (from + 1) % tiles.length;

      tiles[from]?.classList.remove('is-active');
      tiles[to]?.classList.add('is-active');
      idx = to;
    }

    // Pause rotation on hover
    breakingRoot.addEventListener('mouseenter', () => { paused = true; });
    breakingRoot.addEventListener('mouseleave', () => { paused = false; });

    // Mutation observer: ensure an active tile exists + refresh list
    const mo = new MutationObserver(() => {
      tiles = getTiles();
      ensureOneActive(tiles);
    });
    mo.observe(breakingRoot, { childList: true, subtree: true });

    // Advance on interval
    setInterval(next, ROTATE_MS);
  }

  // ===== "Time ago" updater =====
  function fmtAgo(dt) {
    const s = Math.max(0, (Date.now() - dt.getTime()) / 1000);
    if (s < 60) return 'Just now';
    const m = Math.floor(s / 60); if (m < 60) return `${m} min ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h} hr ago`;
    const d = Math.floor(h / 24); return `${d} d ago`;
  }

  function updateAgo() {
    document.querySelectorAll('time.ago[datetime]').forEach(el => {
      const dt = new Date(el.getAttribute('datetime'));
      if (!isNaN(dt)) el.textContent = fmtAgo(dt);
    });
  }

  // Initial + periodic update
  updateAgo();
  setInterval(updateAgo, 15000);

  // ===== Footer year helper =====
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();
