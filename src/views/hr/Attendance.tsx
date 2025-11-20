import React, { useState } from 'react';
import { Calendar, Clock, UserLock, ArrowRight, Edit2, Trash2 } from 'lucide-react';
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
  const [selectedDate] = useState('November 2025');
  const [viewMode, setViewMode] = useState<'Today' | 'Monthly'>('Today');

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete attendance record for "${name}"?`)) {
      alert("Delete functionality ready — connect to API later");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* Header with Date Picker */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" />
            <input
              type="text"
              value={selectedDate}
              readOnly
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6">
          {/* Total Work Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Work Hours</p>
                <p className="text-3xl font-bold text-indigo-600">1,850</p>
              </div>
              <Clock className="text-indigo-500 w-8 h-8" />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className={`px-4 py-1 rounded text-sm font-medium ${
                  viewMode === 'Today'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setViewMode('Today')}
              >
                Today
              </button>
              <button
                className={`px-4 py-1 rounded text-sm font-medium ${
                  viewMode === 'Monthly'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setViewMode('Monthly')}
              >
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
              <UserLock className="text-blue-500 w-8 h-8" />
            </div>
          </div>

          {/* Absent Today */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Absent Today</p>
                <p className="text-3xl font-bold text-red-600">3</p>
              </div>
              <Calendar className="text-red-500 w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Main Content - Table and Summary */}
        <div className="grid grid-cols-3 gap-6">
          {/* Attendance Table */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Employee Attendance Record</h3>
              <div className="flex gap-2 items-center">
                <button className="text-gray-400 hover:text-gray-600">
                  <Calendar className="w-5 h-5" />
                </button>
                <span className="text-gray-400 text-sm">calendar</span>
                <button className="text-indigo-600 hover:text-indigo-800">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
                  <tr>
                    <th className="px-6 py-4 text-left">Attendance ID</th>
                    <th className="px-6 py-4 text-left">Employee Name</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Check-In</th>
                    <th className="px-6 py-4 text-left">Break Min</th>
                    <th className="px-6 py-4 text-left">Total Hours</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {demoAttendanceRecords.map(record => (
                    <tr
                      key={record.id}
                      className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                        {record.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {record.employeeName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{record.date}</td>
                      <td className="px-6 py-4 text-gray-700">{record.checkIn}</td>
                      <td className="px-6 py-4 text-gray-600">{record.breakMin}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {record.totalHoursRatio}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            record.status === 'Present'
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'Late'
                              ? 'bg-yellow-100 text-yellow-800'
                              : record.status === 'Early Departure'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Edit functionality
                            }}
                            className="text-indigo-600 hover:text-indigo-800 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(record.id, record.employeeName, e)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {demoAttendanceRecords.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  No attendance records found.
                </div>
              )}
            </div>
          </div>

          {/* Attendance Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Attendance Summary</h3>

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
                <p className="text-2xl font-bold text-indigo-600">12%</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-gray-700">88% On-Time vs Late</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>
                    Late Arrivals: 15 <span className="float-right">A0</span>
                  </p>
                  <p>
                    Early Departures: 8 <span className="float-right">B</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition">
                View Reports
              </button>
              <button className="flex-1 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-semibold transition">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
