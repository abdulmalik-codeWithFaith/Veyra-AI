/**
 * Theme preference helpers. Uses the same "veyra-theme" key as the inline script in
 * app/layout.tsx, so the page never flashes the wrong theme.
 */
export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "veyra-theme";
const CHANGE_EVENT = "veyra-theme-change";

export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(preference: ThemePreference): void {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = preference === "dark" || (preference === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", dark);
}

export function setThemePreference(preference: ThemePreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    /* storage unavailable: the theme still changes for this visit */
  }
  applyTheme(preference);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** For useSyncExternalStore. Also re-applies the theme when the OS setting changes. */
export function subscribeToTheme(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (getThemePreference() === "system") applyTheme("system");
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  media.addEventListener("change", onSystemChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    media.removeEventListener("change", onSystemChange);
  };
}