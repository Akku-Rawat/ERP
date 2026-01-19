import React, { useMemo } from 'react';
import { X, CheckCircle } from 'lucide-react';
import type { Employee } from './types';

interface CreatePayrollModalProps {
  show: boolean;
  onClose: () => void;
  employees: Employee[];
  payrollRecords: any[];
  selectedEmployees: string[];
  onToggleEmployee: (id: string) => void;
  onCreate: () => void;
  onSelectAll: (ids: string[]) => void; // 🔹 ADD
}

export const CreatePayrollModal: React.FC<CreatePayrollModalProps> = ({
  show,
  onClose,
  employees,
  payrollRecords,
  selectedEmployees,
  onToggleEmployee,
  onCreate,
  onSelectAll,
}) => {
  if (!show) return null;

  // ✅ Eligible employees (active + not already in payroll)
  const eligibleEmployees = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.isActive &&
          !payrollRecords.some(
            (r) =>
              r.employeeId === e.id &&
              (r.status === 'Pending' || r.status === 'Draft')
          )
      ),
    [employees, payrollRecords]
  );

  const eligibleIds = eligibleEmployees.map((e) => e.id);

  const isAllSelected =
    eligibleIds.length > 0 &&
    eligibleIds.every((id) => selectedEmployees.includes(id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectAll([]); // deselect all
    } else {
      onSelectAll(eligibleIds); // select all eligible
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create New Payroll</h2>
              <p className="text-blue-100 mt-1">
                Select employees for processing
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* 🔹 SELECT ALL */}
          <div className="mb-4 flex items-center gap-3 border rounded-lg p-3 bg-slate-50">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="font-semibold text-slate-700">
              Select All Eligible Employees ({eligibleIds.length})
            </span>
          </div>

          <div className="space-y-4">
            {employees
              .filter((e) => e.isActive)
              .map((emp) => {
                const alreadyExists = payrollRecords.some(
                  (r) =>
                    r.employeeId === emp.id &&
                    (r.status === 'Pending' || r.status === 'Draft')
                );
                const isSelected = selectedEmployees.includes(emp.id);

                return (
                  <div
                    key={emp.id}
                    onClick={() =>
                      !alreadyExists && onToggleEmployee(emp.id)
                    }
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      alreadyExists
                        ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={alreadyExists}
                          onChange={() => {}}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {emp.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {emp.id} • {emp.designation}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">
                          ₹
                          {(
                            emp.basicSalary +
                            emp.hra +
                            emp.allowances
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">Gross</p>
                      </div>
                    </div>
                    {alreadyExists && (
                      <p className="text-xs text-amber-600 mt-2">
                        Already in payroll
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={selectedEmployees.length === 0}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
              selectedEmployees.length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Create ({selectedEmployees.length})
          </button>
        </div>
      </div>
    </div>
  );
};
