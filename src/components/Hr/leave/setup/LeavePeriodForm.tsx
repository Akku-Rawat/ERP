// LeavePeriodForm.tsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export const LeavePeriodForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [isActive, setIsActive] = useState(true);

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
            <h2 className="text-xl font-bold text-main">New Leave Period</h2>
            <span className="text-xs font-medium text-orange-600">Not Saved</span>
          </div>
        </div>
        <button className="px-6 py-2 bg-primary rounded-xl font-semibold transition">
          Save
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-main mb-2">
                From Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-main mb-2">
                To Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded border-theme accent-primary cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-main cursor-pointer"
              >
                Is Active
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value="Izyane"
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-theme bg-card text-main outline-none"
              />
              <p className="text-xs text-muted mt-2">
                This field is auto-populated with your company name
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Holiday List for Optional Leave
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
                <option value="">Select Holiday List</option>
                <option>Holiday List 2025</option>
                <option>Holiday List 2026</option>
              </select>
              <p className="text-xs text-muted mt-2">
                Optional: Select a holiday list for this period
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-6 mt-6 border-t border-theme">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-theme rounded-xl font-medium text-muted hover:text-main transition"
          >
            Cancel
          </button>
          <button className="px-6 py-3 bg-primary rounded-xl font-semibold transition">
            Save Period
          </button>
        </div>
      </div>
    </div>
  );
};