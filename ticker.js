// js/ticker.js — v6.9 (deferred)
/*
  - Populates the ticker with 10 randomized items (duplicated for seamless loop)
  - Pause/Play button toggles animation via CSS play state
  - Honors prefers-reduced-motion
*/

(function(){
  const pool = [
    'REPORT CHEERFULLY','BUY PATRIOT BEER','DO NOT PAUSE','EVERY ERROR IS TREASON','TRUST CORRECTIONS','PAY WITH GRATITUDE',
    'SEE SOMETHING SAY EVERYTHING','VIGILES ARE HIRING','LOYALTY IS A LIFESTYLE','YOUR TURN TO CLAP',
    'QUESTION NOTHING','SPEND BRAVELY','EXPORT DOUBT','IMPORT PRIDE','LINES ARE EFFICIENT','LAUGHTER IS LICENSED',
    'BELIEVE OR LEAVE','NUMBERS NEVER ARGUE','THE FIRST CITIZEN IS SPEAKING','TODAY IS OPTIMIZED'
  ];

  function pickTenUnique(arr){
    const chosen = new Set();
    while (chosen.size < 10 && chosen.size < arr.length){
      chosen.add(arr[Math.floor(Math.random()*arr.length)]);
    }
    return Array.from(chosen);
  }

  function initTicker(){
    const ul = document.getElementById('ticker-track');
    if(!ul) return;

    // Build items and duplicate for loop feel
    const items = pickTenUnique(pool);
    items.concat(items).forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      ul.appendChild(li);
    });

    // Pause/Play control
    const toggle = document.querySelector('.ticker-toggle');
    let paused = false;
    if(toggle){
      toggle.addEventListener('click', () => {
        paused = !paused;
        ul.style.animationPlayState = paused ? 'paused' : 'running';
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.textContent = paused ? '▶' : '⏸';
        toggle.setAttribute('title', paused ? 'Play headlines' : 'Pause headlines');
      });
    }

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if(mq.matches){ ul.style.animation = 'none'; }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initTicker);
  } else {
    initTicker();
  }
})();
