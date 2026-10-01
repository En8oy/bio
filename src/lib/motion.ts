import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
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

/** Subtle fade-up on scroll-into-view, one element at a time. ui-ux-pro-max: gsap "Subtle" tier. */
export function revealOnScroll(selector: string, scope: ParentNode = document) {
  if (prefersReducedMotion()) return;
  scope.querySelectorAll(selector).forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 12,
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
