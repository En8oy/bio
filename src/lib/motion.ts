import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Reveal triggers are measured at mount time; late-loading web fonts and
  // images shift section heights afterward, leaving stale trigger
  // positions (symptom: cards appear to "jump" partway down the page).
  // Refresh once everything has actually settled.
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh, { once: true });
  document.fonts?.ready.then(refresh);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Bouncy bento-style stagger, origin at center of the grid. ui-ux-pro-max: gsap "Standard" tier. */
export function staggerGridIn(selector: string, scope: ParentNode = document) {
  if (prefersReducedMotion()) return;
  const items = scope.querySelectorAll(selector);
  if (!items.length) return;
  gsap.from(items, {
    opacity: 0,
    scale: 0.92,
    y: 16,
    duration: 0.4,
    stagger: { each: 0.06, from: "center", grid: "auto" },
    ease: "back.out(1.4)",
  });
}

/**
 * Subtle fade-in on scroll-into-view, one element at a time. ui-ux-pro-max:
 * gsap "Subtle" tier. Opacity only (no y-slide): the trigger elements here
 * are whole page sections, which can be tall, and sliding a tall block
 * reads as a jarring "jump" rather than a subtle reveal.
 */
export function revealOnScroll(selector: string, scope: ParentNode = document) {
  if (prefersReducedMotion()) return;
  scope.querySelectorAll(selector).forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      duration: 0.35,
      ease: "power1.out",
      scrollTrigger: {
        trigger: el as Element,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

export { gsap };
