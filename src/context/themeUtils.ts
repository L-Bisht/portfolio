export type Theme = "light" | "dark";

export const THEME_COLORS = {
  light: "#f8fafc",
  dark: "#050811",
} as const;

/**
 * Synchronizes the root document element's class list and browser chrome theme-color
 * meta tags with the active theme to ensure seamless mobile overscroll elastic bounce.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const isDark = theme === "dark";

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  const targetColor = THEME_COLORS[theme];
  const metaThemeColors = document.querySelectorAll('meta[name="theme-color"]');

  if (metaThemeColors.length > 0) {
    metaThemeColors.forEach((meta) => {
      meta.setAttribute("content", targetColor);
    });
  } else if (document.head) {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("content", targetColor);
    document.head.appendChild(meta);
  }
}
