import './App.css';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar';
import SalesModule from './views/Sales';
import ProcurementModule from './views/Procurement';


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
        </Routes>
      </div>
    </div>
  );
}
export default App;
