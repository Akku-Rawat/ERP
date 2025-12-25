import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaMoneyBillWave,
  FaUsers,
  FaShoppingBag,
  FaBoxes,
  FaBriefcase,
  FaUserTie,
  FaBuilding,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", to: "/dashboard", icon: <FaChartBar /> },
  { name: "Sales", to: "/sales", icon: <FaMoneyBillWave /> },
  { name: "Customer", to: "/crm", icon: <FaUsers /> },
  { name: "Procurement", to: "/procurement", icon: <FaShoppingBag /> },
  { name: "Inventory", to: "/inventory", icon: <FaBoxes /> },
  { name: "Accounting", to: "/accounting", icon: <FaBriefcase /> },
  { name: "Human Resource", to: "/hr", icon: <FaUserTie /> },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const settingsRoutes = ["/settings", "/companySetup", "/userManagement"];
  const isSettingsRoute = settingsRoutes.some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <div
      className={`flex flex-col h-screen bg-sidebar fixed z-50 shadow-2xl transition-all duration-300 border-r border-[var(--border)] overflow-hidden ${
        open ? "w-64" : "w-20"
      }`}
    >
      {/* 1. HEADER - FIXED HEIGHT */}
      <div className="flex items-center justify-between p-4 h-16 shrink-0 border-b border-[var(--border)]">
        <div className="flex items-center overflow-hidden">
          {open && <h2 className="text-2xl font-bold text-primary truncate">ERP</h2>}
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg text-2xl text-muted hover:text-primary transition shrink-0"
        >
          <FaBars />
        </button>
      </div>

      {/* 2. MIDDLE - SCROLLABLE AREA */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `nav-link group relative flex items-center h-11 rounded-xl transition-all duration-200 shrink-0 ${
                isActive ? "active shadow-sm" : "hover:bg-row-hover"
              }`
            }
          >
            {/* Center Icon in 48px space */}
            <div className="flex items-center justify-center min-w-[48px] shrink-0">
              <span className="text-xl nav-icon">{item.icon}</span>
            </div>

            {/* Text hidden when collapsed, no wrap */}
            <span className={`font-semibold text-sm nav-text whitespace-nowrap transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 invisible"}`}>
              {item.name}
            </span>

            {/* Tooltip when collapsed */}
            {!open && (
              <span className="absolute left-16 bg-card text-main border border-[var(--border)] text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap shadow-xl translate-x-2 group-hover:translate-x-0">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}

        {/* Settings Group */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`nav-link group relative flex items-center h-11 w-full rounded-xl transition-all shrink-0 ${
              settingsOpen || isSettingsRoute ? "active" : "hover:bg-row-hover"
            }`}
          >
            <div className="flex items-center justify-center min-w-[48px] shrink-0">
              <FaCog className="text-xl nav-icon" />
            </div>
            
            <span className={`font-semibold text-sm nav-text whitespace-nowrap transition-opacity duration-200 flex-1 text-left ${open ? "opacity-100" : "opacity-0 invisible"}`}>
              Settings
            </span>

            {open && (
              <span className="mr-2 opacity-50 shrink-0">
                {settingsOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
              </span>
            )}
          </button>

          {open && settingsOpen && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-[var(--border)] pl-2">
              {[
                { to: "/companySetup", label: "Company Setup", icon: <FaBuilding /> },
                { to: "/userManagement", label: "User Management", icon: <FaUsers /> },
                { to: "/settings", label: "General Settings", icon: <FaCog /> },
              ].map((sub) => (
                <NavLink
                  key={sub.to}
                  to={sub.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      isActive ? "bg-primary text-white shadow-sm" : "text-muted hover:bg-row-hover hover:text-primary"
                    }`
                  }
                >
                  <span className="text-base shrink-0">{sub.icon}</span>
                  <span className="whitespace-nowrap">{sub.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* 3. BOTTOM USER SECTION - FIXED AT BOTTOM */}
      <div className="p-4 border-t border-[var(--border)] shrink-0 bg-sidebar">
        <div className={`flex items-center ${open ? "justify-between" : "flex-col gap-4"}`}>
          
          <div className="flex items-center gap-3 group relative overflow-hidden">
            {/* Avatar */}
            <div className="w-10 h-10 shrink-0 rounded-full bg-primary text-white font-bold flex items-center justify-center shadow-sm">
              {(() => {
                const name = localStorage.getItem("username") || "User";
                return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
              })()}
            </div>

            {/* User Info (Expanded only) */}
            {open && (
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-bold text-main text-sm truncate">
                  {localStorage.getItem("username") || "Admin User"}
                </span>
                <span className="text-muted text-[10px] uppercase font-black tracking-tighter">Administrator</span>
              </div>
            )}

            {/* Tooltip (Collapsed only) */}
            {!open && (
              <span className="absolute left-12 bg-card text-main text-xs px-3 py-1 rounded shadow-xl border border-[var(--border)] opacity-0 group-hover:opacity-100 whitespace-nowrap transition z-50">
                {localStorage.getItem("username") || "User"}
              </span>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-10 h-10 shrink-0 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;