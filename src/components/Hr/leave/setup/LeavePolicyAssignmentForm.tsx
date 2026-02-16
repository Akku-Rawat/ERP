// LeavePolicyAssignmentForm.tsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export const LeavePolicyAssignmentForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [addUnusedLeaves, setAddUnusedLeaves] = useState(false);

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
            <h2 className="text-xl font-bold text-main">
              New Leave Policy Assignment
            </h2>
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
        {/* Row 1: Employee & Assignment Based On */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Employee <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
              <option value="">Select Employee</option>
              <option>Amit Sharma</option>
              <option>Neha Verma</option>
              <option>Raj Kumar</option>
              <option>Priya Singh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Assignment based on
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
              <option value="">Select Basis</option>
              <option>Employee</option>
              <option>Department</option>
              <option>Designation</option>
              <option>Grade</option>
            </select>
          </div>
        </div>

        {/* Row 2: Company & Effective From */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Company
            </label>
            <input
              type="text"
              value="Izyane"
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-theme bg-card text-main outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Effective From <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition"
            />
          </div>
        </div>

        {/* Row 3: Leave Policy & Effective To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Leave Policy <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
              <option value="">Select Leave Policy</option>
              <option>Standard Policy</option>
              <option>Manager Policy</option>
              <option>Executive Policy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Effective To <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition"
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="pt-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="addUnusedLeaves"
              checked={addUnusedLeaves}
              onChange={(e) => setAddUnusedLeaves(e.target.checked)}
              className="w-5 h-5 rounded border-theme accent-primary cursor-pointer"
            />
            <label
              htmlFor="addUnusedLeaves"
              className="text-sm font-medium text-main cursor-pointer"
            >
              Add unused leaves from previous allocations
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-theme">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-theme rounded-xl font-medium text-muted hover:text-main transition"
          >
            Cancel
          </button>
          <button className="px-6 py-3 bg-primary rounded-xl font-semibold transition">
            Save Assignment
          </button>
        </div>
      </div>
    </div>
  );
};
