
export type Theme = "gold" | "amber" | "yellow" | "dark" | "corporate" | "forest" | "violet" | "modern" | "ocean" | "regal" | "rose" | "mint" | "lavender"| 'ocean'
  | 'emerald'
  | 'royal'
  | 'slate'
  // Pastel / Dual-Tone
  | 'sunset'   // New
  | 'lavender' // New
  | 'mint'     // New
  | 'nordic' // New;
  | 'midnight';

const THEME_KEY = "erp-theme";

export const setTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
};

export const initTheme = (): Theme => {
  if (typeof window === "undefined") return "gold";
  const saved = localStorage.getItem(THEME_KEY) as Theme | null;
  const theme: Theme = saved ?? "gold"; // Default to 'gold'
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
};