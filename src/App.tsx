import React, { useState } from "react";
 import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './views/LoginPage';
import Sidebar from './components/SideBar';

import SalesModule from './views/Sales/Sales';
import ProcurementModule from './views/Procurement/Procurement';
import InventoryModule from './views/Inventory/Inventory';
import SupplierModule from './views/Supplier/SupplierManagment';
import AccountingModule from './views/Accounting/Accounting';
import CrmModule from './views/Crm/Crm';

const AppLayout: React.FC = () => {
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

          <Route path="*" element={<Navigate to="/dashboard" replace />} /> {/* Assuming you have a dashboard; adjust if needed */}
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* All other routes need auth */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<AppLayout />} />
        </Route>

        {/* Root redirects to login if not authenticated */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;