/* ============================================================
   grid.js — One True Infotainment
   v1.2 (surgical): optimized desktop randomizer, Breaking tile excluded
   - Zero HTML/CSS changes required
   - Minimizes reflow/paint via DocumentFragment + batched style writes
   - Pauses swaps when tab not visible; respects reduced motion
   - Tile cap raised to 40
   - All .tile.breaking remain anchored in place
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.matchMedia("(min-width:1100px)").matches;
  if (!isDesktop) return; // desktop-only behavior

  const grid = document.getElementById("storyGrid") || document.querySelector(".grid");
  if (!grid) return;

  // Collect tiles but keep ALL BREAKING tiles anchored
  const breakingTiles = Array.from(grid.querySelectorAll(".tile.breaking"));
  const allTiles = Array.from(grid.querySelectorAll(".tile")).filter(
    t => !breakingTiles.includes(t)
  );
  if (!allTiles.length) return;

  // Fisher–Yates
  function shuffle(arr){
    for (let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const LIMIT = 40;
  const INTERVAL_MS = 45000; // keep existing cadence

  const shuffled = shuffle(allTiles.slice());
  const showNow = shuffled.slice(0, Math.min(LIMIT, shuffled.length));
  const hideNow = shuffled.slice(LIMIT);

  // Batch initial visibility changes to reduce layout thrash
  (function initialLayout(){
    // hide all NON-BREAKING tiles first (batch write)
    allTiles.forEach(t => {
      t.style.display = "none";
      t.style.opacity = "";
      t.style.transition = "";
    });

    // then show the chosen ones using a fragment
    const frag = document.createDocumentFragment();
    showNow.forEach(t => {
      t.style.display = "";
      frag.appendChild(t);
    });
    grid.appendChild(frag);
    // breakingTiles remain untouched, in their original anchored positions
  })();

  if (prefersReduced || hideNow.length === 0) return;

  let poolVisible = showNow.slice();
  let poolHidden = hideNow.slice();

  function fade(el, to){
    el.style.transition = "opacity .3s ease";
    el.style.opacity = to;
  }

  const swap = () => {
    // maintain desktop-only + visibility guard
    if (!window.matchMedia("(min-width:1100px)").matches) return;
    if (document.visibilityState === "hidden") return;
    if (!poolHidden.length || !poolVisible.length) return;

    const victim = poolVisible[Math.floor(Math.random() * poolVisible.length)];
    const idx = Math.floor(Math.random() * poolHidden.length);
    const newcomer = poolHidden.splice(idx, 1)[0];

    // Fade out victim, then replace in a rAF to batch style writes
    fade(victim, "0");
    setTimeout(() => {
      victim.style.display = "none";
      newcomer.style.opacity = "0";
      newcomer.style.display = "";

      // Append newcomer in a fragment to avoid multiple reflows
      const frag = document.createDocumentFragment();
      frag.appendChild(newcomer);
      grid.appendChild(frag);

      requestAnimationFrame(() => fade(newcomer, "1"));

      // rotate pools
      poolVisible = poolVisible.filter(t => t !== victim).concat(newcomer);
      poolHidden.push(victim);
    }, 320);
  };

  setInterval(swap, INTERVAL_MS);
});
