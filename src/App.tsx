import './App.css';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar';
import SalesModule from './views/Sales';
import ProcurementModule from './views/Procurement';
import InventoryModule from './views/Inventory';
import SupplierModule from './views/Supplier';
import AccountingModule from './views/Accounting';
import CrmModule from './views/Crm';


function App() {
  return (
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
        </Routes>
      </div>
    </div>
  );
}
export default App;
