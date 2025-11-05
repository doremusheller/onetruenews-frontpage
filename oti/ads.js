/* ============================================================
   ads.js — One True Infotainment
   v4.0 stable
   ============================================================ */
(function(){
  const VERSION = '4.0';
  window.OTI_ADS_VERSION = VERSION;

  async function getAdsList(){
    try{
      const res = await fetch('media/ads-manifest.json', { cache: 'no-store' });
      if (res.ok){
        const list = await res.json();
        return list.filter(n => /AD\.(jpg|png)$/i.test(n));
      }
    }catch(e){}
    // fallback list if manifest fails
    return [
      "Angels-AD.jpg",
      "patriot-beer-AD.jpg",
      "patriot-games-AD.jpg",
      "you-AD-here.jpg",
      "blacks-love-grundy-AD.jpg",
      "OTI-premium-AD.jpg",
      "grundymax-AD.jpg",
      "golden-streets-AD.jpg",
      "cover-AD.png",
      "primate-guidelines-AD.jpg"
    ];
  }

  function adLinkFor(name){
    // generic rule: same basename, but .html
    const base = name.replace(/\.(jpg|png)$/i, '');
    return `./${base}.html`;
  }

  function createAdTile(name){
    const link = document.createElement('a');
    link.className = 'ad-link';
    link.href = adLinkFor(name);

    const pill = document.createElement('span');
    pill.className = 'ad-pill';
    pill.textContent = 'Financial Patriotism';

    const img = document.createElement('img');
    img.src = `media/${name}`;
    img.alt = 'Promotional image';
    img.loading = 'lazy';
    img.decoding = 'async';

    link.append(pill, img);

    const tile = document.createElement('div');
    tile.className = 'ad-tile';
    tile.appendChild(link);
    return tile;
  }

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderRow(container, ads){
    const track = document.createElement('div');
    track.className = 'track';
    ads.forEach(n => track.appendChild(createAdTile(n)));
    container.appendChild(track);
  }

  function renderSidebar(container, ads){
    ads.slice(0,6).forEach(n => container.appendChild(createAdTile(n)));
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const containers = document.querySelectorAll('.ad-row, .ad-container-left');
    if (!containers.length) return;

    const ads = await getAdsList();
    if (!ads.length) return;

    const shuffled = shuffle(ads);

    containers.forEach(container => {
      if (container.classList.contains('ad-row')){
        renderRow(container, shuffled);
      } else {
        renderSidebar(container, shuffled);
      }
    });
  });
})();
