import React, { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaChartArea,
  FaSyncAlt,
  FaBullseye,
  FaCheckCircle,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCoins,
  FaSave,
  FaUndo,
} from "react-icons/fa";

import type { AccountingSetup, FinancialConfig } from "../../types/company";
import {
  transformAccountingSetupPayload,
  appendFormData,
} from "../../utility/buildFormData";
import { updateCompanyById } from "../../api/companySetupApi";

const defaultForm = {
  accountingSetup: {
    chartOfAccounts: "",
    defaultExpenseGL: "",
    fxGainLossAccount: "",
    revaluationFrequency: "Monthly",
    roundOffAccount: "",
    roundOffCostCenter: "",
    depreciationAccount: "",
    appreciationAccount: "",
  },
  financialConfig: {
    baseCurrency: "INR",
    financialYearStart: "April",
  },
};

interface AccountingDetailsProps {
  financialConfig?: FinancialConfig | null;
  accountingSetup?: AccountingSetup | null;
}

const AccountingDetails: React.FC<AccountingDetailsProps> = ({
  financialConfig,
  accountingSetup,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("financial");

  // -----------------------------------------
  // MAIN FORM STATE (same pattern as BasicDetails)
  // -----------------------------------------
  const [form, setForm] = useState(() => ({
    accountingSetup: {
      ...defaultForm.accountingSetup,
      ...(accountingSetup || {}),
    },
    financialConfig: {
      ...defaultForm.financialConfig,
      ...(financialConfig || {}),
    },
  }));

  const handleChange = (
    section: "accountingSetup" | "financialConfig",
    key: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };



  const handleSubmit = async () => {
    const payload = {
      id: "COMP-00003",
      accountingSetup: form.accountingSetup,
      financialConfig: form.financialConfig,
    };

    try {
      const transformed = transformAccountingSetupPayload(payload);

      const formData = new FormData();
      appendFormData(formData, transformed);

      await updateCompanyById(formData);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update accounting settings.");
    }
  };

  // -----------------------------------------
  // RESET
  // -----------------------------------------
  const handleReset = () => {
    if (!confirm("Reset all fields?")) return;
    setForm(defaultForm);
  };

  interface InputFieldProps {
    label: string;
    name: keyof AccountingSetup | keyof FinancialConfig;
    section: "accountingSetup" | "financialConfig";
    type?: string;
    icon?: React.ComponentType<{ className?: string }>;
    required?: boolean;
    placeholder?: string;
  }

  const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    section,
    type = "text",
    icon: Icon,
    required = false,
    placeholder = "",
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-muted mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4 z-10" />
        )}

        <input
          type={type}
          value={(form[section] as Record<string, string>)[name]}
          onChange={(e) => handleChange(section, name, e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full border bg-theme rounded-lg ${Icon ? "pl-10" : "pl-3.5"
            } pr-3.5 py-2.5 text-sm`}
        />
      </div>
    </div>
  );

  interface SelectOption {
    value: string;
    label: string;
  }

  interface SelectFieldProps {
    label: string;
    name: keyof AccountingSetup | keyof FinancialConfig;
    section: "accountingSetup" | "financialConfig";
    options: SelectOption[];
    icon?: React.ComponentType<{ className?: string }>;
    required?: boolean;
  }

  const SelectField: React.FC<SelectFieldProps> = ({
    label,
    name,
    section,
    options,
    icon: Icon,
    required = false,
  }) => (
    <div>
      <label className="block text-sm font-medium text-muted mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />
        )}

        <select
          value={(form[section] as Record<string, string>)[name]}
          onChange={(e) => handleChange(section, name, e.target.value)}
          required={required}
          className={`w-full border bg-theme rounded-lg ${Icon ? "pl-10" : "pl-3.5"
            } pr-10 py-2.5 text-sm`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  // -----------------------------------------
  // UI STRUCTURE (unchanged)
  // -----------------------------------------
  return (
    <div className="w-full">
      {showSuccess && (
        <div className="mb-4 rounded-lg p-4 shadow-sm flex items-center gap-3">
          <FaCheckCircle className="w-5 h-5 text-success" />
          <div>
            <p className="text-sm font-medium text-success">Saved successfully!</p>
            <p className="text-xs text-success">All changes stored.</p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        {/* TABS */}
        <div className="bg-app border-b flex">
          {[
            { id: "financial", label: "Financial Config", icon: FaCoins },
            { id: "accounts", label: "Account Setup", icon: FaDollarSign },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium ${activeTab === t.id ? "bg-primary-600 text-white" : "text-muted"
                }`}
            >
              <t.icon />
              {t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-8">
          {activeTab === "financial" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Base Currency"
                name="baseCurrency"
                section="financialConfig"
                icon={FaDollarSign}
                options={[
                  { value: "INR", label: "INR - Indian Rupee" },
                  { value: "USD", label: "USD - US Dollar" },
                  { value: "EUR", label: "EUR - Euro" },
                ]}
                required
              />

              <SelectField
                label="Financial Year"
                name="financialYearStart"
                section="financialConfig"
                icon={FaCalendarAlt}
                options={[
                  { value: "January", label: "January" },
                  { value: "April", label: "April" },
                  { value: "July", label: "July" },
                  { value: "October", label: "October" },
                ]}
                required
              />
            </div>
          )}

          {activeTab === "accounts" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <FaDollarSign className="text-primary" />
                  General Accounts
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Chart of Accounts"
                    name="chartOfAccounts"
                    section="accountingSetup"
                    icon={FaMoneyBillWave}
                    required
                  />
                  <InputField
                    label="Default Expense GL"
                    name="defaultExpenseGL"
                    section="accountingSetup"
                    icon={FaMoneyBillWave}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <FaSyncAlt className="text-primary" />
                  Foreign Exchange
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="FX Gain/Loss Account"
                    name="fxGainLossAccount"
                    section="accountingSetup"
                    icon={FaDollarSign}
                  />

                  <SelectField
                    label="Revaluation Frequency"
                    name="revaluationFrequency"
                    section="accountingSetup"
                    icon={FaCalendarAlt}
                    options={[
                      { value: "Daily", label: "Daily" },
                      { value: "Weekly", label: "Weekly" },
                      { value: "Monthly", label: "Monthly" },
                      { value: "Quarterly", label: "Quarterly" },
                    ]}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <FaBullseye className="text-primary" />
                  Rounding
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Round-Off Account"
                    name="roundOffAccount"
                    section="accountingSetup"
                    icon={FaBullseye}
                  />

                  <InputField
                    label="Round-Off Cost Center"
                    name="roundOffCostCenter"
                    section="accountingSetup"
                    icon={FaBullseye}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <FaChartArea className="text-primary" />
                  Asset Valuation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Depreciation Account"
                    name="depreciationAccount"
                    section="accountingSetup"
                    icon={FaChartArea}
                  />

                  <InputField
                    label="Appreciation Account"
                    name="appreciationAccount"
                    section="accountingSetup"
                    icon={FaChartArea}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-app px-8 py-4 border-t flex justify-between">
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-lg border flex items-center gap-2"
          >
            <FaUndo />
            Reset All
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg bg-primary text-white flex items-center gap-2"
          >
            <FaSave />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountingDetails;
