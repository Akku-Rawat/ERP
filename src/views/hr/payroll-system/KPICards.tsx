// KPICards.tsx
import React from "react";
import { Users, CheckCircle, Clock, DollarSign, ArrowUpRight } from "lucide-react";

interface KPICardsProps {
  totalRecords: number;
  paidCount: number;
  pendingCount: number;
  totalPayout: number;
}

const Card: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon: React.ReactNode;
  accent: "primary" | "success" | "warning" | "info";
  trend?: string;
}> = ({ label, value, sub, icon, accent, trend }) => {
  const accentMap = {
    primary: { ring: "ring-primary/20", iconBg: "bg-primary/10", iconColor: "text-primary",  val: "text-primary"  },
    success: { ring: "ring-success/20", iconBg: "bg-success/10", iconColor: "text-success",  val: "text-success"  },
    warning: { ring: "ring-warning/20", iconBg: "bg-warning/10", iconColor: "text-warning",  val: "text-warning"  },
    info:    { ring: "ring-info/20",    iconBg: "bg-info/10",    iconColor: "text-info",      val: "text-info"     },
  };
  const a = accentMap[accent];

  return (
    <div className={`bg-card border border-theme rounded-2xl p-5 ring-1 ${a.ring} flex flex-col gap-4 transition-shadow hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${a.iconBg} ${a.iconColor}`}>{icon}</div>
        {trend && (
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" />{trend}
          </span>
        )}
      </div>
      <div>
        <p className={`text-2xl font-extrabold ${a.val} tabular-nums`}>{value}</p>
        <p className="text-sm text-muted mt-0.5">{label}</p>
        {sub && <p className={`text-[11px] font-semibold ${a.iconColor} mt-1`}>{sub}</p>}
      </div>
    </div>
  );
};

export const KPICards: React.FC<KPICardsProps> = ({
  totalRecords, paidCount, pendingCount, totalPayout,
}) => {
  const completion = totalRecords > 0 ? Math.round((paidCount / totalRecords) * 100) : 0;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        label="Total Employees"
        value={totalRecords}
        icon={<Users className="w-5 h-5" />}
        accent="info"
        trend="+2 this month"
      />
      <Card
        label="Net Payout"
        value={`₹${(totalPayout / 1000).toFixed(0)}K`}
        sub={`₹${totalPayout.toLocaleString("en-IN")} total`}
        icon={<DollarSign className="w-5 h-5" />}
        accent="primary"
      />
      <Card
        label="Processed"
        value={`${paidCount}/${totalRecords}`}
        sub={`${completion}% completion rate`}
        icon={<CheckCircle className="w-5 h-5" />}
        accent="success"
      />
      <Card
        label="Pending"
        value={pendingCount}
        sub={pendingCount > 0 ? "Action required" : "All up to date"}
        icon={<Clock className="w-5 h-5" />}
        accent={pendingCount > 0 ? "warning" : "info"}
      />
    </div>
  );
};