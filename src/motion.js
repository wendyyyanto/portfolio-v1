import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, CustomEase);
gsap.defaults({ ease: CustomEase.create("out", "0.23,1,0.32,1"), duration: 0.5 });

const NAV = 56;

function smoothScroll() {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  const jump = (e) => {
    const a = e.target.closest('a[href^="#"]');
    const el = a && document.querySelector(a.getAttribute("href"));
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: el.id === "top" ? 0 : -NAV });
  };
  document.addEventListener("click", jump);
  return () => {
    document.removeEventListener("click", jump);
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}

function navSpy(root) {
  const nav = root.querySelector("[data-nav]");
  const links = [...nav.querySelectorAll("a")];
  const secs = [...root.querySelectorAll("[data-section]")];
  let cur;
  const mark = (id) => links.forEach((a) => {
    const on = a.hash === `#${id}`;
    if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    if (on) nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
  });
  const last = secs[secs.length - 1];
  const pick = () => secs.reduce((id, s) => (s.getBoundingClientRect().top <= (s === last ? innerHeight * 0.7 : NAV + 120) ? s.id : id), secs[0].id);
  const update = () => {
    const id = pick();
    if (id !== cur) { cur = id; mark(id); }
  };
  secs.forEach((s) => ScrollTrigger.create({ trigger: s, start: "top bottom", end: "bottom top", onUpdate: update, onToggle: update, onRefresh: update }));
  update();
}

function heroType(scope) {
  const h1 = scope.querySelector("[data-hero]");
  const split = SplitText.create(h1, { type: "words,chars", aria: "auto" });
  gsap.from(split.chars, { opacity: 0, yPercent: 60, rotate: 4, duration: 0.8, stagger: 0.014, delay: 0.1 });
  gsap.from("[data-hero-in]", { opacity: 0, y: 16, duration: 0.6, stagger: 0.08, delay: 0.5 });

  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return () => split.revert();

  const move = (e) => {
    split.chars.forEach((c) => {
      const r = c.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      gsap.to(c, { y: -Math.max(0, 1 - d / 180) * 14, duration: 0.45, overwrite: "auto" });
    });
  };
  const leave = () => gsap.to(split.chars, { y: 0, duration: 0.6, overwrite: "auto" });
  h1.addEventListener("pointermove", move);
  h1.addEventListener("pointerleave", leave);
  return () => {
    h1.removeEventListener("pointermove", move);
    h1.removeEventListener("pointerleave", leave);
    split.revert();
  };
}

function aboutWords() {
  const el = document.querySelector("[data-words]");
  const split = SplitText.create(el, { type: "words", aria: "auto" });
  gsap.fromTo(split.words, { opacity: 0.18 }, {
    opacity: 1, stagger: 0.1, ease: "none",
    scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 52%", scrub: true },
  });
  return () => split.revert();
}

function timelineFill(root) {
  const tl = root.querySelector("[data-timeline]");
  const items = [...tl.querySelectorAll(".tl-item")];
  const light = (p) => items.forEach((i) => i.classList.toggle("is-on", i.offsetTop <= p * tl.offsetHeight));
  gsap.fromTo(tl.querySelector(".tl-fill"), { scaleY: 0 }, {
    scaleY: 1, ease: "none",
    scrollTrigger: { trigger: tl, start: "top 60%", end: "bottom 60%", scrub: true, onUpdate: (s) => light(s.progress) },
  });
  light(0);
}

function projectCard(root) {
  const list = root.querySelector("[data-plist]");
  const card = root.querySelector("[data-pcard]");
  const d = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.35;
  const x = gsap.quickTo(card, "x", { duration: d });
  const y = gsap.quickTo(card, "y", { duration: d });
  let placed = false;
  const place = (cx, cy) => {
    const w = card.offsetWidth, h = card.offsetHeight;
    const tx = cx + 28 + w > innerWidth ? cx - 28 - w : cx + 28;
    const ty = Math.min(Math.max(cy - 24, NAV + 8), innerHeight - h - 8);
    if (placed) { x(tx); y(ty); } else { gsap.set(card, { x: tx, y: ty }); placed = true; }
  };
  const move = (e) => place(e.clientX, e.clientY);
  const focus = (e) => {
    const r = e.target.closest(".prow")?.getBoundingClientRect();
    if (r) place(r.right - card.offsetWidth - 60, r.top + 24);
  };
  const leave = () => { placed = false; };
  list.addEventListener("pointermove", move);
  list.addEventListener("pointerleave", leave);
  list.addEventListener("focusin", focus);
  return () => {
    list.removeEventListener("pointermove", move);
    list.removeEventListener("pointerleave", leave);
    list.removeEventListener("focusin", focus);
  };
}

export function useMotion(scope) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const root = scope.current;
    const ctx = gsap.context(() => navSpy(root), root);
    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const undo = [smoothScroll(), heroType(root), aboutWords()];

      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, stagger: 0.07, overwrite: true }),
      });

      timelineFill(root);

            if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
        root.querySelectorAll("[data-drag]").forEach((card) => {
          const d = Draggable.create(card, {
            type: "x,y",
            inertia: true,
            throwResistance: 6000,
            minDuration: 0.1,
            maxDuration: 0.5,
            bounds: card.closest("[data-bounds]"),
            edgeResistance: 0.85,
            onDragStart() { this.target.classList.add("is-art"); },
            onRelease() { this.target.classList.remove("is-art"); },
          });
          undo.push(() => d.forEach((i) => i.kill()));
        });
      }

      html.dataset.motionReady = "";
      return () => undo.forEach((fn) => fn());
    });

    mm.add("(hover: hover) and (pointer: fine)", () => projectCard(root));

    html.dataset.motionReady = "";
    return () => { mm.revert(); ctx.revert(); };
  }, [scope]);
}
