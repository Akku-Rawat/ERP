// KPICards.tsx - Dashboard KPI statistics cards

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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-slate-500">TOTAL</span>
        </div>
        <p className="text-2xl font-bold text-slate-800">{totalRecords}</p>
        <p className="text-sm text-slate-600 mt-1">Employees</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-xs font-medium text-slate-500">PAID</span>
        </div>
        <p className="text-2xl font-bold text-green-600">{paidCount}</p>
        <p className="text-sm text-slate-600 mt-1">Processed</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-amber-100 rounded-lg">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-xs font-medium text-slate-500">PENDING</span>
        </div>
        <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        <p className="text-sm text-slate-600 mt-1">To Process</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-xs font-medium text-slate-500">PAYOUT</span>
        </div>
        <p className="text-2xl font-bold text-purple-600">
          ₹{(totalPayout / 1000).toFixed(0)}K
        </p>
        <p className="text-sm text-slate-600 mt-1">Net Amount</p>
      </div>
    </div>
  );
};
