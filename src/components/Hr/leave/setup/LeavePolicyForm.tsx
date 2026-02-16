// LeavePolicyForm.tsx
import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export const LeavePolicyForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [allocations, setAllocations] = useState([
    { id: 1, leaveType: "", annualAllocation: 0 },
  ]);

  const addRow = () => {
    setAllocations([
      ...allocations,
      { id: allocations.length + 1, leaveType: "", annualAllocation: 0 },
    ]);
  };

  const removeRow = (id: number) => {
    setAllocations(allocations.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-card border border-theme rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-theme">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-muted hover:text-main transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-main">New Leave Policy</h2>
            <span className="text-xs font-medium text-orange-600">
              Not Saved
            </span>
          </div>
        </div>
        <button className="px-6 py-2 bg-primary rounded-xl font-semibold transition">
          Save
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-main mb-2">
            Policy Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter policy title"
            className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main placeholder:text-muted outline-none focus:border-primary transition"
          />
        </div>

        {/* Leave Allocations Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-main">Leave Allocations</h3>
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-theme rounded-xl text-sm font-medium text-main hover:border-primary transition"
            >
              <Plus size={16} />
              Add Row
            </button>
          </div>

          <div className="border border-theme rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-16">
                    No.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Leave Type <span className="text-red-500">*</span>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Annual Allocation <span className="text-red-500">*</span>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((allocation, index) => (
                  <tr
                    key={allocation.id}
                    className="border-t border-theme row-hover"
                  >
                    <td className="px-4 py-3 text-main font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <select className="w-full px-3 py-2 rounded-lg border border-theme bg-app text-main outline-none focus:border-primary transition">
                        <option value="">Select Leave Type</option>
                        <option>Casual Leave</option>
                        <option>Sick Leave</option>
                        <option>Privilege Leave</option>
                        <option>Compensatory Off</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        defaultValue="0"
                        className="w-full px-3 py-2 rounded-lg border border-theme bg-app text-main outline-none focus:border-primary transition"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeRow(allocation.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        disabled={allocations.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-theme">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-theme rounded-xl font-medium text-muted hover:text-main transition"
          >
            Cancel
          </button>
          <button className="px-6 py-3 bg-primary rounded-xl font-semibold transition">
            Save Policy
          </button>
        </div>
      </div>
    </div>
  );
};
