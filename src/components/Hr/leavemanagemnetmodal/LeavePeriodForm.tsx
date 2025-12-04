// LeavePeriodForm.tsx
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export const LeavePeriodForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <FaArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Leave Period <span className="text-xs text-orange-500">Not Saved</span></h2>
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 text-gray-700 rounded">Save</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-slate-700">From Date *</label>
          <input type="date" className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50" />

          <label className="block text-sm text-slate-700 mt-4">To Date *</label>
          <input type="date" className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50" />

          <label className="flex items-center gap-2 mt-4"><input type="checkbox" className="w-4 h-4" /> Is Active</label>
        </div>

        <div>
          <label className="block text-sm text-slate-700">Company *</label>
          <input value="INFOSI" readOnly className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50" />

          <label className="block text-sm text-slate-700 mt-4">Holiday List for Optional Leave</label>
          <input className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50" />
        </div>
      </div>
    </div>
  );
};
