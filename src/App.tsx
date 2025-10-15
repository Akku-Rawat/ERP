import './App.css'
import LoginPage from '../src/views/LoginPage'
import Sidebar from './components/SideBar'
import SalesModule from './views/Sales'
import ProcurementModule from './views/Procurement'

function App() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar (fixed width) */}
      <div className="w-64">
        <Sidebar />
      </div>

       {/* <div className="flex-1 bg-gray-50">
        <SalesModule />
      </div> */}
       <div className="flex-1 bg-gray-50">
        <ProcurementModule />
      </div>
    </div>
  );
}

export default App;

