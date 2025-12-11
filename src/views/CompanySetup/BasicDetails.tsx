import React, { useEffect, useRef, useState } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaGlobe,
  FaIdCard,
  FaIndustry,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaFileAlt,
  FaSave,
  FaUndo,
} from "react-icons/fa";

const STORAGE_KEY = "company_setup_basicdetails_v3_tabs";

const defaultData = {
  companyName: "",
  district: "",
  city: "",
  postalCode: "",
  province: "",
  companyEmail: "",
  companyPhoneNo: "",
  alternateNo: "",
  companyStatus: "",
  contactPerson: "",
  companyType: "",
  legalName: "",
  parentCompany: "",
  timeZone: "",
  email: "",
  contactEmail: "",
  phoneNumber: "",
  website: "",
  status: "Active",
  crnCin: "",
  tax: "",
  registerNo: "",
  tpin: "",
  swiftCode: "",
  dateOfIncorporation: "",
  placeOfRegistration: "",
  industryType: "",
  financialYearBegins: "",
  addressLine1: "",
  addressLine2: "",
  state: "",
  country: "",
  homeBranch: "",
  branchOffice: "",
  onboardingBalance: "",
} as const;

type FormKeys = keyof typeof defaultData;

const BasicDetails: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("registration");
  const [lastSaved, setLastSaved] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const refs = useRef<
    Record<
      string,
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
    >
  >({});
  const restoring = useRef(false);

  const tabs = [
    { id: "registration", label: "Registration", icon: FaFileAlt },
    { id: "contact", label: "Contact Info", icon: FaPhone },
    { id: "address", label: "Address", icon: FaMapMarkerAlt },
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
      console.warn("[BasicDetails] restore failed", err);
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
      console.warn("[BasicDetails] save failed", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
    console.log("[BasicDetails] submit", data);
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
      if (el) el.value = defaultData[k] as string;
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      console.warn("[BasicDetails] clear storage failed");
    }
    setLastSaved("");
    setHasUnsavedChanges(false);
  };

  const attachRef =
    (name: string) =>
    (el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null) => {
      refs.current[name] = el;
    };

  interface InputFieldProps {
    label: string;
    name: FormKeys;
    type?: string;
    icon?: React.ComponentType<{ className?: string }>;
    required?: boolean;
    placeholder?: string;
    colSpan?: number;
  }

  const InputField = ({
    label,
    name,
    type = "text",
    icon: Icon,
    required = false,
    placeholder = "",
    colSpan = 1,
  }: InputFieldProps) => {
    const colClass = colSpan >= 2 ? "md:col-span-2" : "";
    const id = `input_${name}`;

    return (
      <div className={`relative ${colClass}`}>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-main mb-1.5"
        >
          {label}{" "}
          {required && <span style={{ color: "var(--danger)" }}>*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4 pointer-events-none z-10" />
          )}
          <input
            id={id}
            type={type}
            name={name}
            defaultValue={defaultData[name] as string}
            ref={attachRef(name)}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className={`w-full border border-[var(--border)] rounded-lg ${Icon ? "pl-10" : "pl-3.5"} pr-3.5 py-2.5 text-sm focus:outline-none focus-ring transition-all hover:border-[var(--border)] bg-card text-main`}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="w-full ">
        {/* Success Message */}
        {showSuccess && (
          <div
            className="mb-4 rounded-lg p-4 flex items-center gap-3 shadow-sm badge-success"
            role="status"
          >
            <FaCheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-main">
                Details saved successfully!
              </p>
              <p className="text-xs text-muted mt-0.5">
                All changes have been stored
              </p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-card rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-[var(--border)] bg-[var(--card)]">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-pressed={isActive}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3
                       text-sm font-medium transition-all border-b-2 ${
                         isActive
                           ? "bg-primary  text-table-head-text"
                           : "border-transparent text-main hover:bg-[var(--row-hover)]"
                       }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Registration Tab */}
            {activeTab === "registration" && (
              <div>
                <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                  <InputField
                    label="Registration No"
                    name="registerNo"
                    icon={FaIdCard}
                    placeholder="Enter Registration No"
                  />
                  <InputField
                    label="Tax Id / TPIN"
                    name="tax"
                    icon={FaIdCard}
                    placeholder="Enter Tax Id"
                  />
                  <InputField
                    label="Company Name"
                    name="companyName"
                    icon={FaBuilding}
                    placeholder="Enter Company Name"
                    required
                  />
                  <InputField
                    label="Date of Incorporation"
                    name="dateOfIncorporation"
                    type="date"
                    icon={FaCalendarAlt}
                  />
                  <InputField
                    label="Company Type"
                    name="companyType"
                    icon={FaBuilding}
                    placeholder="e.g., Private Limited, LLC"
                  />
                  <InputField
                    label="Company Status"
                    name="companyStatus"
                    placeholder="e.g., Active, Inactive"
                  />
                  <InputField
                    label="Industry Type"
                    name="industryType"
                    icon={FaIndustry}
                    placeholder="e.g., Technology, Manufacturing"
                  />
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    label="Company Email"
                    name="companyEmail"
                    type="email"
                    icon={FaEnvelope}
                    required
                    placeholder="company@example.com"
                  />
                  <InputField
                    label="Company Phone No"
                    name="companyPhoneNo"
                    type="tel"
                    icon={FaPhone}
                    placeholder="+1 (555) 000-0000"
                  />
                  <InputField
                    label="Alternate Phone No"
                    name="alternateNo"
                    type="tel"
                    icon={FaPhone}
                    placeholder="+1 (555) 000-0000"
                  />
                  <InputField
                    label="Website"
                    name="website"
                    type="url"
                    icon={FaGlobe}
                    placeholder="https://www.example.com"
                  />
                  <InputField
                    label="Contact Person"
                    name="contactPerson"
                    icon={FaUser}
                    placeholder="Full Name"
                  />
                  <InputField
                    label="Contact Email"
                    name="email"
                    type="email"
                    icon={FaEnvelope}
                    placeholder="contact@example.com"
                  />
                  <InputField
                    label="Contact Phone"
                    name="phoneNumber"
                    type="tel"
                    icon={FaPhone}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    label="Address Line 1"
                    name="addressLine1"
                    icon={FaMapMarkerAlt}
                    placeholder="Street address"
                    colSpan={2}
                  />
                  <InputField
                    label="Address Line 2"
                    name="addressLine2"
                    placeholder="Apartment, suite, etc. (optional)"
                    colSpan={2}
                  />
                  <InputField
                    label="City"
                    name="city"
                    placeholder="Enter City"
                  />
                  <InputField
                    label="District"
                    name="district"
                    placeholder="Enter District"
                  />
                  <InputField
                    label="Province / State"
                    name="province"
                    placeholder="Enter Province"
                  />
                  <InputField
                    label="Country"
                    name="country"
                    placeholder="Enter Country"
                  />
                  <InputField
                    label="Postal Code"
                    name="postalCode"
                    placeholder="ZIP / Postal Code"
                  />
                  <InputField
                    label="Time Zone"
                    name="timeZone"
                    placeholder="e.g., UTC+05:30"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="bg-card px-8 py-4 border-t border-[var(--border)] flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg border shadow-sm 
                        text-sm font-semibold flex items-center gap-2 
                         transition-all active:scale-[0.98]"
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
              className="px-5 py-2.5 rounded-lg bg-primary 
             text-white text-sm font-semibold shadow flex items-center gap-2 
             transition-all active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(90deg, var(--primary) 0%, var(--primary-600) 100%)",
                color: "#fff",
              }}
            >
              <FaSave className="w-4 h-4" />
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
