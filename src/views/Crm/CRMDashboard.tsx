import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  TicketIcon,
  DollarSign,
  Activity,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

// Types
type TrendRangeType = "7D" | "30D" | "90D" | "1Y";
type TrendDataPoint = { label: string; sales: number; customers: number; };

// Enhanced KPI Cards with comprehensive data
const kpiData = [
  { 
    label: "Total Revenue", 
    value: "₹2.4M", 
    change: 12.5, 
    subtext: "vs last month",
    icon: DollarSign, 
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  { 
    label: "Active Customers", 
    value: "1,247", 
    change: 8.2, 
    subtext: "+102 this month",
    icon: Users, 
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  { 
    label: "Active Leads", 
    value: "42", 
    change: 5.3, 
    subtext: "16.7% conversion",
    icon: UserPlus, 
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  { 
    label: "Open Tickets", 
    value: "9", 
    change: -15.2, 
    subtext: "Avg 2.3h response",
    icon: TicketIcon, 
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  { 
    label: "Closed Deals", 
    value: "28", 
    change: 23.1, 
    subtext: "₹1.2M value",
    icon: Target, 
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600"
  },
  { 
    label: "Pipeline Value", 
    value: "₹8.9M", 
    change: 15.7, 
    subtext: "35 opportunities",
    icon: Activity, 
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600"
  },
];

// Time Ranges
const timeRanges: TrendRangeType[] = ["7D", "30D", "90D", "1Y"];

// Enhanced Sales & Revenue Trend Data
const salesTrendByPeriod: Record<TrendRangeType, TrendDataPoint[]> = {
  "7D": [
    { label: "Mon", sales: 32000, customers: 45 },
    { label: "Tue", sales: 41000, customers: 52 },
    { label: "Wed", sales: 38000, customers: 48 },
    { label: "Thu", sales: 51000, customers: 61 },
    { label: "Fri", sales: 49000, customers: 58 },
    { label: "Sat", sales: 35000, customers: 42 },
    { label: "Sun", sales: 28000, customers: 35 },
  ],
  "30D": [
    { label: "Week 1", sales: 145000, customers: 180 },
    { label: "Week 2", sales: 168000, customers: 205 },
    { label: "Week 3", sales: 152000, customers: 190 },
    { label: "Week 4", sales: 195000, customers: 235 },
  ],
  "90D": [
    { label: "Month 1", sales: 580000, customers: 720 },
    { label: "Month 2", sales: 640000, customers: 780 },
    { label: "Month 3", sales: 720000, customers: 850 },
  ],
  "1Y": [
    { label: "Jan", sales: 450000, customers: 580 },
    { label: "Feb", sales: 520000, customers: 640 },
    { label: "Mar", sales: 480000, customers: 610 },
    { label: "Apr", sales: 580000, customers: 720 },
    { label: "May", sales: 640000, customers: 780 },
    { label: "Jun", sales: 720000, customers: 850 },
    { label: "Jul", sales: 680000, customers: 820 },
    { label: "Aug", sales: 750000, customers: 890 },
    { label: "Sep", sales: 810000, customers: 950 },
    { label: "Oct", sales: 780000, customers: 920 },
    { label: "Nov", sales: 850000, customers: 1000 },
    { label: "Dec", sales: 920000, customers: 1080 },
  ],
};

// Lead Sources with enhanced data
const leadSources = [
  { name: "Website", value: 156, color: "#3b82f6", percentage: 35 },
  { name: "Referral", value: 98, color: "#8b5cf6", percentage: 22 },
  { name: "LinkedIn", value: 124, color: "#06b6d4", percentage: 28 },
  { name: "Events", value: 45, color: "#f59e0b", percentage: 10 },
  { name: "Cold Call", value: 22, color: "#10b981", percentage: 5 },
];

// Sales Pipeline by Stage with detailed metrics
const pipelineStages = [
  { stage: "Prospecting", count: 18, value: 280000, avgDays: 5, color: "#94a3b8" },
  { stage: "Qualification", count: 12, value: 420000, avgDays: 8, color: "#3b82f6" },
  { stage: "Proposal", count: 8, value: 580000, avgDays: 12, color: "#8b5cf6" },
  { stage: "Negotiation", count: 5, value: 450000, avgDays: 15, color: "#f59e0b" },
  { stage: "Closed Won", count: 7, value: 620000, avgDays: 0, color: "#10b981" },
];

// Recent Activities with rich metadata
const recentActivities = [
  { 
    id: 1, 
    type: "lead", 
    action: "New qualified lead added", 
    customer: "Global Enterprises Ltd.", 
    time: "5 min ago", 
    status: "qualified",
    value: "₹2.5L",
    user: "Rajesh Kumar"
  },
  { 
    id: 2, 
    type: "ticket", 
    action: "High priority ticket resolved", 
    customer: "Tech Solutions Inc.", 
    time: "23 min ago", 
    status: "resolved",
    priority: "High",
    user: "Priya Sharma"
  },
  { 
    id: 3, 
    type: "deal", 
    action: "Deal moved to negotiation", 
    customer: "QuickMart Retail", 
    time: "1 hour ago", 
    status: "negotiation",
    value: "₹6.5L",
    user: "Amit Patel"
  },
  { 
    id: 4, 
    type: "customer", 
    action: "Customer profile updated", 
    customer: "ABC Corporation", 
    time: "2 hours ago", 
    status: "updated",
    user: "Sneha Reddy"
  },
  { 
    id: 5, 
    type: "deal", 
    action: "Deal closed successfully", 
    customer: "Digital Dynamics", 
    time: "3 hours ago", 
    status: "won",
    value: "₹4.2L",
    user: "Vikram Singh"
  },
  { 
    id: 6, 
    type: "lead", 
    action: "Lead contacted via email", 
    customer: "Innovative Systems", 
    time: "4 hours ago", 
    status: "contacted",
    user: "Neha Gupta"
  },
];

// Ticket Statistics
const ticketStats = {
  total: 127,
  open: 9,
  inProgress: 18,
  resolved: 85,
  closed: 15,
  avgResponseTime: "2.3 hrs",
  avgResolutionTime: "8.5 hrs",
  satisfaction: 94
};

// Top Opportunities with comprehensive data
const topOpportunities = [
  { 
    name: "Tech Corp International", 
    stage: "Proposal Sent", 
    value: 250000, 
    probability: 75, 
    contact: "Jane Wilson",
    email: "jane.w@techcorp.com",
    phone: "+91 98765 43210",
    expectedClose: "2025-01-15",
    owner: "Rajesh Kumar"
  },
  { 
    name: "Smartsoft LLC", 
    stage: "Negotiation", 
    value: 180000, 
    probability: 85, 
    contact: "Bob Chen",
    email: "bob@smartsoft.com",
    phone: "+91 98123 45678",
    expectedClose: "2025-01-10",
    owner: "Priya Sharma"
  },
  { 
    name: "Acme Bank Solutions", 
    stage: "Demo Scheduled", 
    value: 420000, 
    probability: 45, 
    contact: "Alice Johnson",
    email: "alice.j@acmebank.com",
    phone: "+91 97654 32109",
    expectedClose: "2025-02-01",
    owner: "Amit Patel"
  },
  { 
    name: "QuickMart Retail Chain", 
    stage: "Won (Closed)", 
    value: 95000, 
    probability: 100, 
    contact: "Mike Ross",
    email: "mike@quickmart.in",
    phone: "+91 96543 21098",
    expectedClose: "2024-12-28",
    owner: "Sneha Reddy"
  },
  { 
    name: "Global Enterprises", 
    stage: "Qualification", 
    value: 350000, 
    probability: 35, 
    contact: "Sarah Connor",
    email: "sarah@globalent.com",
    phone: "+91 95432 10987",
    expectedClose: "2025-02-15",
    owner: "Vikram Singh"
  },
];

// Team Performance Data
const teamPerformance = [
  { name: "Rajesh K.", deals: 12, revenue: 2400000, conversionRate: 68, color: "#3b82f6" },
  { name: "Priya S.", deals: 10, revenue: 1950000, conversionRate: 72, color: "#8b5cf6" },
  { name: "Amit P.", deals: 8, revenue: 1680000, conversionRate: 58, color: "#10b981" },
  { name: "Sneha R.", deals: 9, revenue: 1820000, conversionRate: 65, color: "#f59e0b" },
  { name: "Vikram S.", deals: 7, revenue: 1520000, conversionRate: 55, color: "#06b6d4" },
];

// Component for KPI Change Indicator
const KPIChange: React.FC<{ change: number }> = ({ change }) => {
  const isPositive = change > 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  
  return (
    <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
      <Icon className="w-4 h-4" />
      <span>{Math.abs(change)}%</span>
    </div>
  );
};

// Main Dashboard Component
const CRMDashboard: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TrendRangeType>("30D");
  const [showActions, setShowActions] = useState<string | null>(null);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 min-h-screen w-full pb-8">
      <div className="bg-app max-w-[1600px] mx-auto px-6">
        

        {/* Enhanced KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
          {kpiData.map(({ label, value, change, subtext, icon: Icon, color, bgColor, iconColor }) => (
            <div
              key={label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <KPIChange change={change} />
              </div>
              <div className="text-gray-500 text-sm mb-1 font-medium">{label}</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
              <div className="text-xs text-gray-400 font-medium">{subtext}</div>
            </div>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue & Sales Trend - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Revenue & Sales Trend</h3>
                  <p className="text-sm text-gray-500 mt-1">Track your sales performance over time</p>
                </div>
                <div className="flex gap-2">
                  {timeRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedRange(range)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                        selectedRange === range
                          ? "bg-indigo-600 text-white shadow-md scale-105"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={salesTrendByPeriod[selectedRange]}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'sales' ? `₹${(value / 1000).toFixed(0)}K` : value,
                      name === 'sales' ? 'Revenue' : 'Customers'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="url(#colorSales)"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="customers"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorCustomers)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Sources Pie Chart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">Lead Sources</h3>
                <p className="text-sm text-gray-500 mt-1">Where your leads come from</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={leadSources}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    innerRadius={60}
                    labelLine={false}
                    label={({ percentage }) => `${percentage}%`}
                  >
                    {leadSources.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', fontWeight: '600', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sales Pipeline & Team Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Pipeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">Sales Pipeline</h3>
              <p className="text-sm text-gray-500 mt-1">Deal progression by stage</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={pipelineStages} layout="vertical">
                <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="stage" type="category" width={110} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `₹${(value / 1000).toFixed(0)}K (${props.payload.count} deals)`,
                    'Value'
                  ]}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {pipelineStages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Team Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">Team Performance</h3>
              <p className="text-sm text-gray-500 mt-1">Top performers this month</p>
            </div>
            <div className="space-y-4">
              {teamPerformance.map((member, idx) => (
                <div key={member.name} className="flex items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: member.color }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.deals} deals closed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{(member.revenue / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-gray-500">{member.conversionRate}% conv.</p>
                  </div>
                  <div className="w-24">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${member.conversionRate}%`,
                          backgroundColor: member.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed & Ticket Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
              <p className="text-sm text-gray-500 mt-1">Latest updates across your CRM</p>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 rounded-xl transition-all duration-200 border border-gray-100 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 ${
                    activity.type === 'lead' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                    activity.type === 'ticket' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    activity.type === 'deal' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                    'bg-gradient-to-br from-purple-400 to-purple-600'
                  }`}>
                    {activity.type === 'lead' ? <UserPlus className="w-6 h-6 text-white" /> :
                     activity.type === 'ticket' ? <TicketIcon className="w-6 h-6 text-white" /> :
                     activity.type === 'deal' ? <Target className="w-6 h-6 text-white" /> :
                     <Users className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.customer}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </span>
                      <span className="text-xs text-gray-500">by {activity.user}</span>
                      {activity.value && (
                        <span className="text-xs font-semibold text-green-600">{activity.value}</span>
                      )}
                    </div>
                  </div>
                  {(activity.status === 'won' || activity.status === 'resolved') && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">Ticket Stats</h3>
              <p className="text-sm text-gray-500 mt-1">Support performance</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Open</span>
                  <span className="text-2xl font-bold text-blue-600">{ticketStats.open}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(ticketStats.open / ticketStats.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">In Progress</span>
                  <span className="text-2xl font-bold text-orange-600">{ticketStats.inProgress}</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(ticketStats.inProgress / ticketStats.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Resolved</span>
                  <span className="text-2xl font-bold text-green-600">{ticketStats.resolved}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(ticketStats.resolved / ticketStats.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Avg Response</p>
                  <p className="text-lg font-bold text-gray-900">{ticketStats.avgResponseTime}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Satisfaction</p>
                  <p className="text-lg font-bold text-green-600">{ticketStats.satisfaction}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Opportunities Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Top Opportunities</h3>
                <p className="text-sm text-gray-500 mt-1">Your most valuable deals in the pipeline</p>
              </div>
              <button className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Client Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Deal Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Win Probability
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Expected Close
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topOpportunities.map((op, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-blue-50/50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md group-hover:scale-110 transition-transform duration-200">
                          {op.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{op.name}</div>
                          <div className="text-xs text-gray-500">Owner: {op.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900 mb-1">{op.contact}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          {op.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Phone className="w-3 h-3" />
                          {op.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-lg ${
                        op.stage.includes('Won') ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md' :
                        op.stage.includes('Negotiation') ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md' :
                        op.stage.includes('Proposal') ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md' :
                        op.stage.includes('Demo') ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md' :
                        'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md'
                      }`}>
                        {op.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600">
                        ₹{(op.value / 1000).toFixed(0)}K
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${
                                op.probability >= 70 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                op.probability >= 50 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                op.probability >= 30 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                'bg-gradient-to-r from-red-400 to-red-600'
                              }`}
                              style={{ width: `${op.probability}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 min-w-[45px]">{op.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(op.expectedClose).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setShowActions(showActions === op.name ? null : op.name)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;