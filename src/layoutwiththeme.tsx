import React from 'react';
import { ThemeSwitcher } from './components/ThemeSwitcher';

interface LayoutWithThemeProps {
  children: React.ReactNode;
}

export const LayoutWithTheme: React.FC<LayoutWithThemeProps> = ({ children }) => {
  return (
    <div className="bg-app min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-card border-b shadow-sm">
        <h1 className="text-main font-semibold text-lg">
          ERP
        </h1>
        <ThemeSwitcher />
      </header>

      {/* Main content */}
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
};