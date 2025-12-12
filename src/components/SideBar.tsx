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
    // remove only auth token (avoid clearing all stored prefs)
    localStorage.removeItem("authToken");
    console.log("User logged out");
    navigate("/login");
  };

  // treat settings group as active for these routes
  const settingsRoutes = ["/settings", "/companySetup", "/userManagement"];
  const isSettingsRoute = settingsRoutes.some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <div
      className={`md:flex flex-col justify-between ${
        open ? "w-64" : "w-16"
      } h-screen bg-sidebar fixed shadow-xl transition-all duration-300 overflow-hidden`}
      aria-hidden={false}
    >
      <div>
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shadow-sm">
          <div className="flex items-center space-x-3">
            {open && <h2 className="text-2xl font-bold text-primary">ERP</h2>}
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-2xl text-muted hover:text-primary focus:outline-none transition"
            aria-label="Toggle sidebar"
            aria-expanded={open}
          >
            <FaBars />
          </button>
        </div>

        <nav
          role="navigation"
          aria-label="Main menu"
          className="mt-6 flex flex-col space-y-1 px-2"
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                `nav-link relative group ${isActive ? "active" : ""}`
              }
            >
              <span className="text-xl nav-icon">{item.icon}</span>

              {open && <span className="font-medium nav-text">{item.name}</span>}

              {!open && (
                <span className="absolute left-16 bg-card text-main text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                  {item.name}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`nav-link relative w-full group ${
                settingsOpen || isSettingsRoute ? "active" : ""
              }`}
              aria-expanded={settingsOpen || isSettingsRoute}
            >
              <div className="flex items-center gap-3">
                <FaCog className="text-xl nav-icon" />
                {open && <span className="font-medium nav-text">Settings</span>}
              </div>

              {open && (
                <span className="text-sm ml-auto nav-icon">
                  {settingsOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}

              {!open && (
                <span className="absolute left-16 bg-card text-main text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-10 shadow-md">
                  Settings
                </span>
              )}
            </button>

            {open && settingsOpen && (
              <div className="ml-9 mt-1 space-y-1">
                <NavLink
                  key="companySetup"
                  to="/companySetup"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 pl-6 pr-4 rounded-r-xl text-sm transition-all ${
                      isActive
                        ? "bg-primary-600 text-white font-medium"
                        : "text-muted hover:bg-row-hover hover:text-primary"
                    }`
                  }
                >
                  <FaBuilding className="text-lg" />
                  <span>Company Setup</span>
                </NavLink>

                <NavLink
                  key="userManagement"
                  to="/userManagement"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 pl-6 pr-4 rounded-r-xl text-sm transition-all ${
                      isActive
                        ? "bg-primary-600 text-white font-medium"
                        : "text-muted hover:bg-row-hover hover:text-primary"
                    }`
                  }
                >
                  <FaUsers className="text-lg" />
                  <span>User Management</span>
                </NavLink>

                <NavLink
                  key="generalSettings"
                  to="/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 pl-6 pr-4 rounded-r-xl text-sm transition-all ${
                      isActive
                        ? "bg-primary-600 text-white font-medium"
                        : "text-muted hover:bg-row-hover hover:text-primary"
                    }`
                  }
                >
                  <FaCog className="text-lg" />
                  <span>General Settings</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
      

     {/* Bottom User Section */}
{/* Bottom User Panel: collapsed = avatar above logout; expanded = left user / right logout */}
<div className="p-4 border-t border-[var(--border)]">
  <div
    className={`w-full ${open ? "flex items-center justify-between" : "flex flex-col items-center gap-3"}`}
  >
    {/* LEFT / TOP: Avatar + name (name only when expanded) */}
    <div className={`flex items-center gap-3 group relative ${open ? "cursor-pointer" : ""}`}>
      {/* Avatar (initials from localStorage) */}
      <div
        aria-hidden="true"
        className="w-10 h-10 rounded-full bg-primary from-primary to-primary/70 text-white font-semibold flex items-center justify-center shadow-sm"
      >
        {(() => {
          const username = typeof window !== "undefined" ? localStorage.getItem("username") || "User" : "User";
          return username
            .split(" ")
            .filter(Boolean)
            .map(n => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
        })()}
      </div>

      {/* Username + role (visible only when expanded) */}
      {open && (
        <div className="flex flex-col leading-tight">
          <span className="font-medium text-main text-sm">
            {typeof window !== "undefined" ? localStorage.getItem("username") || "User" : "User"}
          </span>
          <span className="text-muted text-xs">Administrator</span>
        </div>
      )}

      {/* Tooltip when collapsed */}
      {!open && (
        <span className="absolute left-12 bg-card text-main text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 group-focus:opacity-100 whitespace-nowrap transition">
          {typeof window !== "undefined" ? localStorage.getItem("username") || "User" : "User"} • Admin
        </span>
      )}
    </div>

    {/* RIGHT / BOTTOM: logout icon only */}
    <button
      onClick={handleLogout}
      aria-label="Logout"
      className={`rounded-full shadow-sm transition active:scale-95 flex items-center justify-center ${
        open ? "w-10 h-10 bg-red-500 hover:bg-red-600 text-white" : "w-10 h-10 bg-red-500 hover:bg-red-600 text-white"
      }`}
    >
      <FaSignOutAlt className="text-base" />
    </button>
  </div>
</div>


    </div>
  );
};

export default Sidebar;
