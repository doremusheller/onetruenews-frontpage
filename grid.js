// OTI mosaic — randomize 10 tiles, max 3 ads; preserve headlines and links (v7.3.2)
(function(){
  const grid = document.querySelector('.main-grid');
  if(!grid) return;

  const all = Array.from(grid.children).filter(n => n.classList.contains('tile'));
  const ads = all.filter(n => n.classList.contains('ad'));
  const stories = all.filter(n => !n.classList.contains('ad'));

  // shuffle
  const shuffle = arr => arr.sort(() => Math.random() - 0.5);

  shuffle(ads);
  shuffle(stories);

  const chosenAds = ads.slice(0, Math.min(3, ads.length));
  const neededStories = Math.max(0, 10 - chosenAds.length);
  const chosenStories = stories.slice(0, Math.min(neededStories, stories.length));
  const chosen = shuffle([...chosenStories, ...chosenAds]);

  // hide/show
  all.forEach(t => t.style.display = 'none');
  chosen.forEach(t => t.style.display = '');

  // layout plan: 1 hero, 2 wide, 3 tall, rest square
  const plan = [];
  if (chosen.length >= 1) plan.push('hero');
  for (let i=0; i<2 && plan.length<chosen.length; i++) plan.push('wide');
  for (let i=0; i<3 && plan.length<chosen.length; i++) plan.push('tall');
  while (plan.length < chosen.length) plan.push('square');
  shuffle(plan);

  // respect fixed-size overrides
  chosen.forEach((t,i) => {
    if (t.hasAttribute('data-fit-fixed')) return;
    t.setAttribute('data-fit', plan[i]);
  });
})();
