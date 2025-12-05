import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  { name: "CRM", to: "/crm", icon: <FaUsers /> },
  { name: "Procurement", to: "/procurement", icon: <FaShoppingBag /> },
  { name: "Inventory", to: "/inventory", icon: <FaBoxes /> },
  { name: "Accounting", to: "/accounting", icon: <FaBriefcase /> },
  { name: "Hr", to: "/hr", icon: <FaUserTie /> },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <div
      className={` md:flex flex-col justify-between ${
        open ? "w-64" : "w-16"
      } h-screen bg-gray-50 text-black fixed shadow-xl transition-all duration-300 overflow-hidden`}
    >
      <div>
        <div className="flex items-center justify-between p-4 border-b shadow-sm">
          <div className="flex items-center space-x-3">
            {open && <h2 className="text-2xl font-bold text-teal-700">ERP</h2>}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl text-gray-600 hover:text-teal-700 focus:outline-none transition"
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
        </div>

        <nav className="mt-6 flex flex-col space-y-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-teal-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {open && <span className="font-medium">{item.name}</span>}
              {!open && (
                <span className="absolute left-16 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-2">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-full flex items-center justify-between gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                settingsOpen || location.pathname.startsWith("/settings")
                  ? "bg-teal-700 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <FaCog className="text-xl" />
                {open && <span className="font-medium">Settings</span>}
              </div>
              {open && (
                <span className="text-sm">
                  {settingsOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
              {!open && (
                <span className="absolute left-16 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Settings
                </span>
              )}
            </button>

            {open && settingsOpen && (
              <div className="ml-9 mt-1 space-y-1  border-teal-600">
                <NavLink
                  to="/companySetup"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 pl-6 pr-4 rounded-r-xl text-sm transition-all ${
                      isActive
                        ? "bg-teal-600 text-white font-medium"
                        : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
                    }`
                  }
                >
                  <FaBuilding className="text-lg" />
                  <span>Company Setup</span>
                </NavLink>

                <NavLink
                  to="/userManagement"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 pl-6 pr-4 rounded-r-xl text-sm transition-all ${
                      isActive
                        ? "bg-teal-600 text-white font-medium"
                        : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
                    }`
                  }
                >
                  <FaUsers className="text-lg" />
                  <span>User Management</span>
                </NavLink>

                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 pl-6 pr-4 rounded-r-xl text-sm transition-all ${
                      isActive
                        ? "bg-teal-600 text-white font-medium"
                        : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
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

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-red-700 text-white hover:bg-red-800 transition font-medium shadow-md"
        >
          <FaSignOutAlt className="text-lg" />
          {open && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
