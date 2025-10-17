import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './views/LoginPage';
import Sidebar from './components/SideBar';

import SalesModule from './views/Sales/Sales';
import ProcurementModule from './views/Procurement';
import InventoryModule from './views/Inventory';
import SupplierModule from './views/Supplier';
import AccountingModule from './views/Accounting';
import CrmModule from './views/Crm';

const AppLayout: React.FC = () => (
  <div className="flex min-h-screen">
     <div className="w-64">
      <Sidebar />
    </div>

    <div className="flex-1 bg-gray-50">
      <Routes>
        <Route path="/sales" element={<SalesModule />} />
        <Route path="/procurement" element={<ProcurementModule />} />
        <Route path="/inventory" element={<InventoryModule />} />
        <Route path="/suppliers" element={<SupplierModule />} />
        <Route path="/accounting" element={<AccountingModule />} />
        <Route path="/crm" element={<CrmModule />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  </div>
);

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