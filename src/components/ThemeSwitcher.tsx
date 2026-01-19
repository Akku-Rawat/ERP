import { useEffect, useState, type ChangeEvent } from "react";
import { initTheme, setTheme, type Theme } from "../themes";

const themes: { value: Theme; label: string }[] = [
  { value: "midnight", label: "🌑 Midnight Blue" },
  { value: "glass", label: "✨ Frosted Glass" },
  { value: "luxury", label: "💎 Luxury Gold" },

  { value: "corporate", label: "💼 Corporate" },
  { value: "ocean", label: "🌊 Ocean Cyan" },
  { value: "nordic", label: "🏔️ Nordic Slate" },

  { value: "mint", label: "🍃 Fresh Mint" },
  { value: "rose", label: "🌸 Pastel Rose" },
  { value: "lavender", label: "🔮 Lavender" },
  { value: "sunset", label: "🌇 Sunset Warm" },

  { value: "dark", label: "🌙 Classic Dark" },
  { value: "gold", label: "🏆 Classic Gold" },
  { value: "cyber", label: "🚀 Cyber Neon" },
];

export function ThemeSwitcher() {
  const [theme, setThemeState] = useState<Theme>("gold");

  useEffect(() => {
    const current = initTheme();
    setThemeState(current);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const t = e.target.value as Theme;
    setTheme(t);
    setThemeState(t);
  };

  return (
    <select
      value={theme}
      onChange={handleChange}
      className="border border-theme rounded px-2 py-1 text-sm bg-card text-main"
    >
      {themes.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
