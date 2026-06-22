/* CHRONOS TYPE-O — skeleton tourbillon, hand-built SVG.
   Injected into #watchMount so the markup stays out of index.html. */
(function () {
  const svg = `
  <svg viewBox="0 0 400 520" role="img" aria-label="CHRONOS TYPE-O skeleton tourbillon watch">
    <defs>
      <linearGradient id="case" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0"   stop-color="#fbe7b0"/>
        <stop offset=".35" stop-color="#caa24d"/>
        <stop offset=".55" stop-color="#8a6a23"/>
        <stop offset=".8"  stop-color="#e6c168"/>
        <stop offset="1"   stop-color="#7a5b1c"/>
      </linearGradient>
      <linearGradient id="bezel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f6dd9b"/>
        <stop offset="1" stop-color="#8a6a23"/>
      </linearGradient>
      <radialGradient id="dial" cx="50%" cy="42%" r="70%">
        <stop offset="0"  stop-color="#1b2630"/>
        <stop offset=".6" stop-color="#0c1116"/>
        <stop offset="1"  stop-color="#05070a"/>
      </radialGradient>
      <radialGradient id="tourb" cx="50%" cy="50%" r="55%">
        <stop offset="0"  stop-color="#ffd27a"/>
        <stop offset=".5" stop-color="#ff8a3c"/>
        <stop offset="1"  stop-color="#5b3410"/>
      </radialGradient>
      <linearGradient id="strap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#23262d"/>
        <stop offset="1" stop-color="#0d0f13"/>
      </linearGradient>
    </defs>

    <!-- straps -->
    <path d="M120 70 Q110 20 130 0 L270 0 Q290 20 280 70 Z" fill="url(#strap)"/>
    <path d="M120 450 Q110 500 130 520 L270 520 Q290 500 280 450 Z" fill="url(#strap)"/>
    <g stroke="#000" stroke-opacity=".4" stroke-width="1">
      <line x1="150" y1="14" x2="250" y2="14"/><line x1="150" y1="34" x2="250" y2="34"/>
      <line x1="150" y1="486" x2="250" y2="486"/><line x1="150" y1="506" x2="250" y2="506"/>
    </g>

    <!-- crown -->
    <rect x="328" y="244" width="26" height="32" rx="4" fill="url(#case)"/>
    <rect x="330" y="248" width="22" height="6" fill="#5b441a"/>
    <rect x="330" y="266" width="22" height="6" fill="#5b441a"/>

    <!-- case (cushion / tonneau) -->
    <rect x="60" y="100" width="280" height="320" rx="70" fill="url(#case)"/>
    <rect x="74" y="114" width="252" height="292" rx="58" fill="#0a0d11"/>
    <rect x="84" y="124" width="232" height="272" rx="50" fill="url(#bezel)"/>

    <!-- dial -->
    <rect x="98" y="138" width="204" height="244" rx="42" fill="url(#dial)"/>

    <!-- skeleton bridges -->
    <g stroke="#caa24d" stroke-width="3" fill="none" opacity=".85" stroke-linecap="round">
      <path d="M120 175 q80 -30 160 0"/>
      <path d="M118 345 q82 26 164 0"/>
      <path d="M150 160 L150 360"/>
      <path d="M250 160 L250 360"/>
    </g>

    <!-- top sub-gear -->
    <g transform="translate(200,205)">
      <circle r="34" fill="none" stroke="#caa24d" stroke-width="2" opacity=".7"/>
      <g class="w-gear" style="transform-origin:0 0">
        <circle r="26" fill="none" stroke="#8a6a23" stroke-width="6" stroke-dasharray="3 5"/>
        <circle r="10" fill="#caa24d"/>
      </g>
    </g>

    <!-- tourbillon cage @ 6 o'clock -->
    <g transform="translate(200,322)">
      <circle r="48" fill="#06080b" stroke="#caa24d" stroke-width="2"/>
      <g class="w-tourb" style="transform-origin:0 0">
        <circle r="40" fill="none" stroke="url(#tourb)" stroke-width="3"/>
        <line x1="-40" y1="0" x2="40" y2="0" stroke="#caa24d" stroke-width="3"/>
        <line x1="0" y1="-40" x2="0" y2="40" stroke="#caa24d" stroke-width="3"/>
        <circle r="14" fill="url(#tourb)"/>
        <circle r="5" fill="#fff" opacity=".8"/>
      </g>
    </g>

    <!-- hands -->
    <g class="w-hands" style="transform-origin:200px 250px">
      <line x1="200" y1="250" x2="200" y2="165" stroke="#f4f0e8" stroke-width="5" stroke-linecap="round"/>
      <line x1="200" y1="250" x2="262" y2="250" stroke="#ff8a3c" stroke-width="4" stroke-linecap="round"/>
      <circle cx="200" cy="250" r="7" fill="#caa24d"/>
    </g>

    <!-- minute markers -->
    <g stroke="#caa24d" stroke-width="2" opacity=".55">
      <line x1="200" y1="150" x2="200" y2="160"/>
      <line x1="290" y1="250" x2="280" y2="250"/>
      <line x1="110" y1="250" x2="120" y2="250"/>
    </g>
  </svg>`;
  const mount = document.getElementById("watchMount");
  if (mount) mount.innerHTML = svg;
})();
