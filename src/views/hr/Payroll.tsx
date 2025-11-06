import React, { useState } from 'react';
import { FaUsers, FaChevronDown, FaUserCircle } from 'react-icons/fa';

type PayrollRecord = {
  id: string;
  employeeName: string;
  department: string;
  grade: string;
  grossPay: number;
  netPay: number;
  status: 'Paid' | 'Pending' | 'Verified';
};

const demoPayrollRecords: PayrollRecord[] = [
  { id: 'P001', employeeName: 'Jenny Wilson', department: 'Sales', grade: 'G4', grossPay: 81000, netPay: 15000, status: 'Paid' },
  { id: 'P002', employeeName: 'Darrell Steward', department: 'Marketing', grade: 'G3', grossPay: 81000, netPay: 15000, status: 'Pending' },
  { id: 'P003', employeeName: 'Eleanor Pena', department: 'HR', grade: 'G5', grossPay: 81000, netPay: 31000, status: 'Paid' },
  { id: 'P004', employeeName: 'Cody Fisher', department: 'Sales', grade: 'G4', grossPay: 13000, netPay: 16200, status: 'Pending' },
  { id: 'P005', employeeName: 'Jerome Bell', department: 'Jerome', grade: 'G5', grossPay: 75000, netPay: 13600, status: 'Paid' },
  { id: 'P006', employeeName: 'Marvin McKinney', department: 'HR', grade: 'G', grossPay: 23000, netPay: 32000, status: 'Pending' },
];

const Payroll: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [filteredRecords, setFilteredRecords] = useState(demoPayrollRecords);

  const handleDepartmentFilter = (dept: string) => {
    setSelectedDept(dept);
    if (dept === 'All Departments') {
      setFilteredRecords(demoPayrollRecords);
    } else {
      setFilteredRecords(demoPayrollRecords.filter(record => record.department === dept));
    }
  };

  // Calculate totals
  const totalGrossPay = filteredRecords.reduce((sum, record) => sum + record.grossPay, 0);
  const totalNetPay = filteredRecords.reduce((sum, record) => sum + record.netPay, 0);
  const totalDeductions = totalGrossPay - totalNetPay;

  return (
    <div className="space-y-6">
      {/* Header with User Profile */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2 text-gray-700">
          <FaUserCircle className="text-2xl text-gray-400" />
          <span className="font-semibold">John Doe</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* Headcount */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Headcount</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">120</p>
        </div>

        {/* Monthly Hires */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Monthly Hires</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">5</p>
        </div>

        {/* Voluntary Leaves */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Voluntary Leaves</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">8</p>
        </div>

        {/* Next Payday */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Next Payday</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">30 Apr 2024</p>
        </div>
      </div>

      {/* Payroll Section */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payroll</h2>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white">
              Department <FaChevronDown className="text-xs" />
            </button>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white">
            Filter
          </button>
        </div>

        {/* Payroll Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-gray-300">
              <tr className="text-gray-700 font-semibold">
                <th className="py-4 px-4">Employee</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Grade</th>
                <th className="py-4 px-4">Gross Pay</th>
                <th className="py-4 px-4">Net Pay</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-2xl text-gray-400" />
                      <span className="font-medium text-gray-800">{record.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{record.department}</td>
                  <td className="py-4 px-4 text-gray-600">{record.grade}</td>
                  <td className="py-4 px-4 text-gray-800 font-medium">₹ {record.grossPay.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-800 font-medium">₹ {record.netPay.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : record.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Row */}
        <div className="border-t-2 border-gray-300 pt-4">
          <div className="grid grid-cols-3 gap-8 text-lg">
            <div>
              <p className="text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">₹ {totalGrossPay.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Deductions</p>
              <p className="text-2xl font-bold text-gray-800">₹ {totalDeductions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Net Pay</p>
              <p className="text-2xl font-bold text-gray-800">₹ {totalNetPay.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Run Payroll Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
          Run Payroll
        </button>
      </div>
    </div>
  );
};

export default Payroll;
