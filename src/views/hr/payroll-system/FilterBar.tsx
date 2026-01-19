import React from 'react';
import { Search, FileSpreadsheet, TrendingUp } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDept: string;
  setSelectedDept: (d: string) => void;
  filterStatus: string;
  setFilterStatus: (s: string) => void;
  departments: string[];
  onExport: () => void;
  onRunPayroll: () => void;
  pendingCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDept,
  setSelectedDept,
  filterStatus,
  setFilterStatus,
  departments,
  onExport,
  onRunPayroll,
  pendingCount
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <select
        value={selectedDept}
        onChange={(e) => setSelectedDept(e.target.value)}
        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {departments.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
      </select>

      <button
        onClick={onExport}
        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Export
      </button>

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