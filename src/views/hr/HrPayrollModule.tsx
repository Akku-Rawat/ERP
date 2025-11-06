import React, { useState } from 'react';
import { FaUsers, FaClipboardList, FaCalendarDay, FaMoneyCheckAlt, FaChartLine, FaUserPlus } from 'react-icons/fa';
import HrDashboard from './HrDashboard';
import EmployeeDirectory from './EmployeeDirectory';
import Attendance from './Attendance';
import LeaveManagement from './LeaveManagement';
import Payroll from './Payroll';
import Recruitment from './Recruitment';

const navTabs = [
  { key: 'dashboard', label: 'HR Dashboard', icon: <FaChartLine /> },
  { key: 'directory', label: 'Employee Directory', icon: <FaUsers /> },
  { key: 'recruitment', label: 'Recruitment', icon: <FaUserPlus /> },
  { key: 'attendance', label: 'Attendance', icon: <FaClipboardList /> },
  { key: 'leave', label: 'Leave Management', icon: <FaCalendarDay /> },
  { key: 'payroll', label: 'Payroll', icon: <FaMoneyCheckAlt /> },
   
];

const HrPayrollModule: React.FC = () => {
  const [tab, setTab] = useState(navTabs[0].key);

  return (
    <div className="bg-gray-50 min-h-screen p-8 pb-20">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaUsers /> Human Resources
      </h1>

      {/* Navbar */}
      <div className="flex gap-8 mb-8 border-b border-gray-300">
        {navTabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 pb-3 text-base font-medium transition border-b-4
              ${tab === t.key
                ? 'text-teal-600 border-teal-500'
                : 'text-gray-500 border-transparent hover:text-teal-600'
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tab === 'dashboard' && <HrDashboard />}
        {tab === 'directory' && <EmployeeDirectory />}
        {tab === 'attendance' && <Attendance />}
        {tab === 'leave' && <LeaveManagement />}
        {tab === 'payroll' && <Payroll />}
        {tab === 'recruitment' && <Recruitment />}
      </div>
    </div>
  );
};

export default HrPayrollModule;