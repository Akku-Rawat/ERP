import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-50 text-black fixed shadow-2xl">
      <div className="p-4 border-b shadow-sm">
        <h2 className="text-2xl font-semibold text-black">ERP</h2>
      </div>

      <nav className="mt-6">
        <a
          href="#dashboard"
          className="block py-2.5 px-4 rounded-2xl transition duration-200 hover:bg-teal-600 bg-teal-700 text-white"
        >
          Dashboard
        </a>
        <a
          href="#sales"
          className="block py-2.5 px-4 rounded-2xl transition duration-200 hover:bg-gray-200"
        >
          Sales Management
        </a>
        <a
          href="#procurement"
          className="block py-2.5 px-4 rounded-2xl transition duration-200 hover:bg-gray-200"
        >
          Procurement
        </a>
        <a
          href="#inventory"
          className="block py-2.5 px-4 rounded-2xl transition duration-200 hover:bg-gray-200"
        >
          Inventory Management
        </a>
        <a
          href="#suppliers"
          className="block py-2.5 px-4 rounded-2xl transition duration-200 hover:bg-gray-200"
        >
          Supplier Management
        </a>
        <a
          href="#accounting"
          className="block py-2.5 px-4 rounded-2xl transition duration-200 hover:bg-gray-200"
        >
          Accounting
        </a>
        <a
          href="#crm"
          className="block py-2.5 px-4 rounded-2xl transition duration-200 hover:bg-gray-200"
        >
          CRM
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
