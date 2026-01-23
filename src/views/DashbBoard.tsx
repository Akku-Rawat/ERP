import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, FileText, ArrowUpRight, ArrowDownRight,
  Calendar, ChevronRight, Eye, Check, Clock,
  AlertCircle, ArrowRight, Building2, UserCircle2
} from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');

  const kpiCards = [
    { label: 'Revenue', value: '₹124,800', change: 8.2, target: '₹150,000', progress: 83, icon: DollarSign, gradient: 'from-emerald-500 to-emerald-600', trend: 'up' },
    { label: 'Expenses', value: '₹3,482', change: 6.1, target: '₹5,000', progress: 70, icon: ShoppingCart, gradient: 'from-rose-500 to-rose-600', trend: 'up' },
    { label: 'Active Customers', value: '1,294', change: 2.5, target: '₹1,500', progress: 86, icon: Users, gradient: 'from-blue-500 to-blue-600', trend: 'up' },
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

  const payableOverdues = [
    { id: 'INV-5421', vendor: 'Tech Solutions Ltd', amount: 85000, dueDate: '2026-01-10', daysOverdue: 12, severity: 'critical' },
    { id: 'INV-5389', vendor: 'Office Supplies Co', amount: 12500, dueDate: '2026-01-15', daysOverdue: 7, severity: 'high' },
    { id: 'INV-5402', vendor: 'Marketing Agency', amount: 45000, dueDate: '2026-01-18', daysOverdue: 4, severity: 'medium' }
  ];

  const receivableOverdues = [
    { id: 'INV-8842', customer: 'ABC Corporation', amount: 125000, dueDate: '2026-01-08', daysOverdue: 14, severity: 'critical' },
    { id: 'INV-8801', customer: 'XYZ Enterprises', amount: 68000, dueDate: '2026-01-12', daysOverdue: 10, severity: 'high' },
    { id: 'INV-8823', customer: 'Global Tech Inc', amount: 42000, dueDate: '2026-01-17', daysOverdue: 5, severity: 'medium' }
  ];

  const totalPayableOverdue = payableOverdues.reduce((sum, item) => sum + item.amount, 0);
  const totalReceivableOverdue = receivableOverdues.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-app p-3 md:p-4 lg:p-5">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-main mb-0.5">Welcome back, Admin 👋</h1>
            <p className="text-muted text-xs md:text-sm">Here's what's happening with your business today</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-card border border-theme rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <Calendar className="text-muted" size={14} />
              <span className="text-main font-medium text-xs hidden md:inline">Jan 22, 2026</span>
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-card border-theme text-main rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            <div key={idx} className="bg-card border border-theme rounded-xl p-3 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 bg-gradient-to-br ${card.gradient} rounded-lg shadow-sm group-hover:shadow-md transition-shadow`}>
                  <card.icon className="text-white" size={16} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm ${
                  card.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {card.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(card.change)}%
                </div>
              </div>
              
              <div className="mb-2">
                <p className="text-[10px] font-semibold text-muted mb-1">{card.label}</p>
                <p className="text-xl font-bold text-main">{card.value}</p>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-muted font-medium">
                  <span>Target: {card.target}</span>
                  <span className="font-bold text-primary">{card.progress}%</span>
                </div>
                <div className="h-1.5 bg-app rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-700 shadow-sm`}
                    style={{width: `${card.progress}%`}}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* OVERDUE SECTION + QUICK ACTIONS */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="text-red-600" size={16} />
            </div>
            <h2 className="text-base font-bold text-main">Overdue Payments</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-3">
            {/* Payables Overdue */}
            <div className="lg:col-span-4 bg-card border border-theme rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-3 border-b border-theme flex items-center justify-between bg-gradient-to-r from-red-50/50 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-100 rounded-lg">
                    <Building2 size={16} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-main">You Owe</h3>
                    <p className="text-[10px] text-muted">To vendors</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">₹{(totalPayableOverdue / 1000).toFixed(0)}K</div>
                  <div className="text-[10px] text-muted font-medium">{payableOverdues.length} invoices</div>
                </div>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {payableOverdues.map((item, idx) => (
                  <div key={idx} className="p-2.5 row-hover transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-main text-xs">{item.id}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-600 font-bold rounded border border-red-200">{item.daysOverdue}d</span>
                        </div>
                        <p className="text-[11px] text-muted mt-1">{item.vendor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-main">₹{(item.amount / 1000).toFixed(1)}K</p>
                      </div>
                    </div>
                    <button className="w-full mt-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm hover:shadow">
                      Pay Now
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-app border-t border-theme">
                <button className="w-full py-1.5 text-[11px] font-bold text-primary hover:text-primary-600 flex items-center justify-center gap-1 transition-colors">
                  View All <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Receivables Overdue */}
            <div className="lg:col-span-4 bg-card border border-theme rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-3 border-b border-theme flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 rounded-lg">
                    <UserCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-main">They Owe</h3>
                    <p className="text-[10px] text-muted">From customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600">₹{(totalReceivableOverdue / 1000).toFixed(0)}K</div>
                  <div className="text-[10px] text-muted font-medium">{receivableOverdues.length} invoices</div>
                </div>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {receivableOverdues.map((item, idx) => (
                  <div key={idx} className="p-2.5 row-hover transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-main text-xs">{item.id}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-600 font-bold rounded border border-orange-200">{item.daysOverdue}d</span>
                        </div>
                        <p className="text-[11px] text-muted mt-1">{item.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-main">₹{(item.amount / 1000).toFixed(1)}K</p>
                      </div>
                    </div>
                    <button className="w-full mt-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm hover:shadow">
                      Follow Up
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-app border-t border-theme">
                <button className="w-full py-1.5 text-[11px] font-bold text-primary hover:text-primary-600 flex items-center justify-center gap-1 transition-colors">
                  View All <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-2.5 content-start">
              {quickActions.map((action, idx) => (
                <button 
                  key={idx}
                  className="bg-card border border-theme rounded-xl p-3 hover:shadow-md transition-all duration-300 group flex lg:flex-col items-center justify-center lg:items-center gap-2 lg:gap-0"
                >
                  <div className={`w-11 h-11 bg-${action.color}-50 border border-${action.color}-200 rounded-xl flex items-center justify-center lg:mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                    <action.icon className={`text-${action.color}-600`} size={20} />
                  </div>
                  <p className="text-main font-bold text-xs text-center">{action.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          {/* Cash Flow Overview */}
          <div className="lg:col-span-2 bg-card border border-theme rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-5 gap-2">
              <div>
                <h3 className="text-base md:text-lg font-bold text-main">Cashflow</h3>
                <p className="text-[10px] md:text-xs text-muted mt-1">Where money might be for details</p>
              </div>
              <button className="text-[10px] md:text-xs px-3 py-1.5 bg-card border border-theme rounded-lg text-muted hover:bg-app hover:border-primary/30 transition-all duration-200 self-start sm:self-auto shadow-sm hover:shadow font-semibold">
                All
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-5 text-[10px] md:text-xs">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm">
                <div className="w-3 h-1.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"></div>
                <span className="text-main font-bold">Cash Inflow</span>
              </div>
              <div className="flex items-center gap-2 bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200 shadow-sm">
                <div className="w-3 h-1.5 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"></div>
                <span className="text-main font-bold">Cash Outflows</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
                <div className="w-3 h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"></div>
                <span className="text-main font-bold">Net Cashflow</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-48 md:h-64 bg-gradient-to-b from-app/30 to-card rounded-xl p-3 md:p-4 border border-theme">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-3 md:top-4 bottom-8 md:bottom-10 flex flex-col justify-between text-[9px] md:text-[10px] font-bold text-muted pr-2">
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
                    <div key={i} className="border-t border-theme opacity-50"></div>
                  ))}
                </div>

                {/* SVG Chart */}
                <svg className="absolute inset-0 bottom-8 md:bottom-10 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e40af" stopOpacity="0.9"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="1"/>
                    </linearGradient>
                    <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9"/>
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="1"/>
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.9"/>
                      <stop offset="100%" stopColor="#34d399" stopOpacity="1"/>
                    </linearGradient>
                    
                    <linearGradient id="blueArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="cyanArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="greenArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
                    </linearGradient>
                    
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  <path d="M 0,65 L 20,55 L 40,45 L 60,40 L 80,35 L 100,30 L 100,100 L 0,100 Z" fill="url(#blueArea)"/>
                  <path d="M 0,75 L 20,65 L 40,50 L 60,35 L 80,25 L 100,15 L 100,100 L 0,100 Z" fill="url(#cyanArea)"/>
                  <path d="M 0,80 L 20,77 L 40,75 L 60,70 L 80,65 L 100,55 L 100,100 L 0,100 Z" fill="url(#greenArea)"/>
                  
                  <path d="M 0,65 L 20,55 L 40,45 L 60,40 L 80,35 L 100,30" fill="none" stroke="url(#blueGradient)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" filter="url(#glow)"/>
                  <path d="M 0,75 L 20,65 L 40,50 L 60,35 L 80,25 L 100,15" fill="none" stroke="url(#cyanGradient)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" filter="url(#glow)"/>
                  <path d="M 0,80 L 20,77 L 40,75 L 60,70 L 80,65 L 100,55" fill="none" stroke="url(#greenGradient)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" filter="url(#glow)"/>
                  
                  {[0, 20, 40, 60, 80, 100].map((x, i) => (
                    <g key={i}>
                      <circle cx={x} cy={[65,55,45,40,35,30][i]} r="1" fill="#3b82f6" className="drop-shadow"/>
                      <circle cx={x} cy={[75,65,50,35,25,15][i]} r="1" fill="#22d3ee" className="drop-shadow"/>
                      <circle cx={x} cy={[80,77,75,70,65,55][i]} r="1" fill="#34d399" className="drop-shadow"/>
                    </g>
                  ))}
                </svg>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] md:text-[10px] font-bold text-muted">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map(month => (
                    <span key={month} className="bg-card/80 px-2 py-0.5 rounded shadow-sm border border-theme">{month}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-card border border-theme rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-sm font-bold text-main mb-3">Sales by Category</h3>
            
            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 ${cat.color} rounded-full shadow-sm`}></div>
                      <span className="text-xs font-bold text-main">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-main">₹{cat.value.toLocaleString()}</p>
                      <p className="text-[10px] text-muted font-semibold">{cat.percentage}%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-app rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full ${cat.color} rounded-full transition-all duration-700 shadow-sm`}
                      style={{width: `${cat.percentage}%`}}
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
          <div className="bg-card border border-theme rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-3 border-b border-theme bg-gradient-to-r from-app/50 to-transparent">
              <h3 className="text-sm font-bold text-main">Recent Activity</h3>
            </div>
            <div className="divide-y divide-[var(--border)] max-h-[300px] overflow-y-auto">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="p-3 row-hover transition-all cursor-pointer group">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform ${
                      item.status === 'completed' ? 'bg-emerald-50 border border-emerald-200' :
                      item.status === 'pending' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'
                    }`}>
                      {item.status === 'completed' ? <Check className="text-emerald-600" size={16} /> :
                       item.status === 'pending' ? <Clock className="text-amber-600" size={16} /> :
                       <FileText className="text-blue-600" size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-main truncate">{item.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-muted font-semibold">{item.time}</span>
                        <span className="text-xs font-bold text-primary">{item.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-card border border-theme rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-3 border-b border-theme bg-gradient-to-r from-app/50 to-transparent flex items-center justify-between">
              <h3 className="text-sm font-bold text-main">Top Customers</h3>
              <button className="text-primary text-xs font-bold hover:text-primary-600 flex items-center gap-0.5 transition-colors">
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {topEntities.customers.map((customer, idx) => (
                <div key={idx} className="p-3 row-hover transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-main">{customer.name}</p>
                      <p className="text-[10px] text-muted font-semibold mt-0.5">{customer.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600">₹{customer.amount.toLocaleString()}</p>
                      <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 mt-0.5 ${
                        customer.trend > 0 ? 'text-emerald-600' : 'text-rose-600'
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
          <div className="bg-card border border-theme rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-3 border-b border-theme bg-gradient-to-r from-app/50 to-transparent flex items-center justify-between">
              <h3 className="text-sm font-bold text-main">Top Suppliers</h3>
              <button className="text-primary text-xs font-bold hover:text-primary-600 flex items-center gap-0.5 transition-colors">
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {topEntities.suppliers.map((supplier, idx) => (
                <div key={idx} className="p-3 row-hover transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-main">{supplier.name}</p>
                      <p className="text-[10px] text-muted font-semibold mt-0.5">{supplier.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-rose-600">₹{supplier.amount.toLocaleString()}</p>
                      <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 mt-0.5 ${
                        supplier.trend > 0 ? 'text-emerald-600' : 'text-rose-600'
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