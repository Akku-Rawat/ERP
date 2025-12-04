// FILE: src/components/Hr/payrollmodal/AddBonusModal.tsx
import React, { useState, useEffect } from "react";
import type { PayrollRecord, Bonus } from "../payroll/types";

/**
 * AddBonusModal (TypeScript)
 * - typed props
 * - uses record?.employeeName for context (prevents unused var)
 * - safe id generator (works in browsers + Node)
 */

export interface AddBonusModalProps {
  show: boolean;
  onClose: () => void;
  record?: PayrollRecord | null;
  onSave: (bonus: Bonus) => void;
}

const safeId = () => {
  // crypto.randomUUID() may not be available in some TS targets; fallback to timestamp
  // keeps id unique enough for demo / UI. Replace with server-generated id for production.
  try {
    // @ts-ignore - some TS targets don't include DOM crypto types
    return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `b-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  } catch {
    return `b-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
};

export const AddBonusModal: React.FC<AddBonusModalProps> = ({ show, onClose, record, onSave }) => {
  const [label, setLabel] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");

  // reset when opened/closed or record changes
  useEffect(() => {
    if (show) {
      setLabel("");
      setAmount("");
    }
  }, [show, record]);

  if (!show) return null;

  const handleSave = () => {
    if (!label.trim()) {
      alert("Enter bonus title");
      return;
    }
    if (amount === "" || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Enter a valid bonus amount");
      return;
    }

    const bonus: Bonus = {
      id: safeId(),
      label: label.trim(),
      amount: Number(amount),
      approved: false,
    };

    onSave(bonus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Bonus</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>

        {record && (
          <div className="mb-3 text-sm text-slate-600">
            Adding bonus for <span className="font-medium text-slate-800">{record.employeeName} ({record.employeeId})</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Bonus Title</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Performance Bonus"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              value={amount === "" ? "" : amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="5000"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Add Bonus</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBonusModal;
