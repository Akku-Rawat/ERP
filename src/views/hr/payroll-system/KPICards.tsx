import React from "react";
import { Users, CheckCircle, Clock, DollarSign } from "lucide-react";

interface KPICardsProps {
  totalRecords: number;
  paidCount: number;
  pendingCount: number;
  totalPayout: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalRecords,
  paidCount,
  pendingCount,
  totalPayout,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-card rounded-xl shadow-sm border border-theme p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-info rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium text-muted">TOTAL</span>
        </div>
        <p className="text-2xl font-bold text-main">{totalRecords}</p>
        <p className="text-sm text-muted mt-1">Employees</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-theme p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-success rounded-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium text-muted">PAID</span>
        </div>
        <p className="text-2xl font-bold text-success">{paidCount}</p>
        <p className="text-sm text-muted mt-1">Processed</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-theme p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-warning rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium text-muted">PENDING</span>
        </div>
        <p className="text-2xl font-bold text-warning">{pendingCount}</p>
        <p className="text-sm text-muted mt-1">To Process</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-theme p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-primary rounded-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium text-muted">PAYOUT</span>
        </div>
        <p className="text-2xl font-bold text-primary">
          ₹{(totalPayout / 1000).toFixed(0)}K
        </p>
        <p className="text-sm text-muted mt-1">Net Amount</p>
      </div>
    </div>
  );
};