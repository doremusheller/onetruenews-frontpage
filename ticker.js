/* =========================
   Header + Ticker (v7.4 sync)
   ========================= */
header.site-header{
  background:linear-gradient(90deg,var(--c-navy),var(--c-red));
  color:var(--c-metal);
  display:block;
}

.ticker{
  display:flex;
  align-items:center;
  height:28px;
  padding:0 var(--space-3);
  background:linear-gradient(90deg,var(--c-red) 0%,#7D0E1A 50%,var(--c-red) 100%);
  overflow:hidden;
  color:var(--c-metal);
}

.ticker-viewport{overflow:hidden;flex:1;}
.ticker-track{
  display:inline-flex;
  gap:48px;
  white-space:nowrap;
  will-change:transform;
  animation:scrollTicker 33s linear infinite; /* 30s scroll + 3s pause */
}
.ticker-track li{
  list-style:none;
  font-weight:700;
  letter-spacing:.06em;
  text-transform:uppercase;
  text-shadow:0 1px 0 rgba(0,0,0,.45),0 0 6px rgba(255,255,255,.15);
}

/* Keyframes now include pause at end */
@keyframes scrollTicker {
  0%   { transform:translate3d(0,0,0); }
  90%  { transform:translate3d(-50%,0,0); }
  100% { transform:translate3d(-50%,0,0); } /* hold for pause */
}

@media (prefers-reduced-motion:reduce){.ticker-track{animation:none;}}
