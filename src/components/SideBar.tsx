import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaChartBar,
  FaMoneyBillWave,
  FaShoppingCart,
  FaBoxes,
  FaIndustry,
  FaBriefcase,
  FaUsers
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", to: "/dashboard", icon: <FaChartBar /> },
  { name: "Sales Management", to: "/sales", icon: <FaMoneyBillWave /> },
  { name: "Procurement", to: "/procurement", icon: <FaShoppingCart /> },
  { name: "Inventory Management", to: "/inventory", icon: <FaBoxes /> },
  { name: "Supplier Management", to: "/suppliers", icon: <FaIndustry /> },
  { name: "Accounting", to: "/accounting", icon: <FaBriefcase /> },
  { name: "CRM", to: "/crm", icon: <FaUsers /> }
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          open ? "w-64" : "w-16"
        } h-screen bg-gray-50 text-black fixed shadow-2xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4 border-b shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500 text-xl">⚡</span>
            {open && (
              <h2 className="text-2xl font-semibold text-black">ERP Pro</h2>
            )}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl text-gray-600 hover:text-teal-700 focus:outline-none"
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

  
      <div
        className={`flex-1 ml-${open ? "64" : "16"} transition-all duration-300`}
      >
      
      </div>
    </div>
  );
};

export default Sidebar;
