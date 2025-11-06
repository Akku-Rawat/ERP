import React from 'react';
import { FaUser, FaClipboardList, FaCheckCircle, FaDollarSign } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';

const HrDashboard: React.FC = () => {
  // KPI Data
  const kpiData = [
    { label: 'Employees', value: '320', icon: <FaUser /> },
    { label: 'Attendance Present Today', value: '290', icon: <FaClipboardList /> },
    { label: 'Pending Approval', value: '8', icon: <FaCheckCircle /> },
    { label: 'Total This Month', value: '$500,200', icon: <FaDollarSign /> },
  ];

  // Employee Headcount Bar Chart Data
  const headcountData = [
    { month: 'Jan', employees: 190 },
    { month: 'Feb', employees: 205 },
    { month: 'Mar', employees: 185 },
    { month: 'Apr', employees: 195 },
    { month: 'May', employees: 205 },
    { month: 'Jun', employees: 210 },
    { month: 'Jul', employees: 205 },
    { month: 'Aug', employees: 235 },
    { month: 'Sep', employees: 210 },
    { month: 'Oct', employees: 220 },
  ];

  // Leave by Type Donut Chart Data
  const leaveData = [
    { name: 'Variation', value: 45 },
    { name: 'Personal Leave', value: 20 },
    { name: 'Sick Leave', value: 20 },
    { name: 'Other', value: 15 },
  ];

  const leaveColors = ['#1e40af', '#10b981', '#06b6d4', '#3b82f6'];

  // Attendance Overview Line Chart Data
  const attendanceData = [
    { month: 'Jan', present: 150, absent: 40 },
    { month: 'Feb', present: 180, absent: 50 },
    { month: 'Mar', present: 240, absent: 70 },
    { month: 'Apr', present: 260, absent: 85 },
    { month: 'May', present: 280, absent: 100 },
    { month: 'Jun', present: 260, absent: 120 },
    { month: 'Jul', present: 310, absent: 140 },
    { month: 'Aug', present: 320, absent: 145 },
    { month: 'Sep', present: 290, absent: 130 },
    { month: 'Oct', present: 300, absent: 125 },
    { month: 'Nov', present: 290, absent: 115 },
    { month: 'Dec', present: 315, absent: 140 },
    { month: 'Jan', present: 330, absent: 155 },
    { month: 'Aug', present: 340, absent: 160 },
  ];

  return (
    <div className="space-y-6">
     

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-800 mb-2">{kpi.value}</div>
            <div className="text-gray-600 text-sm">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Employee Headcount Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Employee Headcount</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={headcountData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="employees" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave by Type Donut Chart */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4">Leave by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leaveData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {leaveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={leaveColors[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            {leaveData.map((leave, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: leaveColors[idx] }}
                ></div>
                <span>{leave.name}: {leave.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Overview Line Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="present"
              stroke="#1e40af"
              strokeWidth={2}
              dot={{ fill: '#1e40af', r: 5 }}
              activeDot={{ r: 7 }}
              name="Present"
            />
            <Line
              type="monotone"
              dataKey="absent"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: '#06b6d4', r: 5 }}
              activeDot={{ r: 7 }}
              name="Absent"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HrDashboard;
