// CompensationTab.tsx - SYNCED VERSION
import React, { useState, useEffect } from "react";
import { Info, AlertTriangle } from "lucide-react";
import { getActiveSalaryStructures, calculateSalaryBreakdown } from "../../../views/hr/tabs/salarystructure";

type CompensationTabProps = {
  formData: any;
  handleInputChange: (field: string, value: string | boolean | any) => void;
};

const CompensationTab: React.FC<CompensationTabProps> = ({
  
  formData,
  handleInputChange,
}) => {
  const [selectedStructure, setSelectedStructure] = useState(formData.salaryStructure || "");
  const [grossSalary, setGrossSalary] = useState(formData.grossSalaryStarting || "");
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [structures, setStructures] = useState(getActiveSalaryStructures());
  // 🔁 SYNC selectedStructure with formData.salaryStructure
useEffect(() => {
  if (formData.salaryStructure && formData.salaryStructure !== selectedStructure) {
    setSelectedStructure(formData.salaryStructure);
  }
}, [formData.salaryStructure]);


  // Calculate breakdown when structure or gross changes
  useEffect(() => {
    if (!selectedStructure || !grossSalary) {
      setBreakdown([]);
      return;
    }

    const gross = parseFloat(grossSalary) || 0;
    const calculated = calculateSalaryBreakdown(selectedStructure, gross);
    
    setBreakdown(calculated);
    
    // Update formData
    handleInputChange("salaryStructure", selectedStructure);
    handleInputChange("grossSalaryStarting", grossSalary);
    handleInputChange("salaryBreakdown", calculated);
  }, [selectedStructure, grossSalary]);

  const totalCalculated = breakdown.reduce((sum, item) => sum + item.amount, 0);
  const selectedStructureData = structures.find(s => s.id === selectedStructure);
  useEffect(() => {
  if (formData.salaryStructure && formData.salaryStructure !== selectedStructure) {
    setSelectedStructure(formData.salaryStructure);
  }
}, [formData.salaryStructure]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <div className="grid grid-cols-2 gap-6">
        {/* Left - Salary Structure Selection */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Salary Structure
              </h4>
              <Info className="w-4 h-4 text-gray-400" />
            </div>

            {structures.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">No Active Structures</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Please create salary structures in HR Settings first.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-gray-600 mb-2 font-medium">
                    Select Structure *
                  </label>
                  <select
                    value={selectedStructure}
                   onChange={(e) => {
  setSelectedStructure(e.target.value);
  handleInputChange("salaryStructure", e.target.value);
  handleInputChange("salaryStructureSource", "MANUAL");
}}

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Choose salary structure...</option>
                    {structures.map(struct => (
                      <option key={struct.id} value={struct.id}>
                        {struct.name}
                      </option>
                    ))}
                  </select>
                
                </div>

                {selectedStructureData && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 mb-1">
                      <strong>{selectedStructureData.name}</strong>
                    </p>
                    <p className="text-xs text-blue-700">
                      {selectedStructureData.description}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {selectedStructureData.components.length} components • 
                      Used by {selectedStructureData.usedBy} employees
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-600 mb-2 font-medium">
                    Annual Gross Salary (ZMW) *
                  </label>
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(e.target.value)}
                    placeholder="e.g., 120000"
                    disabled={!selectedStructure}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Monthly: ZMW {(parseFloat(grossSalary || "0") / 12).toLocaleString()}
                  </p>
                </div>

                {/* Preview */}
                {breakdown.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-3">Component Breakdown:</p>
                    <div className="space-y-2">
                      {breakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-600">
                            {item.component.name}
                            {item.component.valueType === "percentage" && 
                              ` (${item.component.value}%)`
                            }
                          </span>
                          <span className={`font-medium ${
                            item.component.category === "Deduction" ? "text-red-600" : ""
                          }`}>
                            {item.component.category === "Deduction" ? "-" : ""}
                            ZMW {item.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 mt-2 border-t">
                      <span>Total Calculated</span>
                      <span className="text-purple-600">
                        ZMW {totalCalculated.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payroll Config */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Payroll Configuration
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option>ZMW</option>
                  <option>USD</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Frequency</label>
                <select
                  value={formData.paymentFrequency}
                  onChange={(e) => handleInputChange("paymentFrequency", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option>Monthly</option>
                  <option>Bi-weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="BANK">Bank</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Bank Details */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Bank Account Details
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Account Type</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => handleInputChange("accountType", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Account Name *</label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => handleInputChange("accountName", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Account Number *</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Bank Name *</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Branch Code</label>
                <input
                  type="text"
                  value={formData.branchCode}
                  onChange={(e) => handleInputChange("branchCode", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompensationTab;