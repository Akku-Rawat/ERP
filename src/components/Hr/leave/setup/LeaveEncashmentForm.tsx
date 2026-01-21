// LeaveEncashmentForm.tsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export const LeaveEncashmentForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [payViaPaymentEntry, setPayViaPaymentEntry] = useState(false);

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
            <h2 className="text-xl font-bold text-main">New Leave Encashment</h2>
            <span className="text-xs font-medium text-orange-600">Not Saved</span>
          </div>
        </div>
        <button className="px-6 py-2 bg-primary rounded-xl font-semibold transition">
          Save
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Row 1: Employee, Leave Period, Encashment Days */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              Leave Period <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
              <option value="">Select Leave Period</option>
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Encashment Days
            </label>
            <input
              type="number"
              defaultValue="0"
              className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition"
            />
          </div>
        </div>

        {/* Row 2: Company & Leave Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
              <option value="">Select Leave Type</option>
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Privilege Leave</option>
              <option>Compensatory Off</option>
            </select>
          </div>
        </div>

        {/* Accounting Section */}
        <div className="pt-6 border-t border-theme">
          <h3 className="text-lg font-bold text-main mb-4">Accounting</h3>
          
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="payViaPaymentEntry"
              checked={payViaPaymentEntry}
              onChange={(e) => setPayViaPaymentEntry(e.target.checked)}
              className="w-5 h-5 rounded border-theme accent-primary cursor-pointer mt-0.5"
            />
            <div>
              <label
                htmlFor="payViaPaymentEntry"
                className="text-sm font-medium text-main cursor-pointer block"
              >
                Pay Via Payment Entry
              </label>
              <p className="text-xs text-muted mt-1">
                Process leave encashment via a separate Payment Entry instead of Salary Slip
              </p>
            </div>
          </div>
        </div>

        {/* Payroll Section */}
        <div className="pt-6 border-t border-theme">
          <h3 className="text-lg font-bold text-main mb-4">Payroll</h3>
          
          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Encashment Date
            </label>
            <input
              type="date"
              defaultValue="2026-01-15"
              className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition"
            />
          </div>
        </div>

        {/* More Info Section */}
        <div className="pt-6 border-t border-theme">
          <h3 className="text-lg font-bold text-main mb-4">More Info</h3>
          
          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Status
            </label>
            <input
              type="text"
              value="Draft"
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-theme bg-card text-main outline-none"
            />
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
            Save Encashment
          </button>
        </div>
      </div>
    </div>
  );
};