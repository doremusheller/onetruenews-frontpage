// ONE TRU INFOTAINMENT — Ticker v1.1 (root-level)

(function () {
  // Doom-message pool (can append freely)
  const pool = [
    "REPORT CHEERFULLY",
    "BUY PATRIOT BEER",
    "DO NOT PAUSE",
    "EVERY ERROR IS TREASON",
    "TRUST CORRECTIONS",
    "PAY WITH GRATITUDE",
    "SEE SOMETHING SAY EVERYTHING",
    "VIGILES ARE HIRING",
    "LOYALTY IS A LIFESTYLE",
    "YOUR TURN TO CLAP",
    "QUESTION NOTHING",
    "SPEND BRAVELY",
    "EXPORT DOUBT",
    "IMPORT PRIDE",
    "LINES ARE EFFICIENT",
    "LAUGHTER IS LICENSED",
    "BELIEVE OR LEAVE",
    "NUMBERS NEVER ARGUE",
    "THE FIRST CITIZEN IS SPEAKING",
    "TODAY IS OPTIMIZED",
    // fundraiser-adjacent lines per Tink
    "WE HATE ASKING",
    "WE LOVE TAKING",
    // gentle Grundy needle
    "GRUNDY SMILES AGAIN"
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

    // Populate 10 unique items
    const items = pickUnique(pool, 10);

    // Build once, then duplicate for seamless loop
    const frag = document.createDocumentFragment();
    items.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      frag.appendChild(li);
    });
    const dup = frag.cloneNode(true);
    ul.appendChild(frag);
    ul.appendChild(dup);

    // Pause/Play
    const toggle = document.querySelector(".ticker-toggle");
    let paused = false;
    if (toggle) {
      toggle.addEventListener("click", () => {
        paused = !paused;
        ul.style.animationPlayState = paused ? "paused" : "running";
        toggle.setAttribute("aria-pressed", String(paused));
        toggle.textContent = paused ? "▶" : "⏸";
        toggle.setAttribute("title", paused ? "Play headlines" : "Pause headlines");
      });
    }

    // Respect reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      ul.style.animation = "none";
    } else {
      // Tiny tempo adjustment for ultra-narrow phones
      if (window.innerWidth <= 360) {
        // CSS default is 28s; slow ~12%
        ul.style.animationDuration = "31.5s";
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
