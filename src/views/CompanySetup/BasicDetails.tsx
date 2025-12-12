import React, { useEffect, useState } from "react";
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

import type {
  BasicDetailsForm,
  ContactInfo,
  RegistrationDetails,
  Address,
} from "../../types/company";

import { updateCompanyById } from "../../api/companySetupApi";
import { transformBasicDetailPayload, appendFormData } from "../../utility/buildFormData";


const defaultForm: BasicDetailsForm = {
  registration: {
    registerNo: "",
    tpin: "",
    companyName: "",
    dateOfIncorporation: "",
    companyType: "",
    companyStatus: "",
    industryType: "",
  },
  contact: {
    companyEmail: "",
    companyPhone: "",
    alternatePhone: "",
    website: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
  },
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    province: "",
    postalCode: "",
    country: "",
    timeZone: "",
  },
};

interface InputFieldProps {
  label: string;
  name: string;
  section: keyof BasicDetailsForm;
  type?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  placeholder?: string;
  colSpan?: number;
}

interface BasicDetailsProps {
  basic?: BasicDetailsForm | null;
}


const BasicDetails: React.FC<BasicDetailsProps> = ({ basic }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("registration");
  const [form, setForm] = useState<BasicDetailsForm>(() => ({
    registration: {
      ...defaultForm.registration,
      ...(basic?.registration || {}),
    },
    contact: {
      ...defaultForm.contact,
      ...(basic?.contact || {}),
    },
    address: {
      ...defaultForm.address,
      ...(basic?.address || {}),
    },
  }));


  useEffect(() => {
    if (basic) {
      setForm((prev) => ({
        registration: {
          ...prev.registration,
          ...(basic.registration || {}),
        },
        contact: {
          ...prev.contact,
          ...(basic.contact || {}),
        },
        address: {
          ...prev.address,
          ...(basic.address || {}),
        },
      }));
    }
  }, [basic]);

  const handleChange = (
    section: keyof BasicDetailsForm,
    key: string,
    value: string
  ) => {
    setForm((prev) => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
      return updated;
    });
  };

  const handleSubmit = async () => {
    const data = {
      id: "COMP-00003",
      ...form,
    };

    try {
      const transformedPayload = transformBasicDetailPayload(data);
      const formData = new FormData();
      appendFormData(formData, transformedPayload);
      // for (let [k, v] of formData.entries()) {
      //   console.log(k, v);
      // }
      await updateCompanyById(formData);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update company basic details.");
    }
  };


  const handleReset = () => {
    if (!confirm("Reset all fields?")) return;

    setForm(defaultForm);
  };

  const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    section,
    type = "text",
    icon: Icon,
    required = false,
    placeholder = "",
    colSpan = 1,
  }) => {

    const colClass = colSpan >= 2 ? "md:col-span-2" : "";
    const id = `input_${name}`;

    return (
      <div className={`relative ${colClass}`}>
        <label htmlFor={id} className="block text-sm font-medium text-main mb-1.5">
          {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
        </label>

        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4 pointer-events-none z-10" />
          )}

          <input
            id={id}
            type={type}
            value={form[section][name] ?? ""}
            onChange={(e) => handleChange(section, name, e.target.value)}
            placeholder={placeholder}
            required={required}
            className={`w-full border border-theme rounded-lg ${Icon ? "pl-10" : "pl-3.5"
              } pr-3.5 py-2.5 text-sm focus:outline-none bg-card text-main`}
          />
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "registration", label: "Registration", icon: FaFileAlt },
    { id: "contact", label: "Contact Info", icon: FaPhone },
    { id: "address", label: "Address", icon: FaMapMarkerAlt },
  ];

  return (
    <div className="w-full">
      {showSuccess && (
        <div className="mb-4 rounded-lg p-4 flex items-center gap-3 shadow-sm badge-success">
          <FaCheckCircle className="w-5 h-5 text-success" />
          <div>
            <p className="text-sm font-medium text-main">Details saved successfully!</p>
            <p className="text-xs text-muted">All changes have been stored</p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm border border-theme overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-theme bg-[var(--card)]">
          <div className="flex">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${active ? "table-head text-table-head-text" : "text-main"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === "registration" && (
            <div className="grid grid-cols-3 gap-6">
              <InputField label="Registration No" name="registerNo" section="registration" icon={FaIdCard} />
              <InputField label="Tax Id / TPIN" name="tpin" section="registration" icon={FaIdCard} />
              <InputField label="Company Name" name="companyName" section="registration" icon={FaBuilding} required />
              <InputField label="Date of Incorporation" name="dateOfIncorporation" type="date" section="registration" icon={FaCalendarAlt} />
              <InputField label="Company Type" name="companyType" section="registration" icon={FaBuilding} />
              <InputField label="Company Status" name="companyStatus" section="registration" />
              <InputField label="Industry Type" name="industryType" section="registration" icon={FaIndustry} />
            </div>
          )}

          {activeTab === "contact" && (
            <div className="grid grid-cols-3 gap-6">
              <InputField label="Company Email" name="companyEmail" section="contact" icon={FaEnvelope} required />
              <InputField label="Company Phone" name="companyPhone" section="contact" icon={FaPhone} />
              <InputField label="Alternate Phone" name="alternatePhone" section="contact" icon={FaPhone} />
              <InputField label="Website" name="website" section="contact" icon={FaGlobe} />
              <InputField label="Contact Person" name="contactPerson" section="contact" icon={FaUser} />
              <InputField label="Contact Email" name="contactEmail" section="contact" icon={FaEnvelope} />
              <InputField label="Contact Phone" name="contactPhone" section="contact" icon={FaPhone} />
            </div>
          )}

          {activeTab === "address" && (
            <div className="grid grid-cols-3 gap-6">
              <InputField label="Address Line 1" name="addressLine1" section="address" colSpan={2} icon={FaMapMarkerAlt} />
              <InputField label="Address Line 2" name="addressLine2" section="address" colSpan={2} />
              <InputField label="City" name="city" section="address" />
              <InputField label="District" name="district" section="address" />
              <InputField label="Province" name="province" section="address" />
              <InputField label="Country" name="country" section="address" />
              <InputField label="Postal Code" name="postalCode" section="address" />
              <InputField label="Time Zone" name="timeZone" section="address" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-card px-8 py-4 border-t border-theme flex justify-between">
          <button onClick={handleReset} className="px-5 py-2.5 rounded-lg border flex items-center gap-2">
            <FaUndo className="w-4 h-4" />
            Reset All
          </button>

          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-lg bg-primary text-white flex items-center gap-2">
            <FaSave className="w-4 h-4" />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
