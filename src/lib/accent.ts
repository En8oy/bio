/**
 * Visitor-picked accent color override, set from the <nav-switcher> header's
 * color picker and persisted across the full-page navigations between the
 * 4 design worlds (same pattern as theme/lang: localStorage, re-applied on
 * each page load).
 *
 * Scope: only the shared --color-accent / --color-accent-contrast tokens —
 * the nav-switcher active button, the site-wide scrollbar, and the custom
 * cursor. Each world's own local palette (Candy's lime, Neon's cyan, etc.)
 * stays exactly as designed and does not derive from this override.
 */

const STORAGE_KEY = "accentOverride";

export interface AccentOverride {
  accent: string;
  contrast: string;
}

function readOverride(): AccentOverride | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.accent === "string" && typeof parsed?.contrast === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}

function applyToDocument(accent: string, contrast: string) {
  document.documentElement.style.setProperty("--color-accent", accent);
  document.documentElement.style.setProperty("--color-accent-contrast", contrast);
}

/**
 * Re-applies a stored override, if one exists. Safe to call unconditionally
 * on every page — worlds that never set their own accent (Terminal Dev)
 * rely on this as the only mechanism that restores a picked color for them.
 */
export function restoreAccentOverride(): AccentOverride | null {
  const override = readOverride();
  if (override) applyToDocument(override.accent, override.contrast);
  return override;
}

/**
 * Called by a world's own mount code in place of unconditionally setting
 * its own accent: applies the visitor's stored override when one exists,
 * falling back to the world's default otherwise. Without this guard, a
 * world that sets its own accent on mount would silently overwrite a
 * visitor's picked color the moment they navigate into it.
 */
export function applyWorldAccent(defaultAccent: string, defaultContrast: string) {
  const override = readOverride();
  applyToDocument(override?.accent ?? defaultAccent, override?.contrast ?? defaultContrast);
}

export function setAccentOverride(accent: string, contrast: string) {
  applyToDocument(accent, contrast);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accent, contrast }));
  } catch {
    /* localStorage unavailable (private mode, quota) — the picker still
       applies the color live for this page view, it just won't persist. */
  }
}

export function clearAccentOverride() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function getStoredAccent(): AccentOverride | null {
  return readOverride();
}
