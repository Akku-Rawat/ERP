// FilterBar.tsx - Search and filter component

import React from 'react';
import { Search, TrendingUp } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDept: string;
  onDeptChange: (value: string) => void;
  departments: string[];
  filterStatus: string;
  onStatusChange: (value: string) => void;
  pendingCount: number;
  onRunPayroll: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDept,
  onDeptChange,
  departments,
  filterStatus,
  onStatusChange,
  pendingCount,
  onRunPayroll
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => onDeptChange(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>

        {pendingCount > 0 && (
          <button
            onClick={onRunPayroll}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center gap-2 shadow-lg"
          >
            <TrendingUp className="w-4 h-4" />
            Run Payroll ({pendingCount})
          </button>
        )}
      </div>
    </div>
  );
};