import React, { useState , useEffect} from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Clock3,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { getMyLeaveHistory, getEmployeeLeaveBalance } from "../../../api/leaveApi";


/*  Types  */
type LeaveStatus = "approved" | "pending" | "rejected";

type LeaveRequest = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
};

type LeaveTypeBalance = {
  type: string;
  total: number;
  used: number;
  color: string;
};


const UPCOMING_HOLIDAYS = [
  { date: "26 Jan", name: "Republic Day" },
  { date: "14 Feb", name: "Vasant Panchami" },
  { date: "26 Mar", name: "Holi" },
];

/*  Component  */
const EmployeeDashboard: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [employeeName, setEmployeeName] = useState<string>("");
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);

  const [leaveSummary, setLeaveSummary] = useState<{
  totalLeaves: number;
  used: number;
  pending: number;
  available: number;
} | null>(null);

const [leaveTypeBalances, setLeaveTypeBalances] = useState<
  {
    type: string;
    total: number;
    used: number;
    available: number;
    color: string;
  }[]
>([]);

useEffect(() => {
  const fetchRecentLeaves = async () => {
    try {
      const res = await getMyLeaveHistory();

      const mapped = (res.data.leaves || [])
        .slice(0, 3)
        .map((l: any) => ({
          id: l.leaveId,
          type: l.leaveType.name,
          startDate: l.duration.fromDate,
          endDate: l.duration.toDate,
          days: l.duration.totalDays,
          reason: l.leaveReason,
          status:
            l.status === "OPEN"
              ? "pending"
              : l.status === "APPROVED"
              ? "approved"
              : "rejected",
          appliedOn: l.appliedOn,
        }));

      setRecentRequests(mapped);
    } catch {
      setRecentRequests([]);
    }
  };

  fetchRecentLeaves();
}, []);



useEffect(() => {
  const fetchLeaveBalance = async () => {
    const res = await getEmployeeLeaveBalance();

    setEmployeeName(res.data.employeeName ?? "");

    const summary = res.data.summary;
    const balances = res.data.balances;

    setLeaveSummary(summary);

    setLeaveTypeBalances(
      balances.map((b: any) => ({
        type: b.leaveType.name,
        total: b.total,
        used: b.used,
        available: b.available,
        color: "bg-primary", // UI concern only
      }))
    );
  };

  fetchLeaveBalance();
}, []);


  const handleQuickAction = (action: string) => {
    setSelectedAction(action);
    console.log(`Navigate to: ${action}`);
  };

  return (
    <div className="bg-app p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-main">
               Welcome back, {employeeName || "—"}

            </h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted">Today</div>
            <div className="text-sm font-semibold text-main">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatCard
            label="Total Balance"
            value={leaveSummary?.totalLeaves ?? 0}
            icon={Calendar}
            color="text-blue-600"
            bgColor="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            label="Used"
           value={leaveSummary?.used ?? 0}
            icon={CheckCircle}
            color="text-green-600"
            bgColor="bg-green-100 dark:bg-green-900/30"
          />
          <StatCard
            label="Pending"
          value={leaveSummary?.pending ?? 0}
            icon={Clock3}
            color="text-yellow-600"
            bgColor="bg-yellow-100 dark:bg-yellow-900/30"
          />
          <StatCard
            label="Remaining"
           value={leaveSummary?.available ?? 0}

            icon={TrendingUp}
            color="text-purple-600"
            bgColor="bg-purple-100 dark:bg-purple-900/30"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Recent Requests (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Recent Leave Requests */}
            <div className="bg-card border border-theme rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-main flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  Recent Leave Requests
                </h2>
                <button className="text-xs text-primary hover:underline font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {recentRequests.length === 0 && (
                  <div className="text-xs text-muted text-center py-6">
                    No recent leave requests
                  </div>
                )}

                  {recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-app border border-theme rounded-lg p-3 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-main text-sm">
                            {req.type}
                          </span>
                          <StatusBadge status={req.status} />
                          <span className="pl-25 text-xs text-muted">
                            {req.startDate} → {req.endDate} ({req.days}{" "}
                            {req.days === 1 ? "day" : "days"})
                          </span>
                        </div>
                        <p className="text-xs text-main italic">
                          "{req.reason}"
                        </p>
                      </div>
                      <div className="text-right bg-card rounded px-2 py-1 border border-theme">
                        <div className="text-xs text-muted">Applied on</div>
                        <div className="text-xs font-semibold text-main">
                          {new Date(req.appliedOn).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Type Breakdown */}
            <div className="bg-card border border-theme rounded-xl p-4">
              <h2 className="text-lg font-bold text-main flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-primary" />
                Leave Type Breakdown
              </h2>

              <div className="space-y-3">
                {leaveTypeBalances.map((leave, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-main">
                        {leave.type}
                      </span>
                      <span className="text-xs text-muted">
                        {leave.used} / {leave.total} used
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-app rounded-full h-3 overflow-hidden">
                        <div
                          className={`${leave.color} h-full rounded-full transition-all duration-500`}
                          style={{
                            width: `${(leave.used / leave.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-main min-w-[3rem] text-right">
                        {leave.total - leave.used} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions, Holidays, Policy */}
          <div className="space-y-4">
            {/* Upcoming Holidays */}
            <div className="bg-card border border-theme rounded-xl p-3">
              <h2 className="text-base font-bold text-main mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Upcoming Holidays
              </h2>

              <div className="space-y-1.5">
                {UPCOMING_HOLIDAYS.map((holiday, idx) => (
                  <HolidayItem key={idx} date={holiday.date} name={holiday.name} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-theme rounded-xl p-3">
              <h2 className="text-base font-bold text-main mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Quick Actions
              </h2>

              <div className="space-y-1.5">
                <button
                  onClick={() => handleQuickAction("apply")}
                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-app border border-theme hover:bg-primary/10 transition"
                >
                  <Calendar size={14} className="text-primary" />
                  <span className="text-xs font-medium text-main">
                    Apply Leave
                  </span>
                </button>

                <button
                  onClick={() => handleQuickAction("history")}
                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-app border border-theme hover:bg-primary/10 transition"
                >
                  <FileText size={14} className="text-primary" />
                  <span className="text-xs font-medium text-main">
                    View History
                  </span>
                </button>

                <button
                  onClick={() => handleQuickAction("calendar")}
                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-app border border-theme hover:bg-primary/10 transition"
                >
                  <Clock size={14} className="text-primary" />
                  <span className="text-xs font-medium text-main">
                    View Calendar
                  </span>
                </button>
              </div>
            </div>

            {/* Leave Policy */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-main mb-2 text-sm">Leave Policy</h3>
                  <ul className="text-xs text-muted space-y-1">
                    <li>• Apply 3 days in advance</li>
                    <li>• Max 7 consecutive days</li>
                    <li>• Emergency leaves need manager approval</li>
                    <li>• Unused leaves carry forward</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/*  Stat Card Component  */
const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
}) => (
  <div className="bg-card border border-theme rounded-xl p-4 hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs text-muted mb-1 uppercase tracking-wide">{label}</div>
        <div className="text-3xl font-bold text-main">{value}</div>
      </div>
      <div className={`${bgColor} p-3 rounded-lg`}>
        <Icon size={22} className={color} />
      </div>
    </div>
  </div>
);

/*  Status Badge  */
const StatusBadge = ({ status }: { status: LeaveStatus }) => {
  const styles = {
    approved: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  };

  const icons = {
    approved: CheckCircle,
    pending: Clock3,
    rejected: XCircle,
  };

  const Icon = icons[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      <Icon size={12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

/*  Holiday Item  */
const HolidayItem = ({ date, name }: { date: string; name: string }) => (
  <div className="flex items-center gap-2 p-2 bg-app border border-theme rounded-lg hover:shadow-sm transition">
    <div className="bg-primary/10 px-2 py-1 rounded">
      <div className="text-xs font-bold text-primary">{date}</div>
    </div>
    <div className="text-xs font-medium text-main">{name}</div>
  </div>
);

export default EmployeeDashboard;