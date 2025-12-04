// LeaveType.tsx
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export interface LeaveTypeProps {
  onAdd: () => void;
  onClose?: () => void;
}

export const LeaveType: React.FC<LeaveTypeProps> = ({ onAdd, onClose }) => {
  const rows = [
    "Leave Without Pay",
    "Privilege Leave",
    "Sick Leave",
    "Compensatory Off",
    "Casual Leave",
  ];

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <aside className="w-56 pr-6">
        <div className="space-y-6 sticky top-6">
          <h4 className="text-sm font-medium text-slate-700">Filter By</h4>
          <div>
            <select className="w-full py-2 px-3 rounded bg-white border border-gray-200 text-sm">
              <option>Assigned To</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200">
        <div className="p-6 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft className="w-5 h-5" /> Back
              </button>
            )}
            <h2 className="text-lg font-semibold">Leave Type</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            >
              + Add Leave Type
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="ml-auto text-sm text-slate-600">
              Last Updated On
            </div>
          </div>

          <div className="min-h-[280px]">
            <ul className="divide-y divide-slate-100">
              {rows.map((t, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between py-3 px-2"
                >
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4" />
                    <div>
                      <div className="font-medium text-slate-800">{t}</div>
                      <div className="text-xs text-slate-500">{t}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="text-center">{i === 4 ? 3 : 0}</div>
                    <div className="w-4 h-4 rounded bg-gray-100" />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <button className="px-2 py-1 bg-gray-50 rounded">20</button>
              <button className="px-2 py-1 bg-gray-50 rounded">100</button>
              <button className="px-2 py-1 bg-gray-50 rounded">500</button>
              <button className="px-2 py-1 bg-gray-50 rounded">2500</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
