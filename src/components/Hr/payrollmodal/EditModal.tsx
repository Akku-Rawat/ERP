// EditModal.tsx
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { BONUS_TYPES } from "../../../views/hr/payroll-system/constants";
import type { PayrollRecord,Bonus } from "../../../views/hr/payroll-system/types";

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
      <div className="bg-card rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-primary text-white p-6">
          <h2 className="text-2xl font-bold">Edit Salary</h2>
          <p className="opacity-90 mt-1">{record.employeeName}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Basic Salary
              </label>
              <input
                type="number"
                value={record.basicSalary}
                onChange={(e) =>
                  onChange("basicSalary", Number(e.target.value))
                }
                className="w-full px-4 py-2 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-main"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-main mb-2">
                HRA
              </label>
              <input
                type="number"
                value={record.hra}
                onChange={(e) => onChange("hra", Number(e.target.value))}
                className="w-full px-4 py-2 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-main"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Allowances
              </label>
              <input
                type="number"
                value={record.allowances}
                onChange={(e) => onChange("allowances", Number(e.target.value))}
                className="w-full px-4 py-2 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-main"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Arrears
              </label>
              <input
                type="number"
                value={record.arrears}
                onChange={(e) => onChange("arrears", Number(e.target.value))}
                className="w-full px-4 py-2 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-main"
              />
            </div>
          </div>

          <div className="bg-app border border-theme rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-main">Bonuses</h4>
              <button
                onClick={() => setShowAddBonus(!showAddBonus)}
                className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-[var(--primary-600)] flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {showAddBonus && (
              <div className="bg-card rounded-lg p-3 mb-3 border border-theme">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <select
                    value={newBonus.bonusType}
                    onChange={(e) =>
                      setNewBonus({ ...newBonus, bonusType: e.target.value })
                    }
                    className="px-2 py-1 text-sm border border-theme rounded focus:outline-none focus:ring-2 focus:ring-primary bg-card text-main"
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
                    className="px-2 py-1 text-sm border border-theme rounded focus:outline-none focus:ring-2 focus:ring-primary bg-card text-main"
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
                    className="px-2 py-1 text-sm border border-theme rounded focus:outline-none focus:ring-2 focus:ring-primary bg-card text-main"
                  />
                </div>
                <button
                  onClick={handleAddBonus}
                  className="w-full px-3 py-1 bg-primary text-white text-sm rounded hover:bg-[var(--primary-600)]"
                >
                  Add Bonus
                </button>
              </div>
            )}

            <div className="space-y-2">
              {bonuses.map((bonus) => (
                <div
                  key={bonus.id}
                  className="bg-card rounded p-2 flex items-center justify-between text-sm border border-theme"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-main">{bonus.label}</p>
                    <p className="text-xs text-muted">{bonus.bonusType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">
                      ₹{bonus.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemoveBonus(bonus.id)}
                      className="p-1 text-danger row-hover rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-app border border-theme rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-main font-semibold">Estimated Net:</span>
              <span className="text-2xl font-bold text-primary">
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
        <div className="border-t border-theme p-6 bg-app flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-theme text-main rounded-lg row-hover"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-[var(--primary-600)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};