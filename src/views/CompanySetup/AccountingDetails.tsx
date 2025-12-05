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

const STORAGE_KEY = "company_accounting_details_v1";

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

const AccountingDetails: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("financial");
  const refs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement | null>
  >({});
  const restoring = useRef(false);

  const tabs = [
    { id: "financial", label: "Financial Config", icon: FaCoins },
    { id: "accounts", label: "Account Setup", icon: FaDollarSign },
  ];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      restoring.current = true;
      requestAnimationFrame(() => {
        Object.keys(parsed).forEach((k) => {
          const el = refs.current[k];
          if (el) {
            try {
              el.value = parsed[k] ?? "";
            } catch {
              // ignore if not settable
            }
          }
        });
        const timestamp = parsed._savedAt || "earlier";
        setLastSaved(
          timestamp !== "earlier" ? `Last saved: ${timestamp}` : "Draft loaded",
        );
        setTimeout(() => {
          restoring.current = false;
        }, 0);
      });
    } catch (err) {
      console.warn("[AccountingDetails] restore failed", err);
      restoring.current = false;
    }
  }, []);

  const saveKey = (name: string, value: string) => {
    if (restoring.current) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const obj = raw ? JSON.parse(raw) : { ...defaultData };
      obj[name] = value;
      const now = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      obj._savedAt = now;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      setLastSaved(`Last saved: ${now}`);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.warn("[AccountingDetails] save failed", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.currentTarget;
    const name = target.getAttribute("name") ?? "";
    if (!name) return;
    setHasUnsavedChanges(true);
    saveKey(name, target.value ?? "");
  };

  const buildFormDataFromRefs = () => {
    const out: Record<string, string> = {};
    (Object.keys(defaultData) as FormKeys[]).forEach((k) => {
      const el = refs.current[k];
      out[k] = el ? (el.value ?? "") : "";
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
    if (
      !confirm(
        "Are you sure you want to reset all fields? This will clear all saved data.",
      )
    )
      return;
    (Object.keys(defaultData) as FormKeys[]).forEach((k) => {
      const el = refs.current[k];
      if (el) el.value = defaultData[k];
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      console.warn("[AccountingDetails] clear storage failed");
    }
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
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4 pointer-events-none z-10" />
        )}
        <input
          type={type}
          name={name}
          defaultValue={defaultData[name]}
          ref={attachRef(name)}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border bg-theme rounded-lg ${Icon ? "pl-10" : "pl-3.5"} pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary-600)] transition-all hover:border-theme`}
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
    name: FormKeys;
    options: SelectOption[];
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
    <div className="relative">
      <label className="block text-sm font-medium text-muted mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4 pointer-events-none z-10" />
        )}
        <select
          name={name}
          defaultValue={defaultData[name]}
          ref={attachRef(name)}
          onChange={handleChange}
          required={required}
          className={`w-full border bg-theme rounded-lg ${Icon ? "pl-10" : "pl-3.5"} pr-10 py-2.5 text-sm bg-card focus:ring-2 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary-600)] transition-all hover:border-theme appearance-none`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="">
      <div className="w-full ">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 rounded-lg p-4 shadow-sm">
            <FaCheckCircle
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "var(--success)" }}
            />
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--success)" }}
              >
                Configuration saved successfully!
              </p>
              <p className="text-xs text-success mt-0.5">
                All changes have been stored
              </p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-card rounded-xl shadow-sm border bg-theme overflow-hidden">
          {/* Tab Navigation */}
          {/* Tab Navigation — filled active tab */}
          <div
            className="bg-app"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div
              className="flex items-stretch"
              style={{ borderRadius: "0.5rem 0.5rem 0 0", overflow: "hidden" }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all"
                    style={{
                      background: isActive
                        ? "var(--primary-600)"
                        : "transparent",
                      color: isActive
                        ? "var(--table-head-text)"
                        : "var(--muted)",
                      borderBottom: isActive
                        ? `3px solid var(--primary-700)`
                        : "3px solid transparent",
                    }}
                  >
                    <Icon
                      style={{
                        width: 16,
                        height: 16,
                        color: isActive
                          ? "var(--table-head-text)"
                          : "var(--muted)",
                      }}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Financial Configuration Tab */}
            {activeTab === "financial" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="Base Currency"
                    name="currency"
                    icon={FaDollarSign}
                    options={[
                      { value: "INR", label: "INR - Indian Rupee (₹)" },
                      { value: "USD", label: "USD - US Dollar ($)" },
                      { value: "zar", label: "ZAR - South African Rand (R)" },
                      { value: "ngn", label: "NGN - Nigerian Naira (₦)" },
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
              </div>
            )}

            {/* Account Setup Tab */}
            {activeTab === "accounts" && (
              <div className="space-y-8">
                {/* General Accounts Section */}
                <div>
                  <h3 className="text-base font-semibold text-main mb-4 flex items-center gap-2">
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

                {/* Foreign Exchange Section */}
                <div>
                  <h3 className="text-base font-semibold text-main mb-4 flex items-center gap-2">
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

                {/* Rounding Section */}
                <div>
                  <h3 className="text-base font-semibold text-main mb-4 flex items-center gap-2">
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

                {/* Asset Valuation Section */}
                <div>
                  <h3 className="text-base font-semibold text-main mb-4 flex items-center gap-2">
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

          {/* Action Footer */}
          <div className="bg-app px-8 py-4 border-t bg-theme flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg border shadow-sm 
             text-sm font-semibold flex items-center gap-2 
             hover:bg-app transition-all active:scale-[0.98]"
              style={{
                borderColor: "var(--border)",
                color: "var(--text)",
                background: "var(--card)",
              }}
            >
              <FaUndo className="w-4 h-4 opacity-80" />
              Reset All
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-600 
             text-white text-sm font-semibold shadow flex items-center gap-2 
             transition-all active:scale-[0.98]"
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
