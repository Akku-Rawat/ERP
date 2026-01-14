// import React from "react";
// import {
//   FaCalendarAlt,
//   FaClock,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaExclamationCircle,
//   FaUsers,
//   FaChartLine,
// } from "react-icons/fa";

// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// // Replace with your own demo data or import as needed
// const demoLeaveRequests = [
//   {
//     id: "LR001",
//     employeeId: "EMP201",
//     employeeName: "Sarah Johnson",
//     leaveType: "Sick Leave",
//     startDate: "Nov 25, 2024",
//     endDate: "Nov 26, 2024",
//     days: 2,
//     reason: "Medical appointment",
//     status: "Pending",
//     appliedOn: "Nov 15, 2024",
//   },
//   {
//     id: "LR002",
//     employeeId: "EMP202",
//     employeeName: "Michael Chen",
//     leaveType: "Vacation",
//     startDate: "Dec 20, 2024",
//     endDate: "Dec 30, 2024",
//     days: 10,
//     reason: "Family vacation",
//     status: "Pending",
//     appliedOn: "Nov 14, 2024",
//   },
//   {
//     id: "LR003",
//     employeeId: "EMP203",
//     employeeName: "Emily Davis",
//     leaveType: "Personal Leave",
//     startDate: "Nov 22, 2024",
//     endDate: "Nov 22, 2024",
//     days: 1,
//     reason: "Personal matters",
//     status: "Approved",
//     appliedOn: "Nov 10, 2024",
//   },
//   {
//     id: "LR004",
//     employeeId: "EMP204",
//     employeeName: "David Martinez",
//     leaveType: "Sick Leave",
//     startDate: "Nov 18, 2024",
//     endDate: "Nov 19, 2024",
//     days: 2,
//     reason: "Flu symptoms",
//     status: "Rejected",
//     appliedOn: "Nov 17, 2024",
//   },
// ];
// const leaveTypeDistribution = [
//   { name: "Vacation", value: 35, color: "#14b8a6" },
//   { name: "Sick Leave", value: 25, color: "#ef4444" },
//   { name: "Personal", value: 20, color: "#f59e0b" },
//   { name: "Maternity/Paternity", value: 20, color: "#3b82f6" },
// ];
// // const monthlyLeaveData = [
// //   { month: 'Jul', approved: 12, pending: 3, rejected: 1 },
// //   { month: 'Aug', approved: 15, pending: 2, rejected: 2 },
// //   { month: 'Sep', approved: 10, pending: 4, rejected: 1 },
// //   { month: 'Oct', approved: 18, pending: 5, rejected: 3 },
// //   { month: 'Nov', approved: 14, pending: 7, rejected: 2 },
// // ];
// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "Approved":
//       return "bg-emerald-100 text-emerald-700 border-emerald-200";
//     case "Pending":
//       return "bg-amber-100 text-amber-700 border-amber-200";
//     case "Rejected":
//       return "bg-red-100 text-red-700 border-red-200";
//     default:
//       return "bg-gray-100 text-gray-700 border-gray-200";
//   }
// };
// const getStatusIcon = (status: string) => {
//   switch (status) {
//     case "Approved":
//       return <FaCheckCircle className="w-4 h-4" />;
//     case "Rejected":
//       return <FaTimesCircle className="w-4 h-4" />;
//     case "Pending":
//       return <FaExclamationCircle className="w-4 h-4" />;
//     default:
//       return null;
//   }
// };
// const pendingCount = demoLeaveRequests.filter(
//   (r) => r.status === "Pending",
// ).length;
// const approvedYTD =
//   demoLeaveRequests.filter((r) => r.status === "Approved").length + 246;

// const LeaveManagement: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-teal-100 p-3 rounded-lg">
//                 <FaCalendarAlt className="text-teal-600 w-6 h-6" />
//               </div>
//               <FaChartLine className="text-teal-500 w-5 h-5" />
//             </div>
//             <p className="text-slate-600 text-sm font-medium mb-1">
//               Total Leave Requests
//             </p>
//             <p className="text-3xl font-bold text-slate-800">124</p>
//             <p className="text-xs text-slate-500 mt-2">+12% from last month</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-amber-100 p-3 rounded-lg">
//                 <FaExclamationCircle className="text-amber-600 w-6 h-6" />
//               </div>
//               <FaClock className="text-amber-500 w-5 h-5" />
//             </div>
//             <p className="text-slate-600 text-sm font-medium mb-1">
//               Pending Approvals
//             </p>
//             <p className="text-3xl font-bold text-slate-800">{pendingCount}</p>
//             <p className="text-xs text-amber-600 mt-2 font-medium">
//               Requires attention
//             </p>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-emerald-100 p-3 rounded-lg">
//                 <FaCheckCircle className="text-emerald-600 w-6 h-6" />
//               </div>
//               <FaChartLine className="text-emerald-500 w-5 h-5" />
//             </div>
//             <p className="text-slate-600 text-sm font-medium mb-1">
//               Approved Leaves (YTD)
//             </p>
//             <p className="text-3xl font-bold text-slate-800">{approvedYTD}</p>
//             <p className="text-xs text-slate-500 mt-2">85% approval rate</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <FaUsers className="text-blue-600 w-6 h-6" />
//               </div>
//             </div>
//             <p className="text-slate-600 text-sm font-medium mb-1">
//               Active Employees
//             </p>
//             <p className="text-3xl font-bold text-slate-800">342</p>
//             <p className="text-xs text-slate-500 mt-2">96% attendance rate</p>
//           </div>
//         </div>

//         {/* Leave Requests Table with Request Button */}
//         <div className="flex flex-col-reverse lg:flex-row items-stretch gap-6">
//           {/* Main Table */}
//           <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
//             <div className="p-6 border-b border-slate-200 flex items-center justify-between">
//               <h2 className="text-xl font-bold text-slate-800">
//                 Leave Requests
//               </h2>
//               <button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg shadow transition-all">
//                 <FaCalendarAlt className="w-4 h-4" />
//                 Request New Leave
//               </button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50 border-b border-slate-200">
//                   <tr>
//                     <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                       Employee
//                     </th>
//                     <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                       Leave Type
//                     </th>
//                     <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                       Duration
//                     </th>
//                     <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                       Days
//                     </th>
//                     <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-200">
//                   {demoLeaveRequests.map((leave) => (
//                     <tr
//                       key={leave.id}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="py-4 px-6">
//                         <div>
//                           <p className="font-medium text-slate-800">
//                             {leave.employeeName}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             {leave.employeeId}
//                           </p>
//                         </div>
//                       </td>
//                       <td className="py-4 px-6">
//                         <span className="text-sm text-slate-700">
//                           {leave.leaveType}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6">
//                         <div className="text-sm text-slate-600">
//                           <p>{leave.startDate}</p>
//                           <p className="text-xs text-slate-500">
//                             to {leave.endDate}
//                           </p>
//                         </div>
//                       </td>
//                       <td className="py-4 px-6">
//                         <span className="font-semibold text-slate-700">
//                           {leave.days}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6">
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}
//                         >
//                           {getStatusIcon(leave.status)}
//                           {leave.status}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6">
//                         {leave.status === "Pending" && (
//                           <div className="flex gap-2">
//                             <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
//                               <FaCheckCircle className="w-4 h-4" />
//                             </button>
//                             <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                               <FaTimesCircle className="w-4 h-4" />
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Sidebar (Charts + Quick Actions) */}
//           <div className="lg:w-1/3 space-y-6 flex flex-col">
//             {/* Leave Type Distribution pie chart */}
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//               <h3 className="text-lg font-bold text-slate-800 mb-2">
//                 Leave Type Distribution
//               </h3>
//               <p className="text-sm text-slate-500 mb-6">
//                 Current year breakdown
//               </p>
//               <ResponsiveContainer width="100%" height={200}>
//                 <PieChart>
//                   <Pie
//                     data={leaveTypeDistribution}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={55}
//                     outerRadius={80}
//                     paddingAngle={3}
//                     dataKey="value"
//                   >
//                     {leaveTypeDistribution.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(value) => `${String(value)}%`} />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="mt-6 space-y-3">
//                 {leaveTypeDistribution.map((item, idx) => (
//                   <div key={idx} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div
//                         className="w-3 h-3 rounded-full"
//                         style={{ backgroundColor: item.color }}
//                       ></div>
//                       <span className="text-sm text-slate-700">
//                         {item.name}
//                       </span>
//                     </div>
//                     <span className="text-sm font-semibold text-slate-800">
//                       {item.value}%
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {/* Monthly Leave Trend */}
//             {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//               <h3 className="text-lg font-bold text-slate-800 mb-2">Monthly Leave Trend</h3>
//               <p className="text-sm text-slate-500 mb-6">Last 5 months</p>
//               <ResponsiveContainer width="100%" height={200}>
//                 <BarChart data={monthlyLeaveData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                   <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
//                   <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
//                   <Tooltip />
//                   <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
//                   <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
//                   <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//               <div className="flex gap-4 mt-4 justify-center">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-emerald-500 rounded"></div>
//                   <span className="text-xs text-slate-600">Approved</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-amber-500 rounded"></div>
//                   <span className="text-xs text-slate-600">Pending</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-red-500 rounded"></div>
//                   <span className="text-xs text-slate-600">Rejected</span>
//                 </div>
//               </div>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaveManagement;
