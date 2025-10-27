/* ============================================================
   grid.js — One True Infotainment
   Desktop story randomizer with anchored Breaking tile
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.matchMedia("(min-width:1100px)").matches;
  if (!isDesktop) return; // desktop-only behavior

  const grid = document.getElementById("storyGrid");
  if (!grid) return;

  // Collect tiles but keep BREAKING anchored
  const breaking = grid.querySelector(".tile.breaking");
  const allTiles = Array.from(grid.querySelectorAll(".tile")).filter(t => t !== breaking);

  // Optional manifest hook for programmatic generation
  // window.OTI_STORY_MANIFEST = [
  //   { href:"grundy-checkup.html", img:"media/grundy-checkup.png", title:"...", blurb:"..." },
  // ];

  if (!allTiles.length) return;

  // Shuffle helper
  function shuffle(arr){
    for (let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Initial random layout — show up to 20
  const LIMIT = 20;
  const shuffled = shuffle(allTiles.slice());
  const showNow = shuffled.slice(0, Math.min(LIMIT, shuffled.length));
  const hideNow = shuffled.slice(LIMIT);

  // Apply display state
  allTiles.forEach(t => (t.style.display = "none"));
  showNow.forEach(t => {
    t.style.display = "";
    grid.appendChild(t); // keep flat order after Breaking
  });

  // Cycling (if extra stories and motion allowed)
  if (!prefersReduced && hideNow.length > 0) {
    let poolVisible = showNow;
    let poolHidden = hideNow;

    function fadeOut(el){
      el.style.transition = "opacity .3s ease";
      el.style.opacity = "0";
    }
    function fadeIn(el){
      el.style.transition = "opacity .3s ease";
      el.style.opacity = "1";
    }

    // Rotate one tile every 45s
    setInterval(() => {
      if (!window.matchMedia("(min-width:1100px)").matches) return; // stay desktop-only
      if (!poolHidden.length) return;

      const victim = poolVisible[Math.floor(Math.random() * poolVisible.length)];
      const newcomer = poolHidden.splice(Math.floor(Math.random() * poolHidden.length), 1)[0];

      fadeOut(victim);
      setTimeout(() => {
        victim.style.display = "none";
        newcomer.style.opacity = "0";
        newcomer.style.display = "";
        grid.appendChild(newcomer);
        requestAnimationFrame(() => fadeIn(newcomer));

        poolVisible = poolVisible.filter(t => t !== victim).concat(newcomer);
        poolHidden.push(victim);
      }, 320);
    }, 45000);
  }
});
