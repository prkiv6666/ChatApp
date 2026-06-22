/* CHRONOS // TYPE-O — scroll choreography */
(function () {
  "use strict";

  const nav        = document.getElementById("nav");
  const scrollFill = document.querySelector(".scroll-fill");
  const watch      = document.querySelector(".hero-watch");
  const burger     = document.querySelector(".nav-burger");
  const links      = document.querySelector(".nav-links");

  /* ---- tag reveal targets ---- */
  const revealSelector = ".panel-kicker, .panel-h, .panel-lead, .stat, .spec-list, .meter, .order-h, .order-sub, .order-row";
  document.querySelectorAll(revealSelector).forEach((el, i) => {
    el.classList.add("reveal", "d" + ((i % 4) + 1));
  });

  /* ---- intersection reveal ---- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          // fire stat counter + meter when their panel enters
          if (e.target.classList.contains("stat")) animateCount(e.target);
          if (e.target.classList.contains("meter")) e.target.querySelector(".meter-fill").style.width = "100%";
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---- count-up for the 4HZ stat ---- */
  function animateCount(stat) {
    const num = stat.querySelector(".stat-num");
    if (!num) return;
    const target = parseFloat(num.dataset.count || "0");
    const dur = 1100;
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      num.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---- scroll: progress bar, nav state, hero parallax ---- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollFill) scrollFill.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

      nav.classList.toggle("scrolled", y > 60);

      // hero watch drifts up + scales slightly as you leave the hero
      if (watch && y < window.innerHeight) {
        const t = y / window.innerHeight;
        watch.style.transform =
          `translate(-50%, calc(-50% - ${t * 120}px)) scale(${1 - t * 0.12})`;
        watch.style.opacity = String(1 - t * 0.65);
      }
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- subtle watch tilt toward cursor (desktop) ---- */
  const wrap = document.querySelector(".watch-wrap");
  if (wrap && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      const rx = (e.clientY / window.innerHeight - 0.5) * -10;
      const ry = (e.clientX / window.innerWidth - 0.5) * 10;
      wrap.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }

  /* ---- mobile menu ---- */
  if (burger && links) {
    burger.addEventListener("click", () => {
      const open = links.style.display === "flex";
      links.style.cssText = open
        ? ""
        : "display:flex;position:fixed;inset:64px 0 auto 0;flex-direction:column;gap:22px;align-items:center;padding:32px;background:rgba(7,8,11,.96);backdrop-filter:blur(14px);z-index:71;";
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => (links.style.cssText = ""))
    );
  }

  /* ---- animate watch hands continuously ---- */
  const hands = document.querySelector(".w-hands");
  const tourb = document.querySelector(".w-tourb");
  const gear  = document.querySelector(".w-gear");
  let a = 0;
  (function tick() {
    a += 0.4;
    if (hands) hands.style.transform = `rotate(${a}deg)`;
    if (tourb) tourb.style.transform = `rotate(${-a * 3}deg)`;
    if (gear)  gear.style.transform  = `rotate(${a * 2}deg)`;
    requestAnimationFrame(tick);
  })();
})();
