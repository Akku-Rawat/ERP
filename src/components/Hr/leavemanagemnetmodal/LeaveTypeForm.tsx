// LeaveTypeForm.tsx
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export const LeaveTypeForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            New Leave Type{" "}
            <span className="text-xs text-orange-500">Not Saved</span>
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded"
          >
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-slate-700">
            Leave Type Name <span className="text-red-500">*</span>
          </label>
          <input className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50" />

          <label className="text-sm text-slate-700 mt-4 block">
            Maximum Leave Allocation Allowed per Leave Period
          </label>
          <input className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50" />

          <label className="text-sm text-slate-700 mt-4 block">
            Allow Leave Application After (Working Days)
          </label>
          <input className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50" />

          <label className="text-sm text-slate-700 mt-4 block">
            Minimum working days required since Date of Joining to apply for
            this leave
          </label>
          <input className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50" />

          <label className="text-sm text-slate-700 mt-4 block">
            Maximum Consecutive Leaves Allowed
          </label>
          <input className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50" />
        </div>

        <div>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Is Carry Forward
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Is Leave Without Pay
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Is Partially Paid
              Leave
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Is Optional Leave
            </label>
            <p className="text-sm text-slate-500">
              These leaves are holidays permitted by the company however,
              availing it is optional for an Employee.
            </p>

            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Allow Negative
              Balance
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Allow Over
              Allocation
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Include holidays
              within leaves as leaves
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Is Compensatory
            </label>
          </div>

          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium">Encashment</h4>
            <label className="flex items-center gap-2 mt-2">
              <input type="checkbox" className="w-4 h-4" /> Allow Encashment
            </label>

            <h4 className="font-medium mt-4">Earned Leave</h4>
            <label className="flex items-center gap-2 mt-2">
              <input type="checkbox" className="w-4 h-4" /> Is Earned Leave
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
