
import { useEffect, useState, type ChangeEvent } from "react";
import { initTheme, setTheme, type Theme } from "../themes"; // Corrected path

const themes: { value: Theme; label: string }[] = [
  { value: 'midnight', label: 'Midnight (Corporate)' },
  { value: "gold", label: "Gold" },
  { value: "amber", label: "Amber" },
  { value: "yellow", label: "Yellow" },
  { value: "dark", label: "Dark" },
  { value: "corporate", label: "Corporate Blue" },
  { value: "forest", label: "Forest Green" },
  { value: "violet", label: "Violet Harmony" },
  { value: "modern", label: "Modern Gray" },
  { value: "ocean", label: "Ocean Breeze" },
  { value: "regal", label: "Regal Purple" },
  { value: "rose", label: "Pastel Rose" },      // New theme
  { value: "mint", label: "Mint Dream" },      // New theme
  { value: "lavender", label: "Lavender Haze" }, // New theme


   { value: 'lavender', label: 'Lavender (SaaS)' },
  //  { value: 'sunset', label: 'Sunset (Warm)' },
   { value: 'mint', label: 'Mint (Fresh)' },
   { value: 'nordic', label: 'Nordic (Clean)' },
  
  
  
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