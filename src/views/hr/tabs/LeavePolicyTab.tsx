import { useState } from "react";
import { Plus, Edit2, Trash2, Save, Check, X } from "lucide-react";

type LeaveType = {
  id: number;
  name: string;
  code: string;
  accrual: string;
  quota: number;
  carryForward: boolean;
  maxCarry: number;
};

export default function LeavePolicyTab() {
  const [policyName, setPolicyName] = useState("Standard Leave Policy 2025");
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([
    { id: 1, name: "Annual Leave", code: "AL", accrual: "Monthly", quota: 24, carryForward: true, maxCarry: 12 },
    { id: 2, name: "Sick Leave", code: "SL", accrual: "Yearly", quota: 14, carryForward: false, maxCarry: 0 },
    { id: 3, name: "Maternity Leave", code: "ML", accrual: "One-time", quota: 90, carryForward: false, maxCarry: 0 },
    { id: 4, name: "Compassionate", code: "CL", accrual: "On-demand", quota: 5, carryForward: false, maxCarry: 0 },
  ]);

  const handleSave = () => {
    alert("Leave Policy saved successfully!");
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this leave type?")) {
      setLeaveTypes(leaveTypes.filter((lt) => lt.id !== id));
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Leave Policy</h2>
        <p className="text-sm text-gray-600 mt-1">Define leave types and accrual rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Policy Name *</label>
              <input
                type="text"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                placeholder="e.g., Standard Leave Policy 2025"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applicable From *</label>
                <input
                  type="date"
                  defaultValue="2025-01-01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leave Types Table */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Leave Types</h3>
              <button className="text-sm text-purple-600 font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Add Leave Type
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Leave Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Accrual</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Quota</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Carry Forward</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leaveTypes.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium text-gray-900">{leave.name}</span>
                          <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {leave.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{leave.accrual}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{leave.quota} days</td>
                      <td className="px-4 py-3">
                        {leave.carryForward ? (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                            Yes ({leave.maxCarry}d)
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-gray-600 hover:text-purple-600">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(leave.id)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Policy
            </button>
          </div>
        </div>

        {/* Right - Preview */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">📅 Accrual Preview</h3>

            <div className="bg-white rounded-lg p-4 text-sm space-y-3">
              <div className="text-center pb-3 border-b">
                <p className="text-xs text-gray-600">Employee joins</p>
                <p className="text-lg font-bold text-gray-900">15 Mar 2025</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Annual Leave (24 days/year):</p>
                <div className="space-y-1 pl-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Mar (prorated)</span>
                    <span className="font-medium">1 day</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Apr-Dec (9 months)</span>
                    <span className="font-medium">18 days</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-semibold pt-2 mt-2 border-t">
                  <span>Total 2025</span>
                  <span className="text-green-600">19 days</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-gray-700">
                  <strong>Carry Forward:</strong> Up to 12 days to 2026
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200">
              <p className="text-xs text-amber-800">
                <strong>⚠️ Zambian Law:</strong> Min 24 days annual leave required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}