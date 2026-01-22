import React, { useState } from "react";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import Sidebar from "../src/components/SideBar";

interface LayoutWithThemeProps {
  children: React.ReactNode;
}

export const LayoutWithTheme: React.FC<LayoutWithThemeProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-app min-h-screen flex overflow-hidden">
      {/*  SIDEBAR  */}
      <Sidebar open={open} setOpen={setOpen} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-screen ${
          open ? "ml-64" : "ml-20"
        }`}
      >
        {/*  TOP BAR  */}
        <header className="flex items-center justify-between h-16 px-8 bg-card border-b border-[var(--border)] shadow-sm sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">
              E
            </span>
            <h1 className="text-main font-black text-xl tracking-tight uppercase">
              Platform<span className="text-primary">OS</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <ThemeSwitcher />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="w-full h-full max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
