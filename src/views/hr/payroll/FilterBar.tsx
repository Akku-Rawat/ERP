import React from 'react';
import { Search, Download, DollarSign, Plus } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  departments: string[];
  onCreatePayroll: () => void;
  onExport: () => void;
  onProcessPayroll: () => void;
  pendingCount: number;
  hasRecords: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDept,
  setSelectedDept,
  filterStatus,
  setFilterStatus,
  departments,
  onCreatePayroll,
  onExport,
  onProcessPayroll,
  pendingCount,
  hasRecords
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-48 sm:w-56 md:w-64">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search by name or employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCreatePayroll}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create New Payroll
          </button>
          
          {hasRecords && (
            <button
              onClick={onExport}
              className="bg-green-600 border border-slate-300 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          )}

          {pendingCount > 0 && (
            <button
              onClick={onProcessPayroll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Process Payroll ({pendingCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
