// CompensationTab.tsx - SIMPLIFIED VERSION MATCHING BACKEND
import React, { useState } from "react";
import { DollarSign, Calculator } from "lucide-react";

type CompensationTabProps = {
  formData: any;
  handleInputChange: (field: string, value: string | boolean | any) => void;
};

const CompensationTab: React.FC<CompensationTabProps> = ({
  formData,
  handleInputChange,
}) => {
  // State for allowance input types
  const [housingType, setHousingType] = useState<"percentage" | "amount">(
    "amount",
  );
  const [mealType, setMealType] = useState<"percentage" | "amount">("amount");
  const [transportType, setTransportType] = useState<"percentage" | "amount">(
    "amount",
  );
  const [otherType, setOtherType] = useState<"percentage" | "amount">("amount");

  // Calculate allowance based on type
  const calculateAllowance = (
    value: string,
    type: "percentage" | "amount",
    basicSalary: number,
  ) => {
    const numValue = parseFloat(value || "0");
    if (type === "percentage") {
      return (basicSalary * numValue) / 100;
    }
    return numValue;
  };

  // Calculate Gross Salary automatically
  const calculateGrossSalary = () => {
    const basic = parseFloat(formData.basicSalary || "0");
    const housingType = formData.housingAllowanceType;
    const mealType = formData.mealAllowanceType;
    const transportType = formData.transportAllowanceType;
    const otherType = formData.otherAllowanceType;

    return basic + housingType + mealType + transportType + otherType;
  };

  // ✅ Update gross salary when any field loses focus
  const handleFieldBlur = () => {
    const newGrossSalary = calculateGrossSalary();
    if (newGrossSalary > 0) {
      handleInputChange("grossSalary", newGrossSalary.toString());
    }
  };

  // Calculate values for display
  const grossSalary = calculateGrossSalary();
  const monthlySalary = grossSalary / 12;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <div className="grid grid-cols-2 gap-6">
        {/* Left - Salary Components */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Salary Components (Annual)
              </h4>
              <Calculator className="w-4 h-4 text-gray-400" />
            </div>

            <div className="space-y-4">
              {/* Basic Salary */}
              <div>
                <label className="block text-xs text-gray-600 mb-2 font-medium">
                  Basic Salary (ZMW) *
                </label>
                <input
                  type="number"
                  value={formData.basicSalary || ""}
                  onChange={(e) =>
                    handleInputChange("basicSalary", e.target.value)
                  }
                  onBlur={handleFieldBlur}
                  placeholder="e.g., 14500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Housing Allowance */}
              <div>
                <label className="block text-xs text-gray-600 mb-2 font-medium">
                  Housing Allowance
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.housingAllowance || ""}
                    onChange={(e) =>
                      handleInputChange("housingAllowance", e.target.value)
                    }
                    onBlur={handleFieldBlur}
                    placeholder={
                      housingType === "percentage" ? "e.g., 20" : "e.g., 3000"
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    value={housingType}
                    onChange={(e) =>
                      setHousingType(e.target.value as "percentage" | "amount")
                    }
                    className="w-24 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="amount">ZMW</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
                {formData.basicSalary && formData.housingAllowance && (
                  <p className="text-xs text-gray-500 mt-1">
                    {housingType === "percentage"
                      ? `Amount: ZMW ${calculateAllowance(formData.housingAllowance, housingType, parseFloat(formData.basicSalary)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                      : `Percentage: ${((parseFloat(formData.housingAllowance) / parseFloat(formData.basicSalary)) * 100).toFixed(1)}%`}
                  </p>
                )}
              </div>

              {/* Meal Allowance */}
              <div>
                <label className="block text-xs text-gray-600 mb-2 font-medium">
                  Meal Allowance
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.mealAllowance || ""}
                    onChange={(e) =>
                      handleInputChange("mealAllowance", e.target.value)
                    }
                    onBlur={handleFieldBlur}
                    placeholder={
                      mealType === "percentage" ? "e.g., 10" : "e.g., 1300"
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    value={mealType}
                    onChange={(e) =>
                      setMealType(e.target.value as "percentage" | "amount")
                    }
                    className="w-24 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="amount">ZMW</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
                {formData.basicSalary && formData.mealAllowance && (
                  <p className="text-xs text-gray-500 mt-1">
                    {mealType === "percentage"
                      ? `Amount: ZMW ${calculateAllowance(formData.mealAllowance, mealType, parseFloat(formData.basicSalary)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                      : `Percentage: ${((parseFloat(formData.mealAllowance) / parseFloat(formData.basicSalary)) * 100).toFixed(1)}%`}
                  </p>
                )}
              </div>

              {/* Transport Allowance */}
              <div>
                <label className="block text-xs text-gray-600 mb-2 font-medium">
                  Transport Allowance
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.transportAllowance || ""}
                    onChange={(e) =>
                      handleInputChange("transportAllowance", e.target.value)
                    }
                    onBlur={handleFieldBlur}
                    placeholder={
                      transportType === "percentage" ? "e.g., 8" : "e.g., 1000"
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    value={transportType}
                    onChange={(e) =>
                      setTransportType(
                        e.target.value as "percentage" | "amount",
                      )
                    }
                    className="w-24 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="amount">ZMW</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
                {formData.basicSalary && formData.transportAllowance && (
                  <p className="text-xs text-gray-500 mt-1">
                    {transportType === "percentage"
                      ? `Amount: ZMW ${calculateAllowance(formData.transportAllowance, transportType, parseFloat(formData.basicSalary)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                      : `Percentage: ${((parseFloat(formData.transportAllowance) / parseFloat(formData.basicSalary)) * 100).toFixed(1)}%`}
                  </p>
                )}
              </div>

              {/* Other Allowances */}
              <div>
                <label className="block text-xs text-gray-600 mb-2 font-medium">
                  Other Allowances
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.otherAllowances || ""}
                    onChange={(e) =>
                      handleInputChange("otherAllowances", e.target.value)
                    }
                    onBlur={handleFieldBlur}
                    placeholder={
                      otherType === "percentage" ? "e.g., 5" : "e.g., 700"
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    value={otherType}
                    onChange={(e) =>
                      setOtherType(e.target.value as "percentage" | "amount")
                    }
                    className="w-24 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="amount">ZMW</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
                {formData.basicSalary && formData.otherAllowances && (
                  <p className="text-xs text-gray-500 mt-1">
                    {otherType === "percentage"
                      ? `Amount: ZMW ${calculateAllowance(formData.otherAllowances, otherType, parseFloat(formData.basicSalary)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                      : `Percentage: ${((parseFloat(formData.otherAllowances) / parseFloat(formData.basicSalary)) * 100).toFixed(1)}%`}
                  </p>
                )}
              </div>

              {/* Gross Salary Display */}
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-700 uppercase">
                      Gross Salary (Annual)
                    </span>
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    ZMW{" "}
                    {grossSalary.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    Monthly: ZMW{" "}
                    {monthlySalary.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payroll Config */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Payroll Configuration
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  Currency
                </label>
                <select
                  value={formData.currency || "ZMW"}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ZMW">ZMW</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  Frequency
                </label>
                <select
                  value={formData.paymentFrequency || "Monthly"}
                  onChange={(e) =>
                    handleInputChange("paymentFrequency", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  Method
                </label>
                <select
                  value={formData.paymentMethod || "Bank Transfer"}
                  onChange={(e) =>
                    handleInputChange("paymentMethod", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Mobile Money">Mobile Money</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Bank Details & Insurance */}
        <div className="space-y-5">
          {/* Bank Details */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Bank Account Details
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  Account Type
                </label>
                <select
                  value={formData.accountType || "Savings"}
                  onChange={(e) =>
                    handleInputChange("accountType", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  Account Name *
                </label>
                <input
                  type="text"
                  value={formData.accountName || ""}
                  onChange={(e) =>
                    handleInputChange("accountName", e.target.value)
                  }
                  placeholder="Account holder name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={formData.accountNumber || ""}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  placeholder="Bank account number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={formData.bankName || ""}
                  onChange={(e) =>
                    handleInputChange("bankName", e.target.value)
                  }
                  placeholder="e.g., Zanaco Bank"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  Branch Code
                </label>
                <input
                  type="text"
                  value={formData.branchCode || ""}
                  onChange={(e) =>
                    handleInputChange("branchCode", e.target.value)
                  }
                  placeholder="e.g., 027"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Insurance Section */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Insurance & Benefits
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  NHIMA Number
                </label>
                <input
                  type="text"
                  value={formData.nhimaHealthInsurance || ""}
                  onChange={(e) =>
                    handleInputChange("nhimaHealthInsurance", e.target.value)
                  }
                  placeholder="e.g., 88990011"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  NAPSA Number
                </label>
                <input
                  type="text"
                  value={formData.socialSecurityNapsa || ""}
                  onChange={(e) =>
                    handleInputChange("socialSecurityNapsa", e.target.value)
                  }
                  placeholder="e.g., 33445566"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  TPIN
                </label>
                <input
                  type="text"
                  value={formData.tpinId || ""}
                  onChange={(e) => handleInputChange("tpinId", e.target.value)}
                  placeholder="e.g., TPIN445566"
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
