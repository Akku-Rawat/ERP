import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaChartBar,
  FaMoneyBillWave,
  FaShoppingBag,
  FaBoxes,
  FaBriefcase,
  FaUsers,
  FaHandshake,
} from "react-icons/fa";

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  { name: "Dashboard", to: "/dashboard", icon: <FaChartBar /> },
  { name: "Sales Management", to: "/sales", icon: <FaMoneyBillWave /> },
  { name: "Procurement", to: "/procurement", icon: <FaShoppingBag /> },
  { name: "Inventory Management", to: "/inventory", icon: <FaBoxes /> },
  { name: "Supplier Management", to: "/suppliers", icon: <FaHandshake /> },
  { name: "Accounting", to: "/accounting", icon: <FaBriefcase /> },
  { name: "CRM", to: "/crm", icon: <FaUsers /> },
];

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <>
      {/* Desktop Sidebar (fixed) */}
      <div
        className={`hidden md:flex flex-col ${
          open ? "w-64" : "w-16"
        } h-screen bg-gray-50 text-black fixed shadow-xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4 border-b shadow-sm">
          <div className="flex items-center space-x-2">
             {open && (
              <h2 className="text-2xl font-semibold text-black">ERP</h2>
            )}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl text-gray-600 hover:text-teal-700 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
        </div>

        <nav className="mt-6 flex flex-col space-y-2">
          {menuItems.map((item) => (
            <NavLink
              to={item.to}
              key={item.name}
              className={({ isActive }) =>
                `flex items-center py-2.5 px-4 rounded-2xl transition duration-200 ${
                  isActive
                    ? "bg-teal-700 text-white"
                    : "hover:bg-gray-200 text-gray-700"
                }`
              }
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {open && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar (overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bg-gray-50 w-64 h-full p-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">ERP</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-2xl text-gray-600 hover:text-teal-700 focus:outline-none"
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
                  className={({ isActive }) =>
                    `flex items-center py-2.5 px-4 rounded-2xl transition duration-200 ${
                      isActive
                        ? "bg-teal-700 text-white"
                        : "hover:bg-gray-200 text-gray-700"
                    }`
                  }
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile toggle button */}
      <div className="md:hidden p-4 fixed z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-2xl text-gray-600 hover:text-teal-700 focus:outline-none"
          aria-label="Open mobile sidebar"
        >
          <FaBars />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
