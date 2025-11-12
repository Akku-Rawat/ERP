 import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes";
import Login from "../views/LoginPage";
import AppLayout from "../layout/AppLayout"; 
import Dashboard from "../views/DashbBoard";
import SalesModule from "../views/Sales/Sales";
import ProcurementModule from "../views/Procurement/Procurement";
import InventoryModule from "../views/Inventory/Inventory";
import SupplierModule from "../views/Supplier/Suppliers";
import AccountingModule from "../views/Accounting/Accounting";
import CrmModule from "../views/Crm/Crm";
import Settings from "../views/Settings";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<SalesModule />} />
          <Route path="/procurement" element={<ProcurementModule />} />
          <Route path="/inventory" element={<InventoryModule />} />
          <Route path="/suppliers" element={<SupplierModule />} />
          <Route path="/accounting" element={<AccountingModule />} />
          <Route path="/crm" element={<CrmModule />} />
          <Route path="settings" element={<Settings/>}/>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
