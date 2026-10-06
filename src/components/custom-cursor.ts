import { LitElement, html, css } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { gsap, prefersReducedMotion } from "../lib/motion";

const DESIGN_SLUGS = ["candy-brand", "terminal-dev", "neon", "dotfiles"] as const;
type Kind = (typeof DESIGN_SLUGS)[number] | "";

const HOVER_SELECTOR = "a, button, input, textarea, select, [role='button'], summary";

// How much the ring grows on hover, expressed as a scale factor from its
// base size to the ~48px/~22px target each kind used before this was a
// transform (not width/height) — terminal-dev's non-square caret needs a
// non-uniform scale to land on a roughly square hover target.
const DEFAULT_HOVER_SCALE = { x: 1.6, y: 1.6 };
const HOVER_SCALE: Partial<Record<Kind, { x: number; y: number }>> = {
  "terminal-dev": { x: 2.2, y: 1.22 },
  dotfiles: { x: 3.14, y: 3.14 },
};

/**
 * <custom-cursor> replaces the system pointer with a per-world animated
 * one (each /designs/* page sets --color-accent, same value the shared
 * <nav-switcher> reads). Only activates for a real mouse
 * (pointer: fine) with motion allowed — on touch or
 * prefers-reduced-motion it renders nothing and leaves the native cursor
 * alone.
 */
export class CustomCursor extends LitElement {
  static properties = {
    kind: { reflect: true, type: String },
  };

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 10050;
      pointer-events: none;
    }
    .dot,
    .ring {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 50%;
      opacity: 0;
    }
    .dot {
      width: 6px;
      height: 6px;
      background: var(--color-accent, #6d5efc);
    }
    .ring {
      width: 30px;
      height: 30px;
      border: 1.5px solid var(--color-accent, #6d5efc);
      transition: opacity 0.18s ease;
    }
    :host([data-active="true"]) .dot,
    :host([data-active="true"]) .ring {
      opacity: 1;
    }

    /* Terminal Dev: a tty caret, no separate dot. */
    :host([kind="terminal-dev"]) .ring {
      width: 10px;
      height: 18px;
      border-radius: 1px;
      border-width: 2px;
    }
    :host([kind="terminal-dev"]) .dot {
      display: none;
    }

    /* Dotfiles: a small square pixel, matching its dot-grid background. */
    :host([kind="dotfiles"]) .ring {
      width: 7px;
      height: 7px;
      border-radius: 1px;
      border: none;
      background: var(--color-accent, #00aa8a);
    }
    :host([kind="dotfiles"]) .dot {
      display: none;
    }

    /* Neon: a soft glowing ring with trailing lag. */
    :host([kind="neon"]) .ring {
      box-shadow: 0 0 18px 2px var(--color-accent, #22d3ee);
    }

    /* Candy Brand: a bold outlined ring, bounces on click. */
    :host([kind="candy-brand"]) .ring {
      border-width: 3px;
      border-color: var(--color-accent, #d6fa3a);
    }
    :host([kind="candy-brand"]) .dot {
      background: var(--color-accent, #d6fa3a);
    }
  `;

  declare kind: Kind;

  private dotRef = createRef<HTMLElement>();
  private ringRef = createRef<HTMLElement>();
  private active = false;
  private hovering = false;
  private pressed = false;
  private styleTag?: HTMLStyleElement;
  private ringX?: (v: number) => void;
  private ringY?: (v: number) => void;

  private onMove = (e: MouseEvent) => {
    if (!this.active) return;
    gsap.set(this.dotRef.value, { x: e.clientX, y: e.clientY });
    this.ringX?.(e.clientX);
    this.ringY?.(e.clientY);
    this.setAttribute("data-active", "true");
  };

  /** Ring scale while pressed overrides the hover scale until release. */
  private applyRingScale(duration: number, ease: string) {
    if (this.pressed) {
      gsap.to(this.ringRef.value, { scaleX: 0.8, scaleY: 0.8, duration, ease, overwrite: "auto" });
      return;
    }
    const s = this.hovering ? HOVER_SCALE[this.kind] ?? DEFAULT_HOVER_SCALE : { x: 1, y: 1 };
    gsap.to(this.ringRef.value, { scaleX: s.x, scaleY: s.y, duration, ease, overwrite: "auto" });
  }

  private onOver = (e: MouseEvent) => {
    const target = e.target as Element | null;
    const hovering = !!target?.closest?.(HOVER_SELECTOR);
    if (hovering === this.hovering) return;
    this.hovering = hovering;
    this.toggleAttribute("data-hover", hovering);
    this.applyRingScale(0.18, "power2.out");
  };

  private onDown = () => {
    this.pressed = true;
    this.applyRingScale(0.12, "power2.out");
    gsap.to(this.dotRef.value, { scale: 0.8, duration: 0.12, ease: "power2.out", overwrite: "auto" });
  };

  private onUp = () => {
    this.pressed = false;
    const bounce = this.kind === "candy-brand" ? "back.out(2.2)" : "power2.out";
    this.applyRingScale(0.25, bounce);
    gsap.to(this.dotRef.value, { scale: 1, duration: 0.25, ease: bounce, overwrite: "auto" });
  };

  private onLeaveWindow = () => this.removeAttribute("data-active");

  constructor() {
    super();
    this.kind = "";
  }

  connectedCallback() {
    super.connectedCallback();
    const slug = DESIGN_SLUGS.find((s) => window.location.pathname.includes(s));
    this.kind = slug ?? "";

    const canCustomCursor = window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion();
    if (!canCustomCursor) return;

    this.active = true;
    this.styleTag = document.createElement("style");
    this.styleTag.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(this.styleTag);

    window.addEventListener("mousemove", this.onMove, { passive: true });
    window.addEventListener("mouseover", this.onOver, { passive: true });
    window.addEventListener("mousedown", this.onDown);
    window.addEventListener("mouseup", this.onUp);
    document.addEventListener("mouseleave", this.onLeaveWindow);
  }

  firstUpdated() {
    if (!this.active) return;
    gsap.set([this.dotRef.value, this.ringRef.value], { xPercent: -50, yPercent: -50 });
    this.ringX = gsap.quickTo(this.ringRef.value, "x", { duration: 0.35, ease: "power3.out" });
    this.ringY = gsap.quickTo(this.ringRef.value, "y", { duration: 0.35, ease: "power3.out" });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("mousemove", this.onMove);
    window.removeEventListener("mouseover", this.onOver);
    window.removeEventListener("mousedown", this.onDown);
    window.removeEventListener("mouseup", this.onUp);
    document.removeEventListener("mouseleave", this.onLeaveWindow);
    this.styleTag?.remove();
  }

  render() {
    if (!this.active) return html``;
    return html`
      <div class="ring" ${ref(this.ringRef)}></div>
      <div class="dot" ${ref(this.dotRef)}></div>
    `;
  }
}

customElements.define("custom-cursor", CustomCursor);
