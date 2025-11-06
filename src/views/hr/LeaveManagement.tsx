import React, { useState } from 'react';
import { FaCalendarAlt, FaDollarSign, FaCheckCircle, FaUserCircle, FaPlay, FaCheck, FaTimes } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

type LeaveRequest = {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  breakTime: string;
  totalHours: string;
  status: 'Pending' | 'Rejected' | 'Pending' | 'Reallit';
};

type LeaveBalance = {
  leaveType: string;
  balance: number;
  used: number;
};

const demoLeaveRequests: LeaveRequest[] = [
  { id: 'LR001', employeeName: 'Total Work Name', date: 'Nov 20,2025', checkIn: '8.55 AM', breakTime: '0.50', totalHours: '7.55 hrs', status: 'Rejected' },
  { id: 'LR002', employeeName: 'John Smith', date: '8.55 AM', checkIn: '5Ake', breakTime: '16 min', totalHours: '46 min', status: 'Pending' },
  { id: 'LR003', employeeName: 'Bevelopment', date: 'Nov 15,2025', checkIn: '25 min', breakTime: '41 min', totalHours: '40 min', status: 'Pending' },
  { id: 'LR004', employeeName: 'Development', date: '8.55 AM', checkIn: '40 min', breakTime: '45 min', totalHours: '7.53 hrs', status: 'Pending' },
  { id: 'LR005', employeeName: 'Bevelopment', date: '16 15.2017', checkIn: '8AM', breakTime: '2.60', totalHours: '7.92 hrs', status: 'Pending' },
  { id: 'LR006', employeeName: 'Bame Smith', date: '1580.2017', checkIn: '8AAT', breakTime: '2.80', totalHours: '7.55 hrs', status: 'Reallit' },
  { id: 'LR007', employeeName: 'John Smith', date: '13.80.2017', checkIn: '8AM', breakTime: '2.80', totalHours: '7.53 hrs', status: 'Pending' },
  { id: 'LR004', employeeName: 'Development', date: '8.55 AM', checkIn: '40 min', breakTime: '45 min', totalHours: '7.53 hrs', status: 'Pending' },
  { id: 'LR005', employeeName: 'Bevelopment', date: '16 15.2017', checkIn: '8AM', breakTime: '2.60', totalHours: '7.92 hrs', status: 'Pending' },
  { id: 'LR006', employeeName: 'Bame Smith', date: '1580.2017', checkIn: '8AAT', breakTime: '2.80', totalHours: '7.55 hrs', status: 'Reallit' },
  { id: 'LR007', employeeName: 'John Smith', date: '13.80.2017', checkIn: '8AM', breakTime: '2.80', totalHours: '7.53 hrs', status: 'Pending' },];

const leaveTypeDistributionData = [
  { name: 'Vacation', value: 35 },
  { name: 'Offies', value: 25 },
  { name: 'Malles', value: 20 },
  { name: 'Sick Duties', value: 20 },
];

const leaveTypeColors = ['#14b8a6', '#1e40af', '#ef4444', '#06b6d4'];

const LeaveManagement: React.FC = () => {
  const [selectedLeave, setSelectedLeave] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Reallit':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== TOP KPI CARDS ===== */}
      <div className="grid grid-cols-3 gap-6">
        {/* Total Leave Requests */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Leave Requests:</p>
            <p className="text-4xl font-bold text-teal-600">$485,000</p>
          </div>
          <FaCalendarAlt className="text-teal-500 text-3xl" />
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Pending Approvals</p>
            <p className="text-4xl font-bold text-orange-600">7</p>
            <FaCheckCircle className="text-orange-500 text-lg mt-2" />
          </div>
          <FaDollarSign className="text-orange-500 text-3xl" />
        </div>

        {/* Approved Leaves (YTD) */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Approved Leaves (YTD)</p>
            <p className="text-4xl font-bold text-teal-600">250</p>
            <FaCheckCircle className="text-orange-500 text-lg mt-2" />
          </div>
          <div className="flex gap-2">
            <button className="text-gray-600 hover:text-gray-800">View Profile</button>
            <button className="text-gray-400">⋮</button>
          </div>
        </div>
      </div>

      {/* ===== ACTION BUTTON ===== */}
      <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2">
        Request new leave
      </button>

      {/* ===== MAIN CONTENT - Table and Charts ===== */}
      <div className="grid grid-cols-3 gap-6">
        {/* LEFT: Pending Leave Requests Table */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Pending Leave Requests</h2>
          
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-gray-200">
              <tr className="text-gray-700 font-semibold">
                <th className="py-3 px-4">Payroll ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Clock In</th>
                <th className="py-3 px-4">Break dian</th>
                <th className="py-3 px-4">Total Heurs Patus</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoLeaveRequests.map(leave => (
                <tr key={leave.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{leave.employeeName}</td>
                  <td className="py-3 px-4 text-gray-600">{leave.date}</td>
                  <td className="py-3 px-4 text-gray-600">{leave.checkIn}</td>
                  <td className="py-3 px-4 text-gray-600">{leave.breakTime}</td>
                  <td className="py-3 px-4 text-gray-600">{leave.totalHours}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT COLUMN: Charts & Info */}
        <div className="space-y-6">
          {/* Leave Type Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-6">Leave Type Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">On-Time vs (TD)</p>
            
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={leaveTypeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {leaveTypeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={leaveTypeColors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-6 space-y-2">
              {leaveTypeDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: leaveTypeColors[idx] }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Leave Balances */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Employee Leave Balances</h3>
            
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold mb-4 flex items-center gap-2 transition">
              <FaCheck />  Approve 
            </button>
            
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50 transition">
              <FaTimes />  Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
