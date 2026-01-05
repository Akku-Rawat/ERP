import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import IdentityVerificationModal from "./IdentityVerificationModal";
import PersonalInfoTab from "./PersonalInfoTab";
import ContactInfoTab from "./ContactInfoTabs";

import EmploymentTab from "./EmploymentTab";
import CompensationTab from "./CompensationTab";
import { LeaveSetupTab } from "./LeaveSetupTab";
import { WorkScheduleTab } from "./WorkScheduletab";

type AddEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  departments: string[];
  verifiedData?: any;
};

type SalaryComponent = {
  name: string;
  type: "amount" | "percentage";
  value: string;
};

type DocumentUpload = {
  uploaded: boolean;
  fileName?: string;
  fileUrl?: string;
  file?: File;
  category?: string;
};

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  departments,
}) => {
  const [step, setStep] = useState<"verification" | "form">("verification");
  const [verifiedData, setVerifiedData] = useState<any>(null);

  const [activeTab, setActiveTab] = useState("Personal");
  const [isPreFilled, setIsPreFilled] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
const addCustomDocument = (payload: { name: string; category: string; file: File }) => {
  const { name, category, file } = payload;
  setDocuments((prev) => ({
    ...prev,
    [name]: {
      uploaded: true,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      file,
      category,
    },
  }));
};
const [customDoc, setCustomDoc] = useState<{
  name: string;
  category: string;
  file: File | null;
}>({
  name: "",
  category: "",
  file: null,
});






  const [formData, setFormData] = useState({
    // Personal
    firstName: "",
    otherNames: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Zambian",
    maritalStatus: "",

    // Contact
    email: "",
    workEmail: "",
    phoneNumber: "",
    alternatePhone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Zambia",

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",

    // Employment
    employeeId: "",
    department: "",
    jobTitle: "",
    employmentStatus: "Active",
    reportingManager: "",
    employeeType: "Permanent",
    engagementDate: "",
    probationPeriod: "3",
    contractEndDate: "",
    workLocation: "",
    shift: "Day Shift",

    // Identity & Statutory
    nrcId: "",
    socialSecurityNapsa: "",
    nhimaHealthInsurance: "",
    tpinId: "",

    // Compensation
    grossSalaryStarting: "",
    currency: "ZMW",
    paymentFrequency: "Monthly",
    paymentMethod: "BANK",

    // Bank Details
    accountName: "",
    accountNumber: "",
    bankName: "",
    branchCode: "",
    accountType: "Savings",

    // Leave
    openingLeaveBalance: "Incremental two (2) days per month of service",
    initialLeaveRateMonthly: "2",

    // Ceiling
    ceilingYear: "2025",
    ceilingAmount: "",

    // Work Schedule
    monday: "Office",
    tuesday: "Office",
    wednesday: "Office",
    thursday: "Office",
    friday: "Office",
    saturday: "Off",
    sunday: "Off",

    notes: "",
  });

  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>([
    { name: "Basic Salary", type: "amount", value: "" },
    { name: "Housing Allowance", type: "percentage", value: "" },
    { name: "Transport Allowance", type: "amount", value: "" },
  ]);
  

  const [documents, setDocuments] = useState<Record<string, DocumentUpload>>({
    NRC: { uploaded: false },
    CV: { uploaded: false },
    EducationCertificates: { uploaded: false },
    PoliceReport: { uploaded: false },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Calculate gross salary
  useEffect(() => {
    const baseAmount = salaryComponents.reduce((sum, comp) => {
      if (comp.type === "amount") {
        return sum + (parseFloat(comp.value) || 0);
      }
      return sum;
    }, 0);

    const percentageTotal = salaryComponents.reduce((sum, comp) => {
      if (comp.type === "percentage") {
        return sum + (baseAmount * (parseFloat(comp.value) || 0)) / 100;
      }
      return sum;
    }, 0);

    const gross = baseAmount + percentageTotal;
    if (gross > 0 && gross.toString() !== formData.grossSalaryStarting) {
      setFormData((prev) => ({
        ...prev,
        grossSalaryStarting: gross.toFixed(2),
      }));
    }
  }, [salaryComponents]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSalaryComponent = () => {
    setSalaryComponents([
      ...salaryComponents,
      { name: "", type: "amount", value: "" },
    ]);
  };

  const removeSalaryComponent = (index: number) => {
    setSalaryComponents(salaryComponents.filter((_, i) => i !== index));
  };

  const updateSalaryComponent = (
    index: number,
    field: keyof SalaryComponent,
    value: string
  ) => {
    const updated = [...salaryComponents];
    updated[index] = { ...updated[index], [field]: value };
    setSalaryComponents(updated);
  };

  const handleFileUpload = (docType: string, file: File) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        uploaded: true,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        file: file,
      },
    }));
    setUploadingDoc(null);
  };

  const removeDocument = (docType: string) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: { uploaded: false },
    }));
  };

  const buildPayload = () => ({
    FirstName: formData.firstName,
    LastName: formData.lastName,
    OtherNames: formData.otherNames,
    EmployeeId: formData.employeeId,
    EngagementDate: formData.engagementDate,
    Dob: formData.dateOfBirth,
    Gender: formData.gender,
    Email: formData.email,
    MaritalStatus: formData.maritalStatus,
    PhoneNumber: formData.phoneNumber,
    JobTitle: formData.jobTitle,
    Department: formData.department,
    EmployeeType: formData.employeeType,
    EmploymentStatus: formData.employmentStatus,
    AccountType: formData.accountType,
    BankName: formData.bankName,
    AccountName: formData.accountName,
    AccountNumber: formData.accountNumber,
    PaymentMethod: formData.paymentMethod,
    GrossSalaryStarting: Number(formData.grossSalaryStarting),
    SocialSecurityNapsa: formData.socialSecurityNapsa,
    NhimaHealthInsurance: formData.nhimaHealthInsurance,
    TpinId: formData.tpinId,
    NrcId: formData.nrcId,
    OpeningLeaveBalance: formData.openingLeaveBalance,
    InitialLeaveRateMonthly: Number(formData.initialLeaveRateMonthly),
    CeilingYear: Number(formData.ceilingYear),
    CeilingAmount: Number(formData.ceilingAmount),
    Documents: Object.entries(documents).reduce(
      (acc, [key, doc]) => ({
        ...acc,
        [key]: {
          uploaded: doc.uploaded,
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
        },
      }),
      {}
    ),
  });

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName) {
      setError("First name and last name are required");
      setActiveTab("Personal");
      return;
    }
    if (!formData.email) {
      setError("Email is required");
      setActiveTab("Contact");
      return;
    }
    if (
      !formData.department ||
      !formData.jobTitle ||
      !formData.engagementDate
    ) {
      setError("Department, job title and engagement date are required");
      setActiveTab("Employment");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = buildPayload();
      console.log("Payload:", payload);
      // await createEmployeeComplete(payload);
      onSuccess?.();
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill form data from verified identity
  useEffect(() => {
    if (!verifiedData) return;

    setFormData((prev) => ({
      ...prev,
      nrcId: verifiedData.identityInfo.nrc,
      socialSecurityNapsa: verifiedData.identityInfo.ssn,
      firstName: verifiedData.personalInfo.firstName,
      lastName: verifiedData.personalInfo.lastName,
      dateOfBirth: verifiedData.personalInfo.dateOfBirth,
      gender: verifiedData.personalInfo.gender,
      email: verifiedData.contactInfo.email,
      phoneNumber: verifiedData.contactInfo.phone,
      street: verifiedData.contactInfo.address.street,
      city: verifiedData.contactInfo.address.city,
      province: verifiedData.contactInfo.address.province,
      postalCode: verifiedData.contactInfo.address.postalCode,
      country: verifiedData.contactInfo.address.country,
    }));
  }, [verifiedData]);

  const tabs = [
    "Personal",
    "Contact",
    "Employment",
    "Leave-Setup",
    "Compensation & Payroll",
    "Work Schedule",
    "Documents",
  ];

  if (!isOpen) return null;

  // FIXED: Render verification modal properly
  if (step === "verification") {
    return (
      <IdentityVerificationModal
        onVerified={(data) => {
          setVerifiedData(data);
          setIsPreFilled(true);
          setStep("form");
        }}
        onManualEntry={() => {
          setIsPreFilled(false);
          setStep("form");
        }}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto pt-4 pb-4">
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-6xl mx-4 flex flex-col"
        style={{ maxHeight: "95vh" }}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇿🇲</span>
            <div>
              <div className="font-semibold text-gray-800">
                Employee Onboarding
              </div>
              <div className="text-xs text-gray-500">
                {isPreFilled
                  ? "✓ Verified from NAPSA"
                  : "Complete employee information"}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Employee Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                  <User className="w-8 h-8 text-gray-300" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition shadow-sm">
                  <Upload className="w-2.5 h-2.5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-800 truncate">
                  {formData.firstName || formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`.trim()
                    : "New Employee"}
                </h3>
                {isPreFilled && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                {formData.nrcId && (
                  <div>
                    <span className="font-medium">NRC:</span> {formData.nrcId}
                  </div>
                )}
                {formData.employeeId && (
                  <div>
                    <span className="font-medium">ID:</span>{" "}
                    {formData.employeeId}
                  </div>
                )}
                {formData.department && (
                  <div>
                    <span className="font-medium">Dept:</span>{" "}
                    {formData.department}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white px-6 overflow-x-auto flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 text-xs font-medium transition relative whitespace-nowrap ${
                activeTab === tab
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {activeTab === "Personal" && (
            <PersonalInfoTab
              formData={formData}
              handleInputChange={handleInputChange}
              isPreFilled={isPreFilled}
            />
          )}

          {activeTab === "Contact" && (
            <ContactInfoTab
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {activeTab === "Employment" && (
            <EmploymentTab
              formData={formData}
              handleInputChange={handleInputChange}
              departments={departments}
            />
          )}

          {activeTab === "Leave-Setup" && (
            <LeaveSetupTab
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {activeTab === "Compensation & Payroll" && (
            <CompensationTab
              formData={formData}
              handleInputChange={handleInputChange}
              salaryComponents={salaryComponents}
              setSalaryComponents={setSalaryComponents}
              addSalaryComponent={addSalaryComponent}
              removeSalaryComponent={removeSalaryComponent}
              updateSalaryComponent={updateSalaryComponent}
            />
          )}

          {activeTab === "Work Schedule" && (
            <WorkScheduleTab
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {activeTab === "Documents" && (
<DocumentsTab
  formData={formData}
  handleInputChange={handleInputChange}
  documents={documents}
  setUploadingDoc={setUploadingDoc}
  removeDocument={removeDocument}
  addCustomDocument={addCustomDocument}
/>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Saving..." : "Save Employee"}
          </button>
        </div>
      </div>

      {/* Document Upload Modal */}
      {uploadingDoc && uploadingDoc !== "CUSTOM" && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Upload Document
              </h3>
              <button
                onClick={() => setUploadingDoc(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Upload {uploadingDoc === "NRC" && "National Registration Card"}
                {uploadingDoc === "CV" && "Curriculum Vitae"}
                {uploadingDoc === "EducationCertificates" &&
                  "Education Certificates"}
                {uploadingDoc === "PoliceReport" && "Police Clearance Report"}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                PDF, JPG, PNG up to 10MB
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(uploadingDoc, file);
                  }
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 cursor-pointer transition"
              >
                Browse Files
              </label>
            </div>
          </div>
        </div>
      )}
{uploadingDoc === "CUSTOM" && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Add Other Document
          </h3>
          <p className="text-xs text-gray-500">
            Upload additional employee documents
          </p>
        </div>
        <button onClick={() => setUploadingDoc(null)}>
          <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        
        {/* Document Name */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Document Name
          </label>
          <input
            value={customDoc.name}
            onChange={(e) =>
              setCustomDoc((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="e.g. Bank Statement"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Document Category */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Document Category
          </label>
          <select
            value={customDoc.category}
            onChange={(e) =>
              setCustomDoc((p) => ({ ...p, category: e.target.value }))
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="">Select category</option>
            <option value="Identity">Identity</option>
            <option value="Employment">Employment</option>
            <option value="Financial">Financial</option>
            <option value="Medical">Medical</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Upload Box */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Upload Document
          </label>

          <label
            htmlFor="custom-doc-upload"
            className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed rounded-lg cursor-pointer transition
              border-gray-300 hover:border-purple-500 bg-gray-50 hover:bg-purple-50"
          >
            <Upload className="w-8 h-8 text-purple-500" />

            {customDoc.file ? (
              <>
                <p className="text-sm font-medium text-gray-700">
                  {customDoc.file.name}
                </p>
                <p className="text-xs text-green-600">
                  File selected
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400">
                  PDF, JPG, PNG (Max 10MB)
                </p>
              </>
            )}

            <input
              id="custom-doc-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) =>
                setCustomDoc((p) => ({
                  ...p,
                  file: e.target.files?.[0] || null,
                }))
              }
            />
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-5 py-4 border-t bg-gray-50">
        <button
          onClick={() => setUploadingDoc(null)}
          className="px-4 py-2 text-xs text-gray-700 border rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          disabled={!customDoc.name || !customDoc.category || !customDoc.file}
          onClick={() => {
            if (!customDoc.file) return;

            setDocuments((prev) => ({
              ...prev,
              [customDoc.name]: {
                uploaded: true,
                fileName: customDoc.file.name,
                fileUrl: URL.createObjectURL(customDoc.file),
                file: customDoc.file,
                category: customDoc.category,
              },
            }));

            setCustomDoc({ name: "", category: "", file: null });
            setUploadingDoc(null);
          }}
          className="px-5 py-2 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          Save Document
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default AddEmployeeModal;