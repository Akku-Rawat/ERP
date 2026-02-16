// QuickCreateModal.tsx
import React from "react";
import { X, CheckCircle } from "lucide-react";
import type { Employee } from "../../../views/hr/payroll-system/types";

interface QuickCreateModalProps {
  show: boolean;
  onClose: () => void;
  employees: Employee[];
  selectedEmployees: string[];
  onToggleEmployee: (id: string) => void;
  onSelectAll: () => void;
  onCreate: () => void;
}

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({
  show,
  onClose,
  employees,
  selectedEmployees,
  onToggleEmployee,
  onSelectAll,
  onCreate,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div className="bg-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-primary text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Quick Create Payroll</h2>
              <p className="opacity-90 mt-1">Select employees</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="mb-4 flex items-center gap-3 border border-theme rounded-lg p-3 bg-app">
            <input
              type="checkbox"
              checked={
                selectedEmployees.length ===
                employees.filter((e) => e.isActive).length
              }
              onChange={onSelectAll}
              className="w-5 h-5 text-primary rounded"
            />
            <span className="font-semibold text-main">Select All</span>
          </div>
          <div className="space-y-4">
            {employees
              .filter((e) => e.isActive)
              .map((emp) => {
                const isSelected = selectedEmployees.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => onToggleEmployee(emp.id)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-app"
                        : "border-theme row-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-5 h-5 text-primary rounded"
                        />
                        <div>
                          <p className="font-semibold text-main">
                            {emp.name}
                          </p>
                          <p className="text-sm text-muted">
                            {emp.id} • {emp.designation}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-main">
                          ₹
                          {(
                            emp.basicSalary +
                            emp.hra +
                            emp.allowances
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted">Gross</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="border-t border-theme p-6 bg-app flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-theme text-main rounded-lg row-hover"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={selectedEmployees.length === 0}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
              selectedEmployees.length === 0
                ? "bg-app text-muted cursor-not-allowed"
                : "bg-primary text-white hover:bg-[var(--primary-600)]"
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