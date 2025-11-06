import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUserClock, FaChartPie, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

type AttendanceRecord = {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  breakMin: string;
  totalHoursRatio: string;
  status: 'Present' | 'Late' | 'Early Departure' | 'Absent';
};

const demoAttendanceRecords: AttendanceRecord[] = [
  { id: 'A001', employeeName: 'John Smith', date: 'Nov 15, 2025', checkIn: '8.55 AM', breakMin: '0.50', totalHoursRatio: '7.51 hrs', status: 'Present' },
  { id: 'A002', employeeName: 'Betni Smei', date: '8.55 AM', checkIn: '5.00 AM', breakMin: '1.0h', totalHoursRatio: '45 min', status: 'Present' },
  { id: 'A003', employeeName: 'Bevelopment', date: 'Nov 15, 2025', checkIn: '45 min', breakMin: '45 min', totalHoursRatio: '7.52 hrs', status: 'Present' },
  { id: 'A004', employeeName: 'Bevelapment', date: 'Nov 15, 2025', checkIn: '8AM', breakMin: '18.50', totalHoursRatio: '7.52 hrs', status: 'Present' },
  { id: 'A005', employeeName: 'Bevelopment', date: '8.55 AM', checkIn: '8AM', breakMin: '2.50', totalHoursRatio: '7.50 hrs', status: 'Present' },
  { id: 'A006', employeeName: 'John Smith', date: 'Nov 15, 2025', checkIn: '8M.V', breakMin: '2.50', totalHoursRatio: '7.50 hrs', status: 'Present' },
];

const attendanceSummaryData = [
  { name: 'On-Time vs Late', value: 88 },
  { name: 'Late', value: 12 },
];

const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('November 2025');
  const [viewMode, setViewMode] = useState<'Today' | 'Monthly'>('Today');

  return (
    <div className="space-y-6">
      {/* Header with Date Picker */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500" />
          <input
            type="text"
            value={selectedDate}
            readOnly
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="text-teal-600 hover:text-teal-800">View Profile</button>
          <button className="text-gray-400 hover:text-gray-600">
            <FaChartPie />
          </button>
          <button className="text-gray-400 hover:text-gray-600">⋮</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Total Work Hours */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Work Hours</p>
              <p className="text-3xl font-bold text-teal-600">1,850</p>
            </div>
            <FaClock className="text-teal-500 text-3xl" />
          </div>
          <div className="flex gap-2 mt-4">
            <button className={`px-4 py-1 rounded text-sm font-medium ${viewMode === 'Today' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`} onClick={() => setViewMode('Today')}>
              Today
            </button>
            <button className={`px-4 py-1 rounded text-sm font-medium ${viewMode === 'Monthly' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`} onClick={() => setViewMode('Monthly')}>
              Monthly
            </button>
          </div>
        </div>

        {/* Average Daily Presence */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Daily Presence</p>
              <p className="text-3xl font-bold text-gray-800">7.5 hrs</p>
            </div>
            <FaUserClock className="text-blue-500 text-3xl" />
          </div>
        </div>

        {/* Absent Today */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Absent Today</p>
              <p className="text-3xl font-bold text-red-600">3</p>
            </div>
            <FaCalendarAlt className="text-red-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Main Content - Table and Summary */}
      <div className="grid grid-cols-3 gap-6">
        {/* Attendance Table */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Employee Attendance Record</h3>
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-gray-600">
                <FaCalendarAlt />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                calendar
              </button>
              <button className="text-teal-600 hover:text-teal-800">
                <FaArrowRight />
              </button>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-gray-200">
              <tr className="text-gray-600">
                <th className="py-3 px-2">Employee Name</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Check-In</th>
                <th className="py-3 px-2">Break Min</th>
                <th className="py-3 px-2">Total Hours Ratio</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoAttendanceRecords.map(record => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{record.employeeName}</td>
                  <td className="py-3 px-2 text-gray-600">{record.date}</td>
                  <td className="py-3 px-2 text-gray-600">{record.checkIn}</td>
                  <td className="py-3 px-2 text-gray-600">{record.breakMin}</td>
                  <td className="py-3 px-2 font-medium">{record.totalHoursRatio}</td>
                  <td className="py-3 px-2">
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Attendance Summary Card */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Attendance Summary</h3>

          {/* Donut Chart */}
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={attendanceSummaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="#14b8a6" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">On-Time vs Late</p>
              <p className="text-2xl font-bold text-teal-600">12%</p>
            </div>

            <div className="bg-gray-50 rounded p-3 space-y-2">
              <p className="text-xs font-semibold text-gray-700">88% On-Time vs Late</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>Late Arrivals: 15 <span className="float-right">A0</span></p>
                <p>Early Departures: 8 <span className="float-right">B</span></p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition">
              View Reports
            </button>
            <button className="flex-1 border border-teal-500 text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg font-semibold transition">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
