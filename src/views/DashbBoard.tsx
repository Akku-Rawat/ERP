import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, FileText, ArrowUpRight, ArrowDownRight,
  Calendar, ChevronRight, Eye, Check, Clock,
  AlertCircle, Building2, UserCircle2
} from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [viewType, setViewType] = useState('overdue');

  const kpiCards = [
    { label: 'Revenue', value: '₹124,800', change: 8.2, target: '₹150,000', progress: 83, icon: DollarSign, gradient: 'from-emerald-500 to-emerald-600', trend: 'up' },
    { label: 'Expenses', value: '₹3,482', change: 6.1, target: '₹5,000', progress: 70, icon: ShoppingCart, gradient: 'from-rose-500 to-rose-600', trend: 'up' },
    { label: 'Active Customers', value: '1,294', change: 2.5, target: '1,500', progress: 86, icon: Users, gradient: 'from-blue-500 to-blue-600', trend: 'up' },
    { label: 'Pending Tasks', value: '845', change: -15, target: '0', progress: 15, icon: FileText, gradient: 'from-amber-500 to-amber-600', trend: 'down' }
  ];

  const quickActions = [
    { label: 'New Invoice', icon: FileText, color: 'blue' },
    { label: 'Add Customer', icon: Users, color: 'emerald' },
    { label: 'Quick Payment', icon: DollarSign, color: 'purple' },
    { label: 'View Reports', icon: Eye, color: 'orange' }
  ];

  const recentActivity = [
    { title: 'Office Supplies PO-001', amount: '₹1,200', status: 'pending', time: '2h ago' },
    { title: 'Customer A Payment', amount: '₹45,000', status: 'completed', time: '4h ago' },
    { title: 'Marketing Materials PO-002', amount: '₹3,500', status: 'pending', time: '5h ago' },
    { title: 'Invoice #INV-1234', amount: '₹28,000', status: 'sent', time: '1d ago' }
  ];

  const categories = [
    { name: 'Clothes', value: 42500, percentage: 35, color: 'bg-blue-500' },
    { name: 'Software', value: 32800, percentage: 27, color: 'bg-purple-500' },
    { name: 'Rental', value: 28600, percentage: 24, color: 'bg-emerald-500' },
    { name: 'Travel', value: 17100, percentage: 14, color: 'bg-orange-500' }
  ];

  const topEntities = {
    customers: [
      { name: 'Customer A', id: 'CUST-001', amount: 45000, trend: 12 },
      { name: 'Customer B', id: 'CUST-002', amount: 38000, trend: 8 },
      { name: 'Customer C', id: 'CUST-003', amount: 32000, trend: -3 }
    ],
    suppliers: [
      { name: 'Supplier X', id: 'SUP-001', amount: 55000, trend: 15 },
      { name: 'Supplier Y', id: 'SUP-002', amount: 42000, trend: 5 },
      { name: 'Supplier Z', id: 'SUP-003', amount: 38000, trend: -2 }
    ]
  };

  // All payables with due dates
  const allPayables = [
    { id: 'INV-5421', vendor: 'Tech Solutions Ltd', amount: 85000, dueDate: '2026-01-10', status: 'overdue' },
    { id: 'INV-5389', vendor: 'Office Supplies Co', amount: 12500, dueDate: '2026-01-15', status: 'overdue' },
    { id: 'INV-5402', vendor: 'Marketing Agency', amount: 45000, dueDate: '2026-01-18', status: 'overdue' },
    { id: 'INV-5456', vendor: 'Cloud Services Inc', amount: 28000, dueDate: '2026-01-25', status: 'upcoming' },
    { id: 'INV-5467', vendor: 'Software Licenses Ltd', amount: 52000, dueDate: '2026-01-28', status: 'upcoming' },
    { id: 'INV-5478', vendor: 'Hardware Suppliers', amount: 35000, dueDate: '2026-02-05', status: 'upcoming' }
  ];

  // All receivables with due dates
  const allReceivables = [
    { id: 'INV-8842', customer: 'ABC Corporation', amount: 125000, dueDate: '2026-01-08', status: 'overdue' },
    { id: 'INV-8801', customer: 'XYZ Enterprises', amount: 68000, dueDate: '2026-01-15', status: 'overdue' },
    { id: 'INV-8823', customer: 'Global Tech Inc', amount: 42000, dueDate: '2026-01-18', status: 'overdue' },
    { id: 'INV-8890', customer: 'Retail Solutions Co', amount: 95000, dueDate: '2026-01-26', status: 'upcoming' },
    { id: 'INV-8901', customer: 'Manufacturing Ltd', amount: 78000, dueDate: '2026-01-30', status: 'upcoming' },
    { id: 'INV-8912', customer: 'Tech Innovations', amount: 62000, dueDate: '2026-02-03', status: 'upcoming' }
  ];

  // Calculate days difference
  const today = new Date('2026-01-23');
  const calculateDays = (dueDate) => {
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Process payables
  const payableOverdues = allPayables
    .filter(item => item.status === 'overdue')
    .map(item => ({
      ...item,
      daysOverdue: calculateDays(item.dueDate),
      severity: calculateDays(item.dueDate) > 10 ? 'critical' : calculateDays(item.dueDate) > 5 ? 'high' : 'medium'
    }))
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  const payableUpcoming = allPayables
    .filter(item => item.status === 'upcoming')
    .map(item => ({
      ...item,
      daysUntilDue: -calculateDays(item.dueDate),
      urgency: -calculateDays(item.dueDate) <= 3 ? 'urgent' : -calculateDays(item.dueDate) <= 7 ? 'soon' : 'normal'
    }))
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  // Process receivables
  const receivableOverdues = allReceivables
    .filter(item => item.status === 'overdue')
    .map(item => ({
      ...item,
      daysOverdue: calculateDays(item.dueDate),
      severity: calculateDays(item.dueDate) > 10 ? 'critical' : calculateDays(item.dueDate) > 5 ? 'high' : 'medium'
    }))
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  const receivableUpcoming = allReceivables
    .filter(item => item.status === 'upcoming')
    .map(item => ({
      ...item,
      daysUntilDue: -calculateDays(item.dueDate),
      urgency: -calculateDays(item.dueDate) <= 3 ? 'urgent' : -calculateDays(item.dueDate) <= 7 ? 'soon' : 'normal'
    }))
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  const totalPayableOverdue = payableOverdues.reduce((sum, item) => sum + item.amount, 0);
  const totalReceivableOverdue = receivableOverdues.reduce((sum, item) => sum + item.amount, 0);
  const totalPayableUpcoming = payableUpcoming.reduce((sum, item) => sum + item.amount, 0);
  const totalReceivableUpcoming = receivableUpcoming.reduce((sum, item) => sum + item.amount, 0);

  // ─── Upcoming: consistent urgency badge & button styles ───────────────────
  // Badge: single slate/indigo palette, differentiated only by shade
  const getUpcomingBadgeClass = (urgency) => {
    if (urgency === 'urgent') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (urgency === 'soon')   return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    return                           'bg-slate-50 text-slate-500 border-slate-200';
  };

  // CTA button for upcoming payables — tonal blue
  const payableUpcomingBtnClass =
    'w-full mt-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-all';

  // CTA button for upcoming receivables — tonal emerald
  const receivableUpcomingBtnClass =
    'w-full mt-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-all';

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-4 lg:p-5">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-0.5">Welcome back, Admin 👋</h1>
            <p className="text-gray-600 text-xs md:text-sm">Here's what's happening with your business today</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <Calendar className="text-gray-600" size={14} />
              <span className="text-gray-900 font-medium text-xs hidden md:inline">Jan 23, 2026</span>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-gray-200 text-gray-900 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
          {kpiCards.map((card, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 bg-gradient-to-br ${card.gradient} rounded-lg shadow-sm group-hover:shadow-md transition-shadow`}>
                  <card.icon className="text-white" size={16} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold shadow-sm ${card.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                  {card.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(card.change)}%
                </div>
              </div>

              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-600 mb-1">{card.label}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                  <span>Target: {card.target}</span>
                  <span className="font-bold text-blue-600">{card.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-700 shadow-sm`}
                    style={{ width: `${card.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* OVERDUE SECTION + QUICK ACTIONS */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-1.5 rounded-lg border flex-shrink-0 ${viewType === 'overdue' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
              <AlertCircle className={viewType === 'overdue' ? 'text-red-600' : 'text-blue-600'} size={16} />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewType('overdue')}
                className={`text-base font-bold transition-colors ${viewType === 'overdue' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Overdue Payments
              </button>
              <span className="text-gray-300 font-light text-base select-none">/</span>
              <button
                onClick={() => setViewType('upcoming')}
                className={`text-base font-bold transition-colors ${viewType === 'upcoming' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Due Soon
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-3">
            {/* Combined Payables + Receivables Section — single box */}
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">

              {/* Combined header row */}
             <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
                {/* You Owe header */}
                <div className="p-3 flex items-center justify-between border-r border-gray-200">
                  <div className="flex items-center gap-2">
                   <div className="p-1.5 rounded-lg bg-white border border-gray-200">
                      <Building2 size={16} className={viewType === 'overdue' ? 'text-red-600' : 'text-blue-600'} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900">You Owe</h3>
                      <p className="text-xs text-gray-600">To vendors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${viewType === 'overdue' ? 'text-red-600' : 'text-blue-600'}`}>
                      ₹{((viewType === 'overdue' ? totalPayableOverdue : totalPayableUpcoming) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {viewType === 'overdue' ? payableOverdues.length : payableUpcoming.length} invoices
                    </div>
                  </div>
                </div>

                {/* They Owe header */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white border border-gray-200">
                      <UserCircle2 size={16} className={viewType === 'overdue' ? 'text-emerald-600' : 'text-green-600'} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900">They Owe</h3>
                      <p className="text-xs text-gray-600">From customers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${viewType === 'overdue' ? 'text-emerald-600' : 'text-green-600'}`}>
                      ₹{((viewType === 'overdue' ? totalReceivableOverdue : totalReceivableUpcoming) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {viewType === 'overdue' ? receivableOverdues.length : receivableUpcoming.length} invoices
                    </div>
                  </div>
                </div>
              </div>

              {/* Combined rows */}
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                {/* Payables rows */}
                <div className="divide-y divide-gray-200">
                  {viewType === 'overdue' ? (
                    payableOverdues.map((item, idx) => (
                      <div key={idx} className="p-2.5 hover:bg-gray-50 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-xs">{item.id}</span>
                              <span className={`text-xs px-2 py-0.5 font-semibold rounded border ${
  item.severity === 'critical'
    ? 'bg-red-100 text-red-700 border-red-300'
    : item.severity === 'high'
      ? 'bg-orange-100 text-orange-700 border-orange-300'
      : 'bg-yellow-100 text-yellow-700 border-yellow-300'
}`}>
                                {item.daysOverdue}d overdue
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{item.vendor}</p>
                           <p className="text-xs text-gray-500 font-medium mt-0.5">Due: {item.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">₹{(item.amount / 1000).toFixed(1)}K</p>
                          </div>
                        </div>
                        <button className="w-full mt-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition-all">
                          Pay Now
                        </button>
                      </div>
                    ))
                  ) : (
                    payableUpcoming.map((item, idx) => (
                      <div key={idx} className="p-2.5 hover:bg-gray-50 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-xs">{item.id}</span>
                              {/* ── Upcoming payable badge: consistent amber/indigo/slate palette ── */}
                              <span className={`text-xs px-1.5 py-0.5 font-semibold rounded border ${getUpcomingBadgeClass(item.urgency)}`}>
                                {item.daysUntilDue}d left
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{item.vendor}</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Due: {item.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">₹{(item.amount / 1000).toFixed(1)}K</p>
                          </div>
                        </div>
                        {/* ── Upcoming payable CTA: tonal blue ── */}
                        <button className={payableUpcomingBtnClass}>
                          Schedule Payment
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Receivables rows */}
                <div className="divide-y divide-gray-200">
                  {viewType === 'overdue' ? (
                    receivableOverdues.map((item, idx) => (
                      <div key={idx} className="p-2.5 hover:bg-gray-50 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-xs">{item.id}</span>
                              <span className={`text-xs px-1.5 py-0.5 font-bold rounded border ${item.severity === 'critical'
                                  ? 'bg-red-100 text-red-700 border-red-300'
                                  : item.severity === 'high'
                                    ? 'bg-orange-100 text-orange-700 border-orange-300'
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                }`}>
                                {item.daysOverdue}d overdue
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{item.customer}</p>
                            <p className="text-xs text-rose-600 font-semibold mt-0.5">Due: {item.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">₹{(item.amount / 1000).toFixed(1)}K</p>
                          </div>
                        </div>
                        <button className="w-full mt-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold transition-all">
                          Follow Up Now
                        </button>
                      </div>
                    ))
                  ) : (
                    receivableUpcoming.map((item, idx) => (
                      <div key={idx} className="p-2.5 hover:bg-gray-50 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-xs">{item.id}</span>
                              {/* ── Upcoming receivable badge: same consistent palette ── */}
                              <span className={`text-xs px-1.5 py-0.5 font-semibold rounded border ${getUpcomingBadgeClass(item.urgency)}`}>
                                {item.daysUntilDue}d left
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{item.customer}</p>
                            <p className="text-xs text-green-600 font-semibold mt-0.5">Due: {item.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">₹{(item.amount / 1000).toFixed(1)}K</p>
                          </div>
                        </div>
                        {/* ── Upcoming receivable CTA: tonal emerald ── */}
                        <button className={receivableUpcomingBtnClass}>
                          Send Reminder
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Combined footer */}
              <div className="p-2 bg-gray-50 border-t border-gray-200">
                <button className="w-full py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 transition-colors">
                  View All <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-2.5 content-start">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-all duration-300 group flex lg:flex-col items-center justify-center lg:items-center gap-2 lg:gap-0"
                >
                  <div className={`w-11 h-11 bg-${action.color}-50 border border-${action.color}-200 rounded-xl flex items-center justify-center lg:mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                    <action.icon className={`text-${action.color}-600`} size={20} />
                  </div>
                  <p className="text-gray-900 font-bold text-xs text-center">{action.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          {/* Cash Flow Overview */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-5 gap-2">
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">Cashflow</h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Monthly income and expenses overview</p>
              </div>
              <button className="text-xs md:text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 self-start sm:self-auto shadow-sm hover:shadow font-semibold">
                All Time
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-5 text-xs md:text-sm">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm">
                <div className="w-3 h-1.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"></div>
                <span className="text-muted font-bold">Cash Inflow</span>
              </div>
              <div className="flex items-center gap-2 bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200 shadow-sm">
                <div className="w-3 h-1.5 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"></div>
                <span className="text-muted font-bold">Cash Outflows</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
                <div className="w-3 h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"></div>
                <span className="text-muted font-bold">Net Cashflow</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-48 md:h-64 bg-gradient-to-b from-gray-50 to-white rounded-xl p-3 md:p-4 border border-gray-200">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-3 md:top-4 bottom-8 md:bottom-10 flex flex-col justify-between text-xs md:text-sm font-bold text-gray-600 pr-2">
                <span>400</span>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>

              {/* Chart container */}
              <div className="ml-6 md:ml-8 mr-2 md:mr-3 h-full relative pb-8 md:pb-10">
                {/* Grid lines */}
                <div className="absolute inset-0 bottom-8 md:bottom-10 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className="border-t border-gray-200 opacity-50"></div>
                  ))}
                </div>

                {/* SVG Chart */}
                <svg className="absolute inset-0 bottom-8 md:bottom-10 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e40af" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#50a9b9" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
                    </linearGradient>

                    <linearGradient id="blueArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="cyanArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="greenArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                    </linearGradient>

                    <filter id="glow">
                      <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path d="M 0,65 L 20,55 L 40,45 L 60,40 L 80,35 L 100,30 L 100,100 L 0,100 Z" fill="url(#blueArea)" />
                  <path d="M 0,75 L 20,65 L 40,50 L 60,35 L 80,25 L 100,15 L 100,100 L 0,100 Z" fill="url(#cyanArea)" />
                  <path d="M 0,80 L 20,77 L 40,75 L 60,70 L 80,65 L 100,55 L 100,100 L 0,100 Z" fill="url(#greenArea)" />

                  <path d="M 0,65 L 20,55 L 40,45 L 60,40 L 80,35 L 100,30" fill="none" stroke="url(#blueGradient)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" filter="url(#glow)" />
                  <path d="M 0,75 L 20,65 L 40,50 L 60,35 L 80,25 L 100,15" fill="none" stroke="url(#cyanGradient)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" filter="url(#glow)" />
                  <path d="M 0,80 L 20,77 L 40,75 L 60,70 L 80,65 L 100,55" fill="none" stroke="url(#greenGradient)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" filter="url(#glow)" />

                  {[0, 20, 40, 60, 80, 100].map((x, i) => (
                    <g key={i}>
                      <circle cx={x} cy={[65, 55, 45, 40, 35, 30][i]} r="1" fill="#3b82f6" className="drop-shadow" />
                      <circle cx={x} cy={[75, 65, 50, 35, 25, 15][i]} r="1" fill="#22d3ee" className="drop-shadow" />
                      <circle cx={x} cy={[80, 77, 75, 70, 65, 55][i]} r="1" fill="#34d399" className="drop-shadow" />
                    </g>
                  ))}
                </svg>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs md:text-sm font-bold text-gray-600">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map(month => (
                    <span key={month} className="bg-white px-2 py-0.5 rounded shadow-sm border border-gray-200">{month}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Sales by Category</h3>

            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 ${cat.color} rounded-full shadow-sm`}></div>
                      <span className="text-xs font-bold text-gray-900">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-900">₹{cat.value.toLocaleString()}</p>
                      <p className="text-xs text-gray-600 font-semibold">{cat.percentage}%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-700 shadow-sm`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-transparent">
              <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="p-3 hover:bg-gray-50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform ${item.status === 'completed' ? 'bg-emerald-50 border border-emerald-200' :
                        item.status === 'pending' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'
                      }`}>
                      {item.status === 'completed' ? <Check className="text-emerald-600" size={16} /> :
                        item.status === 'pending' ? <Clock className="text-amber-600" size={16} /> :
                          <FileText className="text-blue-600" size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{item.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-600 font-semibold">{item.time}</span>
                        <span className="text-xs font-bold text-blue-600">{item.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-transparent flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Top Customers</h3>
              <button className="text-blue-600 text-xs font-bold hover:text-blue-700 flex items-center gap-0.5 transition-colors">
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {topEntities.customers.map((customer, idx) => (
                <div key={idx} className="p-3 hover:bg-gray-50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-600 font-semibold mt-0.5">{customer.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600">₹{customer.amount.toLocaleString()}</p>
                      <div className={`text-xs font-bold flex items-center justify-end gap-0.5 mt-0.5 ${customer.trend > 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                        {customer.trend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {Math.abs(customer.trend)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Suppliers */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-transparent flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Top Suppliers</h3>
              <button className="text-blue-600 text-xs font-bold hover:text-blue-700 flex items-center gap-0.5 transition-colors">
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {topEntities.suppliers.map((supplier, idx) => (
                <div key={idx} className="p-3 hover:bg-gray-50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{supplier.name}</p>
                      <p className="text-xs text-gray-600 font-semibold mt-0.5">{supplier.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-rose-600">₹{supplier.amount.toLocaleString()}</p>
                      <div className={`text-xs font-bold flex items-center justify-end gap-0.5 mt-0.5 ${supplier.trend > 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                        {supplier.trend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {Math.abs(supplier.trend)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
