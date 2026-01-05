import React, { useState } from "react";
import {
  FaUserTie,
  FaUserFriends,
  FaClipboardList,
  FaCalendarDay,
  FaMoneyCheckAlt,
  FaChartLine,
  FaSlidersH,
} from "react-icons/fa";
import HrDashboard from "./HrDashboard";
import EmployeeManagement from "./EmployeeManagement/EmployeeManagement";
import PerformanceDevelopment from "./performance&growth/performancedevolpment";
import ComplianceManagement from "./compiliance/ComplianceManagement";
// import Attendance from './time_leave/Attendance';
// import LeaveManagement from './time_leave/LeaveManagement';
import TimeAttendance from "./time_leave/TimeAttendance";
import Payroll from "./Payroll";
import HRSettingsPage from "./hrsetup";
// import Recruitment from './EmployeeManagement/Recruitment';

const navTabs = [
  { key: "dashboard", label: "HR Dashboard", icon: <FaChartLine /> },
  { key: "Management", label: "Employee Management", icon: <FaUserFriends /> },
  { key: "attendance", label: "Time & Attendance", icon: <FaCalendarDay /> },
  { key: "performance", label: "Performance&Growth", icon: <FaChartLine /> },
  // {key : 'leave', label: 'Leave Management', icon: <FaClipboardList /> },

  // { key: 'attendance', label: 'Attendance', icon: <FaClipboardList /> },
  // { key: 'leave', label: 'Leave Management', icon: <FaCalendarDay /> },
  { key: "payroll", label: "Payroll", icon: <FaMoneyCheckAlt /> },
  
  {
    key: `compliance`,
    label: `Compliance Management`,
    icon: <FaClipboardList />,
  },
  {key:"settings", label:"Settings", icon:<FaSlidersH />},

];

const HrPayrollModule: React.FC = () => {
  const [tab, setTab] = useState(navTabs[0].key);

  return (
    <div className="bg-gray-50 min-h-screen p-8 pb-20">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaUserTie /> Human Resources
      </h1>

      {/* Navbar */}
      <div className="flex gap-8 mb-8 border-b border-gray-300">
        {navTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 pb-3 text-base font-medium transition border-b-4
              ${
                tab === t.key
                  ? "text-teal-600 border-teal-500"
                  : "text-gray-500 border-transparent hover:text-teal-600"
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tab === "dashboard" && <HrDashboard />}
        {tab === "Management" && <EmployeeManagement />}
        {tab === "attendance" && <TimeAttendance />}
        {/* {tab === 'attendance' && <Attendance />}
        {tab === 'leave' && <LeaveManagement />} */}
        {tab === "payroll" && <Payroll />}
        {/* {tab === 'recruitment' && <Recruitment />} */}
        {tab === "performance" && <PerformanceDevelopment />}
        {tab === "compliance" && <ComplianceManagement />}
        {tab === "settings" && <HRSettingsPage />}
      </div>
    </div>
  );
};

export default HrPayrollModule;
