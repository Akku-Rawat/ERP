// LeaveTypeForm.tsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export const LeaveTypeForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [allowNegative, setAllowNegative] = useState(false);
  const [includeHolidays, setIncludeHolidays] = useState(false);
  const [allowCarryForward, setAllowCarryForward] = useState(false);

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
            <h2 className="text-xl font-bold text-main">New Leave Type</h2>
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
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Leave Type Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Casual Leave"
                className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main placeholder:text-muted outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Maximum Leaves Allowed
              </label>
              <input
                type="number"
                defaultValue="0"
                className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition"
              />
              <p className="text-xs text-muted mt-2">
                Maximum number of leaves per allocation period
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Applicable After (Working Days)
              </label>
              <input
                type="number"
                defaultValue="0"
                className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition"
              />
              <p className="text-xs text-muted mt-2">
                Leave type applicable after specified working days
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowNegative"
                  checked={allowNegative}
                  onChange={(e) => setAllowNegative(e.target.checked)}
                  className="w-5 h-5 rounded border-theme accent-primary cursor-pointer"
                />
                <label
                  htmlFor="allowNegative"
                  className="text-sm font-medium text-main cursor-pointer"
                >
                  Allow Negative Balance
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeHolidays"
                  checked={includeHolidays}
                  onChange={(e) => setIncludeHolidays(e.target.checked)}
                  className="w-5 h-5 rounded border-theme accent-primary cursor-pointer"
                />
                <label
                  htmlFor="includeHolidays"
                  className="text-sm font-medium text-main cursor-pointer"
                >
                  Include Holidays in Leave Days
                </label>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Maximum Consecutive Leaves
              </label>
              <input
                type="number"
                defaultValue="0"
                className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition"
              />
              <p className="text-xs text-muted mt-2">
                0 means no limit on consecutive leaves
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Earned Leave
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
                <option value="">Not Earned Leave</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
              <p className="text-xs text-muted mt-2">
                How leave balance is earned over time
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Encashment
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
                <option value="">No Encashment</option>
                <option>Full Encashment</option>
                <option>Partial Encashment</option>
              </select>
              <p className="text-xs text-muted mt-2">
                Whether unused leaves can be encashed
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="allowCarryForward"
                checked={allowCarryForward}
                onChange={(e) => setAllowCarryForward(e.target.checked)}
                className="w-5 h-5 rounded border-theme accent-primary cursor-pointer"
              />
              <label
                htmlFor="allowCarryForward"
                className="text-sm font-medium text-main cursor-pointer"
              >
                Allow Carry Forward
              </label>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="mt-6 pt-6 border-t border-theme">
          <h3 className="text-lg font-bold text-main mb-4">
            Additional Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Leave Allocation Frequency
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
                <option>Annual</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-main mb-2">
                Is Optional Leave
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
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
            Save Leave Type
          </button>
        </div>
      </div>
    </div>
  );
};
