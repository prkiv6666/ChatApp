/* CHRONOS // TYPE-O — scroll-driven disassembly engine
   A tall .scrolly section pins a .stage; scroll progress (0..1) scrubs
   through real watch photography: full case -> movement/tourbillon ->
   balance. Layers cross-fade + scale to feel like one continuous push-in. */
(function () {
  "use strict";

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp  = (a, b, t) => a + (b - a) * t;
  // ramp: 0 before `from`, 0..1 across [from,to], 1 after
  const ramp  = (p, from, to) => clamp((p - from) / (to - from), 0, 1);
  // band: fades 0->1 over [inA,inB], holds 1, fades 1->0 over [outA,outB]
  const band  = (p, inA, inB, outA, outB) =>
    p < inA ? 0 : p < inB ? (p - inA) / (inB - inA)
    : p <= outA ? 1 : p < outB ? 1 - (p - outA) / (outB - outA) : 0;

  const scrolly  = document.getElementById("story");
  const layers   = [...document.querySelectorAll(".layer")];
  const caps     = [...document.querySelectorAll(".cap")];
  const hint     = document.getElementById("scrollHint");
  const stepEl   = document.getElementById("stageStep");
  const fill     = document.querySelector(".scroll-fill");
  const nav      = document.getElementById("nav");

  const STEPS = ["01 — CASE", "02 — MOVEMENT", "03 — ROTATION", "04 — BALANCE"];

  let progress = 0, ticking = false;

  function render() {
    ticking = false;
    const p = progress;

    /* ---- L0: full watch, zooms in then dissolves into the movement ---- */
    const op0 = 1 - ramp(p, 0.18, 0.30);
    setLayer(layers[0], op0, lerp(1, 2.6, ramp(p, 0, 0.30)), 50);

    /* ---- L1: movement + tourbillon. Lives across MOVEMENT + ROTATION,
            panning from centre toward the tourbillon as it zooms. ---- */
    const op1 = band(p, 0.18, 0.30, 0.60, 0.70);
    const panX = lerp(45, 70, ramp(p, 0.30, 0.68));   // % object-position
    setLayer(layers[1], op1, lerp(1.05, 2.1, ramp(p, 0.18, 0.70)), panX);

    /* ---- L2: balance close-up, the finale ---- */
    const op2 = ramp(p, 0.60, 0.72);
    setLayer(layers[2], op2, lerp(1.1, 1.7, ramp(p, 0.60, 1)), 50);

    /* ---- captions ---- */
    setCap(caps[0], 1 - ramp(p, 0.10, 0.17), p, 0.10);
    setCap(caps[1], band(p, 0.22, 0.30, 0.42, 0.48), p, 0.30);
    setCap(caps[2], band(p, 0.48, 0.55, 0.64, 0.70), p, 0.55);
    setCap(caps[3], ramp(p, 0.74, 0.80) * (1 - ramp(p, 0.97, 1)), p, 0.80);

    /* ---- stage chrome ---- */
    if (hint)  hint.style.opacity = String(1 - ramp(p, 0, 0.05));
    if (stepEl) {
      const idx = p < 0.22 ? 0 : p < 0.48 ? 1 : p < 0.72 ? 2 : 3;
      if (stepEl.textContent !== STEPS[idx]) stepEl.textContent = STEPS[idx];
    }
  }

  function setLayer(el, opacity, scale, panX) {
    if (!el) return;
    el.style.opacity = opacity.toFixed(3);
    el.style.transform = `scale(${scale.toFixed(3)})`;
    const img = el.firstElementChild;
    if (img && panX != null) img.style.objectPosition = `${panX}% 50%`;
  }
  // tiny upward drift gives captions life as they cross their window
  function setCap(el, opacity, p, centre) {
    if (!el) return;
    el.style.opacity = opacity.toFixed(3);
    const drift = (p - centre) * -60; // px
    const base = el.classList.contains("cap--center")
      ? "translate(-50%,-50%)" : "translateY(-50%)";
    el.style.transform = `${base} translateY(${drift.toFixed(1)}px)`;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = scrolly.getBoundingClientRect();
      const total = scrolly.offsetHeight - window.innerHeight;
      progress = clamp(-rect.top / total, 0, 1);

      const docMax = document.documentElement.scrollHeight - window.innerHeight;
      if (fill) fill.style.width = (docMax > 0 ? (window.scrollY / docMax) * 100 : 0) + "%";
      nav.classList.toggle("scrolled", window.scrollY > 60);

      render();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* mobile menu */
  const burger = document.querySelector(".nav-burger");
  const links  = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", () => {
      const open = links.style.display === "flex";
      links.style.cssText = open ? "" :
        "display:flex;position:fixed;inset:64px 0 auto 0;flex-direction:column;gap:22px;align-items:center;padding:32px;background:rgba(7,8,11,.96);backdrop-filter:blur(14px);z-index:71;";
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => (links.style.cssText = "")));
  }
})();
