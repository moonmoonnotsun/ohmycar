export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ohmycar-theme";
export const THEME_COLOR: Record<Theme, string> = {
  dark: "#07080c",
  light: "#eef0f4",
};

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
}

export function persistTheme(theme: Theme) {
  applyTheme(theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // private mode / blocked storage — theme still applies for this session
  }
}

export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  if (isTheme(attr)) return attr;
  return readStoredTheme() ?? "dark";
}

/** Inline boot for root layout — runs before paint to avoid FOUC. */
export const THEME_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark")t="dark";document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="light"?${JSON.stringify(THEME_COLOR.light)}:${JSON.stringify(THEME_COLOR.dark)});}catch(e){document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark";}})();`;
