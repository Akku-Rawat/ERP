import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import type { Employee } from "./types";

interface EditEmployeePayrollModalProps {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSave: (updatedEmployee: Employee) => void;
}

const EditEmployeePayrollModal: React.FC<EditEmployeePayrollModalProps> = ({
  open,
  employee,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<Employee | null>(null);

  useEffect(() => {
    setForm(employee);
  }, [employee]);

  if (!open || !form) return null;

  const update = (field: keyof Employee, value: any) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Edit Employee Payroll
            </h2>
            <p className="text-sm text-slate-500">
              {form.name} • {form.id}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">

            <Field
              label="Basic Salary"
              value={form.basicSalary}
              onChange={(v) => update("basicSalary", v)}
            />

            <Field
              label="HRA"
              value={form.hra}
              onChange={(v) => update("hra", v)}
            />

            <Field
              label="Allowances"
              value={form.allowances}
              onChange={(v) => update("allowances", v)}
            />

            <Field
              label="Overtime Pay"
              value={form.overtimePay || 0}
              onChange={(v) => update("overtimePay", v)}
            />

            <Field
              label="Bonus"
              value={form.bonus || 0}
              onChange={(v) => update("bonus", v)}
            />

            <Field
              label="Professional Tax"
              value={form.professionalTax || 0}
              onChange={(v) => update("professionalTax", v)}
            />
          </div>

          {/* Summary */}
          <div className="bg-slate-50 border rounded-lg p-4 flex justify-between">
            <span className="font-semibold">Estimated Gross</span>
            <span className="font-bold text-green-700">
              ₹{(
                form.basicSalary +
                form.hra +
                form.allowances +
                (form.overtimePay || 0) +
                (form.bonus || 0)
              ).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeePayrollModal;

/* ---------- Reusable Field ---------- */

const Field = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
