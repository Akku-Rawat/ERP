// LeaveSetupTab.tsx - UPDATED TO USE HR SETTINGS
import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";

type LeaveSetupTabProps = {
  formData: any;
  handleInputChange: (field: string, value: string | boolean | any) => void;
};

// Mock data - Replace with API call
const LEAVE_POLICIES = [
  {
    id: "standard",
    name: "Standard Leave Policy 2025",
    types: [
      { name: "Annual Leave", code: "AL", quota: 24, accrual: "Monthly" },
      { name: "Sick Leave", code: "SL", quota: 14, accrual: "Yearly" },
      { name: "Maternity", code: "ML", quota: 90, accrual: "One-time" }
    ]
  },
  {
    id: "probation",
    name: "Probation Leave Policy",
    types: [
      { name: "Annual Leave", code: "AL", quota: 12, accrual: "Monthly" },
      { name: "Sick Leave", code: "SL", quota: 7, accrual: "Yearly" }
    ]
  }
];

export const LeaveSetupTab: React.FC<LeaveSetupTabProps> = ({
  formData,
  handleInputChange,
}) => {
  const [selectedPolicy, setSelectedPolicy] = useState(formData.leavePolicy || "");
  const [policyDetails, setPolicyDetails] = useState<any>(null);

  useEffect(() => {
    if (!selectedPolicy) {
      setPolicyDetails(null);
      return;
    }

    const policy = LEAVE_POLICIES.find(p => p.id === selectedPolicy);
    if (policy) {
      setPolicyDetails(policy);
      handleInputChange("leavePolicy", selectedPolicy);
      handleInputChange("leavePolicyDetails", policy);
    }
  }, [selectedPolicy]);

  // Calculate prorated leave for mid-year joiners
  const calculateProratedLeave = (quota: number, accrual: string) => {
    if (!formData.engagementDate) return quota;
    
    const joinDate = new Date(formData.engagementDate);
    const currentYear = new Date().getFullYear();
    const yearEnd = new Date(currentYear, 11, 31);
    
    const monthsRemaining = Math.ceil(
      (yearEnd.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    if (accrual === "Monthly") {
      return Math.ceil((quota / 12) * monthsRemaining);
    }
    
    return quota;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Leave Configuration
          </h4>
          <Info className="w-4 h-4 text-gray-400" />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-2 font-medium">
            Select Leave Policy *
          </label>
          <select
            value={selectedPolicy}
            onChange={(e) => setSelectedPolicy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose leave policy...</option>
            {LEAVE_POLICIES.map(policy => (
              <option key={policy.id} value={policy.id}>
                {policy.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            ⚙️ Managed in HR Settings → Leave Policy
          </p>
        </div>

        {/* Policy Preview */}
        {policyDetails && (
          <div className="border-t pt-4 mt-4">
            <p className="text-xs font-semibold text-gray-700 mb-3">Leave Entitlement:</p>
            <div className="space-y-3">
              {policyDetails.types.map((leave: any, idx: number) => {
                const prorated = calculateProratedLeave(leave.quota, leave.accrual);
                return (
                  <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{leave.name}</span>
                        <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                          {leave.code}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">
                        {leave.quota} days
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>Accrual: {leave.accrual}</p>
                      {formData.engagementDate && leave.accrual === "Monthly" && (
                        <p className="text-green-600 font-medium mt-1">
                          Prorated for {new Date(formData.engagementDate).getFullYear()}: {prorated} days
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Engagement Date Warning */}
        {!formData.engagementDate && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              ⚠️ Set engagement date in Employment tab to see prorated leave calculation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};