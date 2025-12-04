import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaChartBar,
  FaMoneyBillWave,
  FaShoppingBag,
  FaBoxes,
  FaBriefcase,
  FaUsers,
  FaSignOutAlt,
  FaCog,
  FaUserTie,
  FaBuilding
} from "react-icons/fa";

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  { name: "Dashboard", to: "/dashboard", icon: <FaChartBar /> },
  { name: "Sales", to: "/sales", icon: <FaMoneyBillWave /> },
  { name: "CRM", to: "/crm", icon: <FaUsers /> },
  { name: "Procurement", to: "/procurement", icon: <FaShoppingBag /> },
  { name: "Inventory", to: "/inventory", icon: <FaBoxes /> },
  { name: "Accounting", to: "/accounting", icon: <FaBriefcase /> },
  { name: "Hr", to: "/hr", icon: <FaUserTie /> },
  { name: "User Management", to: "/userManagement", icon: <FaUsers /> },
  { name: "CompanySetup", to: "/companySetup", icon: <FaBuilding /> },
  { name: "Settings", to: "/settings", icon: <FaCog /> }
];

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col justify-between ${
          open ? "w-64" : "w-16"
        } h-screen bg-sidebar text-main fixed shadow-xl transition-all duration-300`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b shadow-sm">
            <div className="flex items-center space-x-2">
              {open && <h2 className="text-2xl font-semibold text-main">ERP</h2>}
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="text-2xl text-muted hover:text-primary focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex flex-col space-y-2 px-2">
            {menuItems.map((item) => (
              <NavLink
                to={item.to}
                key={item.name}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="text-xl nav-icon">{item.icon}</span>
                {open && <span className="nav-text">{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl btn-danger hover:opacity-95 transition"
          >
            <FaSignOutAlt className="text-lg" />
            {open && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bg-sidebar w-64 h-full p-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-main">ERP</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl text-muted hover:text-primary focus:outline-none"
                  aria-label="Close mobile sidebar"
                >
                  <FaBars />
                </button>
              </div>

              <nav className="flex flex-col space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    to={item.to}
                    key={item.name}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  >
                    <span className="text-xl nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Mobile Logout Button */}
            <div className="mt-4 border-t pt-4">
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl btn-danger hover:opacity-95 transition"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Toggle */}
      <div className="md:hidden p-4 fixed z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-2xl text-muted hover:text-primary focus:outline-none"
          aria-label="Open mobile sidebar"
        >
          <FaBars />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
