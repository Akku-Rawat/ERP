// Modals.tsx - All modal components with enhanced features

import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Download,
  Mail,
  AlertCircle,
  TrendingUp,
  Calendar,
  Plus,
  Trash2,
} from "lucide-react";
import type { Employee, PayrollRecord, Bonus } from "./types";
import { BONUS_TYPES } from "./constants";

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
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Quick Create Payroll</h2>
              <p className="text-blue-100 mt-1">Select employees</p>
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
          <div className="mb-4 flex items-center gap-3 border rounded-lg p-3 bg-slate-50">
            <input
              type="checkbox"
              checked={
                selectedEmployees.length ===
                employees.filter((e) => e.isActive).length
              }
              onChange={onSelectAll}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="font-semibold text-slate-700">Select All</span>
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
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
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
                  </div>
                );
              })}
          </div>
        </div>
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
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
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

interface EditModalProps {
  record: PayrollRecord | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: string, value: any) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  record,
  onClose,
  onSave,
  onChange,
}) => {
  const [bonuses, setBonuses] = useState<Bonus[]>(record?.bonuses || []);
  const [showAddBonus, setShowAddBonus] = useState(false);
  const [newBonus, setNewBonus] = useState({
    bonusType: "Performance",
    amount: 0,
    label: "",
  });

  if (!record) return null;

  const handleAddBonus = () => {
    if (!newBonus.label || newBonus.amount <= 0)
      return alert("Fill all bonus fields");
    const bonus: Bonus = {
      id: `BON${Date.now()}`,
      label: newBonus.label,
      bonusType: newBonus.bonusType as any,
      amount: newBonus.amount,
      approved: false,
      date: new Date().toISOString(),
    };
    const updated = [...bonuses, bonus];
    setBonuses(updated);
    onChange("bonuses", updated);
    onChange(
      "totalBonus",
      updated.reduce((sum, b) => sum + b.amount, 0),
    );
    setNewBonus({ bonusType: "Performance", amount: 0, label: "" });
    setShowAddBonus(false);
  };

  const handleRemoveBonus = (id: string) => {
    const updated = bonuses.filter((b) => b.id !== id);
    setBonuses(updated);
    onChange("bonuses", updated);
    onChange(
      "totalBonus",
      updated.reduce((sum, b) => sum + b.amount, 0),
    );
  };

  return (
   <div
  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  onClick={onClose}
>

      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
          <h2 className="text-2xl font-bold">Edit Salary</h2>
          <p className="text-purple-100 mt-1">{record.employeeName}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Basic Salary
              </label>
              <input
                type="number"
                value={record.basicSalary}
                onChange={(e) =>
                  onChange("basicSalary", Number(e.target.value))
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                HRA
              </label>
              <input
                type="number"
                value={record.hra}
                onChange={(e) => onChange("hra", Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Allowances
              </label>
              <input
                type="number"
                value={record.allowances}
                onChange={(e) => onChange("allowances", Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Arrears
              </label>
              <input
                type="number"
                value={record.arrears}
                onChange={(e) => onChange("arrears", Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-purple-900">Bonuses</h4>
              <button
                onClick={() => setShowAddBonus(!showAddBonus)}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {showAddBonus && (
              <div className="bg-white rounded-lg p-3 mb-3 border border-purple-200">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <select
                    value={newBonus.bonusType}
                    onChange={(e) =>
                      setNewBonus({ ...newBonus, bonusType: e.target.value })
                    }
                    className="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {BONUS_TYPES.map((bt) => (
                      <option key={bt.value} value={bt.value}>
                        {bt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Label"
                    value={newBonus.label}
                    onChange={(e) =>
                      setNewBonus({ ...newBonus, label: e.target.value })
                    }
                    className="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newBonus.amount || ""}
                    onChange={(e) =>
                      setNewBonus({
                        ...newBonus,
                        amount: Number(e.target.value),
                      })
                    }
                    className="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={handleAddBonus}
                  className="w-full px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  Add Bonus
                </button>
              </div>
            )}

            <div className="space-y-2">
              {bonuses.map((bonus) => (
                <div
                  key={bonus.id}
                  className="bg-white rounded p-2 flex items-center justify-between text-sm border border-purple-100"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      {bonus.label}
                    </p>
                    <p className="text-xs text-slate-600">{bonus.bonusType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-700">
                      ₹{bonus.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemoveBonus(bonus.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-purple-800 font-semibold">
                Estimated Net:
              </span>
              <span className="text-2xl font-bold text-purple-700">
                ₹
                {(
                  record.basicSalary +
                  record.hra +
                  record.allowances +
                  record.arrears +
                  bonuses.reduce((s, b) => s + b.amount, 0) -
                  Math.round(
                    (record.basicSalary +
                      record.hra +
                      record.allowances +
                      record.arrears) *
                      0.24,
                  ) -
                  500
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

interface PayslipModalProps {
  record: PayrollRecord | null;
  onClose: () => void;
  onDownload: () => void;
  onEmail: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  record,
  onClose,
  onDownload,
  onEmail,
}) => {
  const [emailSent, setEmailSent] = useState(false);

  if (!record) return null;

  const handleEmail = () => {
    onEmail();
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
     <div
  className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
  onClick={(e) => e.stopPropagation()}
>

        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Salary Slip</h2>
              <p className="text-teal-100 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
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
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-200">
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">
                Employee ID
              </p>
              <p className="font-semibold text-slate-800">
                {record.employeeId}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">Name</p>
              <p className="font-semibold text-slate-800">
                {record.employeeName}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">
                Designation
              </p>
              <p className="font-semibold text-slate-800">
                {record.designation}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">
                Department
              </p>
              <p className="font-semibold text-slate-800">
                {record.department}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">
                Days Worked
              </p>
              <p className="font-semibold text-slate-800">
                {record.paidDays}/{record.workingDays}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">
                PAN Number
              </p>
              <p className="font-semibold text-slate-800">{record.panNumber}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Earnings
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-700">Basic Salary</span>
                  <span className="font-semibold">
                    ₹{record.basicSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">HRA</span>
                  <span className="font-semibold">
                    ₹{record.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Allowances</span>
                  <span className="font-semibold">
                    ₹{record.allowances.toLocaleString()}
                  </span>
                </div>
                {record.overtimePay > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-700">Overtime</span>
                    <span className="font-semibold">
                      ₹{record.overtimePay.toLocaleString()}
                    </span>
                  </div>
                )}
                {record.totalBonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-700">Bonuses</span>
                    <span className="font-semibold">
                      ₹{record.totalBonus.toLocaleString()}
                    </span>
                  </div>
                )}
                {record.arrears > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-700">Arrears</span>
                    <span className="font-semibold">
                      ₹{record.arrears.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-green-300 mt-2">
                  <span className="font-bold text-green-900">Gross Salary</span>
                  <span className="font-bold text-lg text-green-700">
                    ₹{record.grossPay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Deductions
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-700">
                    Tax ({record.taxRegime})
                  </span>
                  <span className="font-semibold">
                    ₹{record.taxDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Provident Fund</span>
                  <span className="font-semibold">
                    ₹{record.pfDeduction.toLocaleString()}
                  </span>
                </div>
                {record.esiDeduction > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-700">ESI</span>
                    <span className="font-semibold">
                      ₹{record.esiDeduction.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-700">Professional Tax</span>
                  <span className="font-semibold">
                    ₹{record.professionalTax.toLocaleString()}
                  </span>
                </div>
                {record.loanDeduction > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-700">Loan EMI</span>
                    <span className="font-semibold">
                      ₹{record.loanDeduction.toLocaleString()}
                    </span>
                  </div>
                )}
                {record.advanceDeduction > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-700">Advance</span>
                    <span className="font-semibold">
                      ₹{record.advanceDeduction.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-red-300 mt-2">
                  <span className="font-bold text-red-900">
                    Total Deductions
                  </span>
                  <span className="font-bold text-lg text-red-700">
                    ₹{record.totalDeductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-teal-100 text-sm mb-1">
                  Net Salary (Take Home)
                </p>
                <p className="text-4xl font-bold">
                  ₹{record.netPay.toLocaleString()}
                </p>
                <p className="text-teal-100 text-xs mt-2">
                  Payment Date: {record.paymentDate || "Pending"}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  record.status === "Paid" ? "bg-green-500" : "bg-white/20"
                }`}
              >
                {record.status === "Paid" && (
                  <CheckCircle className="w-4 h-4" />
                )}
                {record.status}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
          <button
            onClick={onDownload}
            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={handleEmail}
            disabled={emailSent}
            className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 ${
              emailSent
                ? "bg-green-600"
                : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
            } text-white`}
          >
            <Mail className="w-5 h-5" />
            {emailSent ? "Email Sent!" : "Email Payslip"}
          </button>
        </div>
      </div>
    </div>
  );
};
