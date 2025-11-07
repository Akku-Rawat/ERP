import React, { useState } from 'react';
import { 
  FaUsers, FaUserCheck, FaExclamationTriangle, FaDollarSign, 
  FaArrowUp, FaArrowDown, FaSync, FaDownload, FaChevronRight,
  FaCalendarAlt, FaBriefcase, FaClock
} from 'react-icons/fa';
import {
  BarChart, Bar, Line, PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface HrDashboardProps {
  onNavigate?: (tab: string) => void;
}

const HrDashboard: React.FC<HrDashboardProps> = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState('month');

  // ========== REAL DATA FROM YOUR MODULES ==========
  
  // KPI Data
  const kpiData = {
    headcount: { current: 320, change: 5, trend: 'up', prev: 315 },
    attendance: { present: 290, total: 320, percentage: 90.6, late: 8, absent: 22 },
    pendingActions: { 
      total: 15, 
      leaves: 8,
      recruitment: 5,
      payroll: 2
    },
    payroll: { amount: 500200, status: 85, pending: 15 }
  };

  // Headcount Trend (Last 6 months)
  const headcountData = [
    { month: 'Jun', employees: 298, hires: 4, exits: 1 },
    { month: 'Jul', employees: 302, hires: 6, exits: 2 },
    { month: 'Aug', employees: 308, hires: 8, exits: 2 },
    { month: 'Sep', employees: 312, hires: 6, exits: 2 },
    { month: 'Oct', employees: 315, hires: 5, exits: 2 },
    { month: 'Nov', employees: 320, hires: 7, exits: 2 }
  ];

  // Department Distribution
  const departmentData = [
    { name: 'Engineering', value: 95, percentage: 29.7, color: '#3b82f6' },
    { name: 'Sales', value: 68, percentage: 21.3, color: '#10b981' },
    { name: 'Marketing', value: 45, percentage: 14.1, color: '#f59e0b' },
    { name: 'HR', value: 32, percentage: 10.0, color: '#8b5cf6' },
    { name: 'Finance', value: 28, percentage: 8.8, color: '#ef4444' },
    { name: 'Operations', value: 52, percentage: 16.3, color: '#06b6d4' }
  ];

  // Weekly Attendance
  const attendanceWeekData = [
    { day: 'Mon', present: 310, late: 8, absent: 2 },
    { day: 'Tue', present: 315, late: 3, absent: 2 },
    { day: 'Wed', present: 312, late: 5, absent: 3 },
    { day: 'Thu', present: 308, late: 7, absent: 5 },
    { day: 'Fri', present: 290, late: 15, absent: 15 }
  ];

  // Leave Distribution
  const leaveData = [
    { name: 'Vacation', value: 35, count: 42, color: '#3b82f6' },
    { name: 'Sick Leave', value: 25, count: 30, color: '#ef4444' },
    { name: 'Personal', value: 20, count: 24, color: '#f59e0b' },
    { name: 'Maternity', value: 12, count: 14, color: '#8b5cf6' },
    { name: 'Other', value: 8, count: 10, color: '#6b7280' }
  ];

  // Recruitment Pipeline
  const recruitmentData = [
    { stage: 'Applied', count: 58 },
    { stage: 'Screened', count: 35 },
    { stage: 'Interview', count: 18 },
    { stage: 'Offer', count: 8 },
    { stage: 'Hired', count: 5 }
  ];

  // Action Items with Navigation
  const actionItems = [
    { 
      id: 1, 
      type: 'urgent', 
      message: '8 Leave Requests Pending Approval', 
      action: 'Review',
      icon: <FaCalendarAlt />,
      color: 'red',
      navigateTo: 'leave',
      count: 8
    },
    { 
      id: 2, 
      type: 'warning', 
      message: 'Payroll Processing 85% Complete - Deadline in 5 Days', 
      action: 'Process',
      icon: <FaDollarSign />,
      color: 'orange',
      navigateTo: 'payroll',
      count: 15
    },
    { 
      id: 3, 
      type: 'info', 
      message: '5 Candidates Ready for Final Interview', 
      action: 'Schedule',
      icon: <FaBriefcase />,
      color: 'blue',
      navigateTo: 'recruitment',
      count: 5
    },
    { 
      id: 4, 
      type: 'warning', 
      message: '3 Employees with Poor Attendance (>5 Days)', 
      action: 'View',
      icon: <FaClock />,
      color: 'orange',
      navigateTo: 'attendance',
      count: 3
    }
  ];

  // Handle navigation
  const handleActionClick = (navigateTo: string) => {
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(navigateTo);
    }
  };

  // Quick Stats
  const quickStats = [
    { label: 'Active Employees', value: '320', change: '+5', icon: <FaUsers />, trend: 'up' },
    { label: 'Turnover Rate', value: '8.5%', change: '-1.2%', icon: <FaArrowDown />, trend: 'down' },
    { label: 'Open Positions', value: '12', change: '+4', icon: <FaBriefcase />, trend: 'up' },
    { label: 'Avg Time to Hire', value: '28 days', change: '-5 days', icon: <FaClock />, trend: 'down' }
  ];

  return (
    <div className="space-y-8">
      {/* ========== HEADER ========== */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          
          <p className="text-xs lg:text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg text-xs lg:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <FaSync className="text-gray-600 text-sm" />
          </button>
          <button className="px-3 lg:px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold flex items-center gap-2 transition text-xs lg:text-sm">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* ========== TOP KPI CARDS ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Headcount */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:p-6 hover:shadow-md transition cursor-pointer"
             onClick={() => handleActionClick('directory')}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-blue-600 text-lg lg:text-xl" />
            </div>
            <div className="flex items-center gap-1 text-xs lg:text-sm">
              <FaArrowUp className="text-green-500" />
              <span className="text-green-600 font-semibold">+{kpiData.headcount.change}</span>
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">{kpiData.headcount.current}</p>
          <p className="text-xs lg:text-sm text-gray-500">Total Employees</p>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:p-6 hover:shadow-md transition cursor-pointer"
             onClick={() => handleActionClick('attendance')}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUserCheck className="text-green-600 text-lg lg:text-xl" />
            </div>
            <span className="text-xs lg:text-sm font-semibold text-green-600">{kpiData.attendance.percentage}%</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
            {kpiData.attendance.present}
            <span className="text-base lg:text-lg text-gray-400">/{kpiData.attendance.total}</span>
          </p>
          <p className="text-xs lg:text-sm text-gray-500">Present Today</p>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:p-6 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="text-orange-600 text-lg lg:text-xl" />
            </div>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] lg:text-xs font-semibold rounded">URGENT</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">{kpiData.pendingActions.total}</p>
          <p className="text-xs lg:text-sm text-gray-500">Action Required</p>
        </div>

        {/* Payroll */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:p-6 hover:shadow-md transition cursor-pointer"
             onClick={() => handleActionClick('payroll')}>
          <div className="flex justify-between items-start mb-4" >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaDollarSign className="text-purple-600 text-lg lg:text-xl" />
            </div>
            <span className="text-xs lg:text-sm text-gray-500">{kpiData.payroll.status}%</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">₹{(kpiData.payroll.amount/1000).toFixed(0)}K</p>
          <p className="text-xs lg:text-sm text-gray-500">Monthly Payroll</p>
        </div>
      </div>

      {/* ========== ALERT BANNER ========== */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-l-4 border-red-500 p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaExclamationTriangle className="text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm lg:text-base">Immediate Attention Required</p>
              <p className="text-xs lg:text-sm text-gray-600">
                {kpiData.pendingActions.leaves} leave requests, {kpiData.pendingActions.payroll} payroll items, {kpiData.pendingActions.recruitment} recruitment tasks
              </p>
            </div>
          </div>
          <button 
            onClick={() => handleActionClick('leave')}
            className="w-full lg:w-auto px-4 lg:px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm"
          >
            View All
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      {/* ========== QUICK STATS ========== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-gray-400 text-lg">{stat.icon}</div>
              <p className="text-[10px] lg:text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
            <div className="flex items-center gap-1 text-[10px] lg:text-xs">
              <span className={`font-semibold ${stat.trend === 'down' && (stat.label.includes('Turnover') || stat.label.includes('Time')) ? 'text-green-600' : stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
              <span className="text-gray-500">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* ========== MAIN CHARTS ROW ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Headcount Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base lg:text-lg font-bold text-gray-800">Headcount Growth</h3>
              <p className="text-xs lg:text-sm text-gray-500">Monthly trend with hires & exits</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={headcountData}>
              <defs>
                <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8" 
                style={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 8,
                  fontSize: 12
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area 
                type="monotone" 
                dataKey="employees" 
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorEmployees)"
                name="Total"
              />
              <Line type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Hires" />
              <Line type="monotone" dataKey="exits" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Exits" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-800 mb-4">Departments</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {departmentData.map((dept, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs lg:text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-gray-700 truncate">{dept.name}</span>
                </div>
                <span className="font-semibold text-gray-800 ml-2">{dept.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== ATTENDANCE & LEAVE ROW ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Attendance */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
          <div className="mb-6">
            <h3 className="text-base lg:text-lg font-bold text-gray-800">Weekly Attendance</h3>
            <p className="text-xs lg:text-sm text-gray-500">Present vs Late vs Absent</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceWeekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#94a3b8" 
                style={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 8,
                  fontSize: 12
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="present" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Present" />
              <Bar dataKey="late" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Late" />
              <Bar dataKey="absent" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-800 mb-4">Leave Types</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={leaveData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={({ value }) => `${value}%`}
                labelLine={false}
              >
                {leaveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props: any) => [`${props.payload.count} requests (${value}%)`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {leaveData.map((leave, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs lg:text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: leave.color }}
                  />
                  <span className="text-gray-700 truncate">{leave.name}</span>
                </div>
                <span className="font-semibold text-gray-800 ml-2">{leave.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== ACTION ITEMS WITH NAVIGATION (FULLY RESPONSIVE) ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-800">Quick Actions</h3>
          <span className="text-xs lg:text-sm text-gray-500">{actionItems.length} items</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {actionItems.map((item) => (
            <div 
              key={item.id} 
              className={`p-3 lg:p-4 rounded-lg border flex items-center justify-between gap-3 transition hover:shadow-md ${
                item.color === 'red' ? 'bg-red-50 border-red-200' :
                item.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.color === 'red' ? 'bg-red-100 text-red-600' :
                  item.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[9px] lg:text-[10px] font-bold whitespace-nowrap ${
                      item.type === 'urgent' ? 'bg-red-200 text-red-800' :
                      item.type === 'warning' ? 'bg-orange-200 text-orange-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {item.type === 'urgent' ? 'URGENT' : item.type === 'warning' ? 'WARNING' : 'INFO'}
                    </span>
                    <span className={`text-xs lg:text-sm font-bold ${
                      item.color === 'red' ? 'text-red-700' :
                      item.color === 'orange' ? 'text-orange-700' :
                      'text-blue-700'
                    }`}>
                      {item.count} items
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 text-xs lg:text-sm truncate">{item.message}</p>
                </div>
              </div>
              <button 
                onClick={() => handleActionClick(item.navigateTo)}
                className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-semibold text-xs lg:text-sm transition whitespace-nowrap flex-shrink-0 ${
                  item.color === 'red' ? 'bg-red-500 hover:bg-red-600 text-white' :
                  item.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                  'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========== RECRUITMENT PIPELINE ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base lg:text-lg font-bold text-gray-800">Recruitment Pipeline</h3>
            <p className="text-xs lg:text-sm text-gray-500">Current hiring funnel</p>
          </div>
          <button 
            onClick={() => handleActionClick('recruitment')}
            className="text-xs lg:text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
          >
            View Details <FaChevronRight className="text-xs" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {recruitmentData.map((stage, idx) => (
            <div key={idx} className="text-center">
              <div className={`w-full h-2 rounded-full mb-3 ${
                idx === 0 ? 'bg-blue-200' :
                idx === 1 ? 'bg-blue-300' :
                idx === 2 ? 'bg-blue-400' :
                idx === 3 ? 'bg-blue-500' :
                'bg-blue-600'
              }`} />
              <p className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">{stage.count}</p>
              <p className="text-[10px] lg:text-xs text-gray-600 font-medium">{stage.stage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;