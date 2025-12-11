// src/components/Header.tsx
import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-card shadow-sm border-b">
      <h1 className="text-lg font-semibold text-main">
        ERP Dashboard
      </h1>
      <ThemeSwitcher />
    </header>
  );
}