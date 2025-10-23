// ONE TRU INFOTAINMENT — Ticker v2.0 (Worldfeed Edition, no controls)

(function () {
  // Global sardonic headlines inspired by "When It Happened Here"
  const pool = [
    "Ministry Declares Morning Permanently Delayed",
    "Patriot Grain Shipments Sink Cheerfully",
    "Peace Talks Resume Under Martial Law",
    "Weather Corrected For National Morale",
    "Celebrations Continue Despite Official Denial",
    "Public Surrender Reaches Record Levels",
    "Citizens Queue Calmly For Re-Education",
    "Patriot Games Interrupted By Power Surge",
    "Unrest Renamed To Enhance Stability",
    "Grundy Addresses Nation From Mirror",
    "Curfew Extended For Your Convenience",
    "Exports Halted Pending Further Triumph",
    "New Anthem Testing Well In Focus Groups",
    "Poll Finds 100% Partial Agreement",
    "Leader’s Heartbeat Declared National Soundtrack",
    "Freedom Lottery Drawn, Winner Missing",
    "All Broadcasts Now Safely Pre-Approved",
    "Truth Ministry Expands Into Children’s Programming",
    "Protest Reclassified As Patriotic Parade",
    "Optimism Levels Falling At Acceptable Rate"
  ];

  function pickUnique(arr, n) {
    const chosen = new Set();
    const max = Math.min(n, arr.length);
    while (chosen.size < max) {
      chosen.add(arr[Math.floor(Math.random() * arr.length)]);
    }
    return Array.from(chosen);
  }

  function init() {
    const ul = document.getElementById("ticker-track");
    if (!ul) return;

    // Pick and build ten random headlines
    const items = pickUnique(pool, 10);
    const frag = document.createDocumentFragment();
    items.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      frag.appendChild(li);
    });
    const dup = frag.cloneNode(true);
    ul.appendChild(frag);
    ul.appendChild(dup);

    // Handle reduced motion and tempo
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) ul.style.animation = "none";
    else if (window.innerWidth <= 360) ul.style.animationDuration = "31.5s";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
