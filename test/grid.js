/* ==========================================================
   One True Infotainment · grid.js
   v6.9 — Randomized Mosaic (canon-safe)
   ========================================================== */

(function () {
  // ---- CONFIG -------------------------------------------------
  // Pin a specific tile at the first position? (e.g., lead story)
  const PIN_LEAD = false; // set to true to pin a lead tile
  const LEAD_SELECTOR = '.story-tile.lead'; // add class="lead" on the chosen tile in HTML

  // Optional: limit how often we reshuffle within a session
  const USE_SESSION_MEMORY = true;
  const SESSION_KEY = 'oti-grid-shuffled';

  // ---- UTIL ---------------------------------------------------
  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function shuffle(array) {
    // Fisher–Yates
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function moveNodes(parent, nodes) {
    const frag = document.createDocumentFragment();
    nodes.forEach(n => frag.appendChild(n));
    parent.appendChild(frag);
  }

  // ---- MAIN ---------------------------------------------------
  function randomizeTiles() {
    const grid = $('.content.grid-layout');
    if (!grid) return;

    // If we already shuffled this session, skip (prevents extra reorders on SPA-like nav)
    if (USE_SESSION_MEMORY && sessionStorage.getItem(SESSION_KEY)) return;

    // Gather tiles
    const tiles = $all('.story-tile', grid);
    if (tiles.length < 2) return;

    // Optionally pull out the lead tile
    let lead = null;
    if (PIN_LEAD) {
      lead = $(LEAD_SELECTOR, grid);
    }

    // Build list to shuffle (excluding lead if present)
    const toShuffle = tiles.filter(t => t !== lead);

    // Shuffle and reattach (minimize layout jank with rAF & fragment)
    window.requestAnimationFrame(() => {
      const shuffled = shuffle(toShuffle.slice());
      // If lead exists, ensure it is first
      if (lead) {
        moveNodes(grid, [lead].concat(shuffled));
      } else {
        moveNodes(grid, shuffled);
      }
      if (USE_SESSION_MEMORY) {
        sessionStorage.setItem(SESSION_KEY, '1');
      }
    });
  }

  // Run after DOM is ready (no dependency on external libs)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', randomizeTiles);
  } else {
    randomizeTiles();
  }
})();
