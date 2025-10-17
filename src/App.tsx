import React, { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar"; // keep name consistent with your file
import SalesModule from "./views/Sales/Sales";
import ProcurementModule from "./views/Procurement/Procurement";
import InventoryModule from "./views/Inventory/Inventory";
import SupplierModule from "./views/Supplier/Supplier-Managment";
import AccountingModule from "./views/Accounting/Accounting";
import CrmModule from "./views/Crm/Crm";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar handles its own fixed positioning */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content: uses md:ml-64 or md:ml-16 depending on sidebar state */}
      <div
        className={`flex-1 transition-all duration-300 bg-gray-50 ${
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <Routes>
          <Route path="/sales" element={<SalesModule />} />
          <Route path="/procurement" element={<ProcurementModule />} />
          <Route path="/inventory" element={<InventoryModule />} />
          <Route path="/suppliers" element={<SupplierModule />} />
          <Route path="/accounting" element={<AccountingModule />} />
          <Route path="/crm" element={<CrmModule />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
