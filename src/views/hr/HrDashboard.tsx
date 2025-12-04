import React, { useState, useMemo } from 'react';
import {
  FaArrowUp, FaSync, FaDownload, FaChevronRight,
  FaChevronDown, FaBell, FaSearch
} from 'react-icons/fa';
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// ----- Mock data -----
const fullHeadcountData = { week: [], month: [], quarter: [] };
const fullAttendanceData = { week: [], month: [], quarter: [] };
const fullMonthlyAttendance = { week: [], month: [], quarter: [] };

const recentPayroll = [
  { name: 'Michelle Martin', date: 'September 23, 2024', amount: '$3,200', status: 'Success', avatar: 'MM' },
  { name: 'Jorge Perez', date: 'September 23, 2024', amount: '$5,000', status: 'Success', avatar: 'JP' },
  { name: 'Priyanka Kumar', date: 'September 23, 2024', amount: '$2,900', status: 'Success', avatar: 'PK' },
  { name: 'Arunti Choudhary', date: 'September 23, 2024', amount: '$3,200', status: 'Delay', avatar: 'AC' },
  { name: 'Ruth Anderson', date: 'September 23, 2024', amount: '$2,300', status: 'Success', avatar: 'RA' }
];

const attendanceDetails = [
  { emp: 'Ankit Mandal', id: 'EMP-12487', checkIn: '07:02:01', checkOut: '00:00:00', status: 'Late' },
  { emp: 'Dan Hall', id: 'EMP-12487', checkIn: '07:01:54', checkOut: '00:00:00', status: 'Late' },
  { emp: 'Karan Mehta', id: 'EMP-12487', checkIn: '07:01:22', checkOut: '00:00:00', status: 'Late' },
  { emp: 'Yuni Sudiati', id: 'EMP-12493', checkIn: '06:59:12', checkOut: '00:00:00', status: 'Attend' },
  { emp: 'Abdullah Baidadi', id: 'EMP-12497', checkIn: '06:56:43', checkOut: '00:00:00', status: 'Attend' }
];

const dayoffRequests = [
  { name: 'Rebecca Simmons', role: 'UI Designer', avatar: 'RS' },
  { name: 'Carol Anderson', role: 'Marketing Officer', avatar: 'CA' },
  { name: 'Yash Devi', role: 'Senior Designer', avatar: 'YD' },
  { name: 'Mohamed Ali', role: 'Product Manager', avatar: 'MA' }

];

// ----- Schedule components -----

type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  kind: 'meeting' | 'event';
};

function ScheduleRow({ item }: { item: ScheduleItem }) {
  const color = item.kind === 'meeting' ? 'bg-emerald-100' : 'bg-sky-100';
  const accent = item.kind === 'meeting' ? 'bg-emerald-400' : 'bg-sky-400';

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
      <div className={`w-3 h-12 rounded-lg ${color} flex-shrink-0`} />

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-gray-400">{item.time}</div>
            <div className="font-medium">{item.title}</div>
            {item.subtitle && <div className="text-sm text-gray-400">{item.subtitle}</div>}
          </div>

          <div className="ml-3">
            <div className={`text-xs px-2 py-1 rounded-md ${accent} text-white/95`}> </div>
          </div>
        </div>
      </div>

      <div className="text-gray-400">⋯</div>
    </div>
  );
}

function ScheduleCard() {
  const [currentMonth, setCurrentMonth] = useState('Aug, 2024');
  const [selectedIndex, setSelectedIndex] = useState(4);

  const weekDays = useMemo(() => {
    return ['09', '10', '11', '12', '13', '14', '15'].map((d, i) => ({
      label: d,
      short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]
    }));
  }, []);

  const items: ScheduleItem[] = [
    { id: 'm1', time: '10:00 - 11:00', title: 'Meeting with Director Board', subtitle: 'Call by Directors', kind: 'meeting' },
    { id: 'm2', time: '11:30 - 12:00', title: '1:1 with Product', subtitle: 'Product', kind: 'meeting' },
    { id: 'e1', time: '12:30 - 13:00', title: 'Product Launch Sync', subtitle: 'Marketing', kind: 'event' },
    { id: 'e2', time: '12:30 - 13:00', title: 'Ashwin birthday', subtitle: 'Birthday', kind: 'event' },
    { id: 'e3', time: '12:30 - 13:00', title: 'adam birthday', subtitle: 'Birthday', kind: 'event' },
    { id: 'e4', time: '12:30 - 13:00', title: 'crishmorus Birthday', subtitle: 'Birthday', kind: 'event' },
   
];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-md font-semibold">Schedule</h3>
          <p className="text-xs text-gray-500">Don't forget your daily activity</p>
        </div>
        <select
          aria-label="month"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="text-sm px-3 py-2 border rounded-lg bg-white focus:outline-none"
        >
          <option>Aug, 2024</option>
          <option>Sep, 2024</option>
          <option>Oct, 2024</option>
        </select>
      </div>

      <div className="flex items-center justify-between pb-3 mb-3">
        <button onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))} className="px-2 py-1 text-gray-600">◀</button>
        <div className="flex gap-2 flex-wrap justify-center">
          {weekDays.map((d, i) => (
            <button
              key={d.label}
              onClick={() => setSelectedIndex(i)}
              className={`min-w-[56px] flex flex-col items-center gap-1 py-2 px-3 rounded-2xl border transition-all focus:outline-none ${
                i === selectedIndex
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border-gray-100'
              }`}
            >
              <span className="text-xs">{d.short}</span>
              <span className="font-medium">{d.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setSelectedIndex(Math.min(6, selectedIndex + 1))} className="px-2 py-1 text-gray-600">▶</button>
      </div>

      <div className="border-t mt-2 mb-3" />

      <div>
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700">Meetings</h4>
        </div>
        <div className="flex flex-col gap-3">
          {items.filter((it) => it.kind === 'meeting').map((it) => (
            <ScheduleRow key={it.id} item={it} />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700">Events</h4>
        </div>
        <div className="flex flex-col gap-3">
          {items.filter((it) => it.kind === 'event').map((it) => (
            <ScheduleRow key={it.id} item={it} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ----- AttendanceRateCard (heatmap UI) -----
function AttendanceRateCard({ monthlyAttendance, timeRange }: { monthlyAttendance?: any; timeRange?: string }) {
  const times = ['11:00', '10:00', '09:00', '08:00'];
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const matrix = [
    [0,1,2,3,2,1,0],
    [0,2,2,3,1,1,0],
    [0,1,3,2,2,1,0],
    [0,0,1,1,0,0,0]
  ];

  const colorFor = (v:number) => {
    switch(v){
      case 3: return 'bg-blue-700';
      case 2: return 'bg-blue-400';
      case 1: return 'bg-blue-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm text-gray-600 font-medium">Attendance Rate</span>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-2xl font-bold text-gray-900">20%</span>
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md"><FaArrowUp className="text-xs" /> From last month</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs"><span className="text-gray-400 capitalize">{timeRange}</span><FaChevronDown className="text-gray-400 text-xs" /></div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-2 text-xs text-gray-500 mr-2">
          {times.map(t => (
            <div key={t} className="h-8 flex items-center">{t}</div>
          ))}
        </div>

        <div>
          <div className="grid grid-rows-4 grid-cols-7 gap-2">
            {matrix.flatMap((row, rIdx) => row.map((val, cIdx) => (
              <div key={`${rIdx}-${cIdx}`} className={`w-8 h-8 rounded-lg ${colorFor(val)} shadow-sm`} />
            )))}
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            {days.map(d => (
              <div key={d} className="w-8 text-center">{d}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- Main HrDashboard -----
const HrDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Dashboard refreshed!');
  };

  const headcountData = useMemo(() => fullHeadcountData[timeRange], [timeRange]);
  const attendanceWeekData = useMemo(() => fullAttendanceData[timeRange], [timeRange]);
  const monthlyAttendance = useMemo(() => fullMonthlyAttendance[timeRange], [timeRange]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="max-w-[1800px] mx-auto space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-md">JD</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
                <p className="text-sm text-gray-500">{formatTime(currentTime)} • {formatDate(currentTime)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition"><FaSearch className="text-gray-600" /></button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition relative">
                <FaBell className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'quarter')}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              <button onClick={handleRefresh} className="p-2.5 rounded-lg hover:bg-gray-100 transition" title="Refresh Dashboard">
                <FaSync className={`text-gray-600 ${refreshKey > 0 ? 'animate-spin' : ''}`} />
              </button>
              <button className="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm flex items-center gap-2 transition shadow-sm"><FaDownload /> Export</button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" key={refreshKey}>

            {/* Left Column */}
            <div className="lg:col-span-8 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-medium">Average KPI Score</span>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-400">Last 90 Days</span>
                      <FaChevronDown className="text-gray-400 text-xs" />
                    </div>
                  </div>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-4xl font-bold text-gray-900">4.76</span>
                    <span className="text-sm text-green-600 font-semibold mb-1 flex items-center gap-1"><FaArrowUp className="text-xs" /> 2.44%</span>
                  </div>
                  <div className="relative h-24 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ month: 'Jul', value: 87 },{ month: 'Aug', value: 85.6 },{ month: 'Sep', value: 90.4 }]}>
                        <Bar dataKey="value" radius={[6,6,0,0]}>
                          {[0,1,2].map((_, index) => (<Cell key={index} fill={index === 2 ? '#FF6B35' : '#FFE5DC'} />))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm cursor-pointer hover:text-teal-600 transition">
                      <span className="text-gray-600">Below Average Employee</span>
                      <FaChevronRight className="text-gray-400" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 mt-1">29 Employees</div>
                  </div>
                </div>
 <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-lg font-bold text-gray-900">Recent Payroll</span>
                  <button 
                  onclick={() => {alert('Navigating to Payroll Management Page');
                  }}
                    className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition shadow-sm"><FaChevronRight /></button>
                </div>

                <div className="space-y-3.5">
                  {recentPayroll.map((pay, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-semibold">{pay.avatar}</div>
                        <div><div className="text-sm font-semibold text-gray-900">{pay.name}</div><div className="text-xs text-gray-500">{pay.date}</div></div>
                      </div>
                      <div className="text-right"><div className="text-sm font-bold text-gray-900">{pay.amount}</div><div className={`text-xs font-semibold ${pay.status === 'Success' ? 'text-green-600' : 'text-yellow-600'}`}>{pay.status}</div></div>
                    </div>
                  ))}
                </div>
              </div>
                <div className="bg-gradient-to-br from-blue-100 via-blue-100 to-blue-50 rounded-2xl p-5 text-white shadow-lg"><span className="mt-9 text-lg font-bold text-gray-900">Dayoff Request</span>

                <div className="mt-5 space-y-3">
                  {dayoffRequests.map((req, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full  bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-semibold">{req.avatar}</div>
                        <div className="min-w-0"><div className="text-sm font-semibold text-gray-900 truncate">{req.name}</div><div className="text-xs text-gray-600">{req.role}</div></div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <button className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition shadow-sm">✕</button>
                        <button className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition shadow-sm">✓</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Attendance heatmap replaced via component below */}
                <AttendanceRateCard monthlyAttendance={monthlyAttendance} timeRange={timeRange} />

                <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900">Attendance Detail</span>
                    <FaChevronRight className="text-gray-400 cursor-pointer hover:text-teal-600 transition" />
                  </div>

                  <div className="space-y-2.5">
                    {attendanceDetails.map((att, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">{att.emp.split(' ').map(n => n[0]).join('')}</div>
                          <div className="min-w-0"><div className="text-sm font-semibold text-gray-900 truncate">{att.emp}</div><div className="text-xs text-gray-500">{att.id}</div></div>
                        </div>
                        <div className="text-sm text-gray-600 mx-4">{att.checkIn}</div>
                        <div className="text-sm text-gray-600 mx-4">{att.checkOut}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${att.status === 'Attend' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {att.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-5">
              <ScheduleCard />

             

              
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default HrDashboard;
