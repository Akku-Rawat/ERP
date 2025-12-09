import React, { useEffect, useRef, useState } from "react";
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

const defaultData = {
  chartOfAccounts: "",
  defaultExpenseGL: "",
  exchangeGainLossAccount: "",
  exchangeRateRevaluationFreq: "Monthly",
  roundOffAccount: "",
  roundOffCostCenter: "",
  depreciationExpenseAccount: "",
  appreciationIncomeAccount: "",
  currency: "INR",
  financialYearBegins: "April",
} as const;

type FormKeys = keyof typeof defaultData;

interface AccountingDetailsProps {
  financialConfig?: FinancialConfig | null;
  accountingSetup?: AccountingSetup | null;
}

const AccountingDetails: React.FC<AccountingDetailsProps> = ({
  financialConfig,
  accountingSetup,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("financial");
  const refs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | null>>({});
  const restoring = useRef(false);

  console.log("financialConfig: ", financialConfig);
  console.log("accountingSetup: ", accountingSetup);


  const mergedProps = {
    chartOfAccounts: accountingSetup?.chartOfAccounts ?? "",
    defaultExpenseGL: accountingSetup?.defaultExpenseGL ?? "",
    exchangeGainLossAccount: accountingSetup?.fxGainLossAccount ?? "",
    exchangeRateRevaluationFreq: accountingSetup?.revaluationFrequency ?? "Monthly",
    roundOffAccount: accountingSetup?.roundOffAccount ?? "",
    roundOffCostCenter: accountingSetup?.roundOffCostCenter ?? "",
    depreciationExpenseAccount: accountingSetup?.depreciationAccount ?? "",
    appreciationIncomeAccount: accountingSetup?.appreciationAccount ?? "",
    currency: financialConfig?.baseCurrency ?? "INR",
    financialYearBegins: financialConfig?.financialYearStart ?? "April",
  };

  const initialData = { ...defaultData, ...mergedProps };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.currentTarget;
    const name = target.getAttribute("name") ?? "";
    if (!name) return;

    setHasUnsavedChanges(true);
  };


  const buildFormDataFromRefs = () => {
    const out: Record<string, string> = {};
    (Object.keys(defaultData) as FormKeys[]).forEach((k) => {
      const el = refs.current[k];
      out[k] = el ? el.value ?? "" : "";
    });
    return out as Record<FormKeys, string>;
  };


  const handleSubmit = () => {
    const data = buildFormDataFromRefs();
    console.log("[AccountingDetails] submit", data);
    setShowSuccess(true);
    setHasUnsavedChanges(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };


  const handleReset = () => {
    if (!confirm("Reset all fields and clear saved data?")) return;

    (Object.keys(defaultData) as FormKeys[]).forEach((k) => {
      const el = refs.current[k];
      if (el) el.value = initialData[k];
    });
    setLastSaved("");
    setHasUnsavedChanges(false);
  };

  const attachRef =
    (name: string) => (el: HTMLInputElement | HTMLSelectElement | null) => {
      refs.current[name] = el;
    };



  interface InputFieldProps {
    label: string;
    name: FormKeys;
    type?: string;
    icon?: React.ComponentType<{ className?: string }>;
    required?: boolean;
    placeholder?: string;
  }

  const InputField = ({
    label,
    name,
    type = "text",
    icon: Icon,
    required = false,
    placeholder = "",
  }: InputFieldProps) => (
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
          name={name}
          defaultValue={initialData[name]}
          ref={attachRef(name)}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border bg-theme rounded-lg ${Icon ? "pl-10" : "pl-3.5"
            } pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[var(--primary)]`}
        />
      </div>
    </div>
  );

  interface SelectFieldProps {
    label: string;
    name: FormKeys;
    options: { value: string; label: string }[];
    icon?: React.ComponentType<{ className?: string }>;
    required?: boolean;
  }

  const SelectField = ({
    label,
    name,
    options,
    icon: Icon,
    required = false,
  }: SelectFieldProps) => (
    <div>
      <label className="block text-sm font-medium text-muted mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />
        )}
        <select
          name={name}
          defaultValue={initialData[name]}
          ref={attachRef(name)}
          onChange={handleChange}
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


  return (
    <div className="">
      <div className="w-full">
        {showSuccess && (
          <div className="mb-4 rounded-lg p-4 shadow-sm flex items-center gap-3">
            <FaCheckCircle className="w-5 h-5" style={{ color: "var(--success)" }} />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--success)" }}>
                Configuration saved successfully!
              </p>
              <p className="text-xs text-success">All changes have been stored</p>
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl shadow-sm border bg-theme overflow-hidden">
          {/* Tabs */}
          <div className="bg-app border-b">
            <div className="flex">
              {[
                { id: "financial", label: "Financial Config", icon: FaCoins },
                { id: "accounts", label: "Account Setup", icon: FaDollarSign },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium"
                    style={{
                      background: active ? "var(--primary-600)" : "transparent",
                      color: active ? "var(--table-head-text)" : "var(--muted)",
                      borderBottom: active
                        ? "3px solid var(--primary-700)"
                        : "3px solid transparent",
                    }}
                  >
                    <Icon
                      style={{
                        width: 16,
                        height: 16,
                        color: active ? "var(--table-head-text)" : "var(--muted)",
                      }}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-8">
            {activeTab === "financial" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Base Currency"
                  name="currency"
                  icon={FaDollarSign}
                  options={[
                    { value: "INR", label: "INR - Indian Rupee (₹)" },
                    { value: "USD", label: "USD - US Dollar ($)" },
                    { value: "ZAR", label: "ZAR - South African Rand (R)" },
                    { value: "NGN", label: "NGN - Nigerian Naira (₦)" },
                    { value: "EUR", label: "EUR - Euro (€)" },
                    { value: "GBP", label: "GBP - British Pound (£)" },
                    { value: "AUD", label: "AUD - Australian Dollar (A$)" },
                  ]}
                  required
                />

                <SelectField
                  label="Financial Year Start"
                  name="financialYearBegins"
                  icon={FaCalendarAlt}
                  options={[
                    { value: "January", label: "January (Jan - Dec)" },
                    { value: "April", label: "April (Apr - Mar)" },
                    { value: "July", label: "July (Jul - Jun)" },
                    { value: "October", label: "October (Oct - Sep)" },
                  ]}
                  required
                />
              </div>
            )}

            {activeTab === "accounts" && (
              <div className="space-y-8">
                {/* GENERAL */}
                <div>
                  <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
                    <FaDollarSign className="text-primary" />
                    General Accounts
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Chart of Accounts"
                      name="chartOfAccounts"
                      icon={FaMoneyBillWave}
                      placeholder="e.g., Standard COA"
                      required
                    />
                    <InputField
                      label="Default Expense GL"
                      name="defaultExpenseGL"
                      icon={FaMoneyBillWave}
                      placeholder="e.g., 5000-001"
                    />
                  </div>
                </div>

                {/* FX */}
                <div>
                  <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
                    <FaSyncAlt className="text-primary" />
                    Foreign Exchange
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="FX Gain/Loss Account"
                      name="exchangeGainLossAccount"
                      icon={FaDollarSign}
                      placeholder="e.g., 7500-001"
                    />

                    <SelectField
                      label="Revaluation Frequency"
                      name="exchangeRateRevaluationFreq"
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

                {/* ROUNDING */}
                <div>
                  <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
                    <FaBullseye className="text-primary" />
                    Rounding
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Round-Off Account"
                      name="roundOffAccount"
                      icon={FaBullseye}
                      placeholder="e.g., 6800-001"
                    />

                    <InputField
                      label="Round-Off Cost Center"
                      name="roundOffCostCenter"
                      icon={FaBullseye}
                      placeholder="e.g., CC-001"
                    />
                  </div>
                </div>

                {/* ASSETS */}
                <div>
                  <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
                    <FaChartArea className="text-primary" />
                    Asset Valuation
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Depreciation Account"
                      name="depreciationExpenseAccount"
                      icon={FaChartArea}
                      placeholder="e.g., 6500-001"
                    />

                    <InputField
                      label="Appreciation Account"
                      name="appreciationIncomeAccount"
                      icon={FaChartArea}
                      placeholder="e.g., 4500-001"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="bg-app px-8 py-4 border-t flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg border shadow-sm text-sm font-semibold flex items-center gap-2"
            >
              <FaUndo className="w-4 h-4 opacity-80" />
              Reset All
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold shadow flex items-center gap-2"
              style={{
                background:
                  "linear-gradient(90deg, var(--primary) 0%, var(--primary-600) 100%)",
              }}
            >
              <FaSave className="w-4 h-4 opacity-90" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingDetails;
