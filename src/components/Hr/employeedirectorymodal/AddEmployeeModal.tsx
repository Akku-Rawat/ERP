// AddEmployeeModal.tsx - FIXED VERSION WITH AUTO-POPULATION
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
import { 
  getSalaryStructureByDesignation,
  getSalaryStructureByLevel,
  getLevelsFromHrSettings,
  getDefaultGrossSalary
} from "../../../views/hr/tabs/salarystructure";
import DocumentsTab from "./DocumentsTab";

const DEFAULT_FORM_DATA = {
  level: "",
  salaryStructure: "",
  salaryStructureSource: "",

  firstName: "",
  otherNames: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  nationality: "Zambian",
  maritalStatus: "",

  email: "",
  workEmail: "",
  phoneNumber: "",
  alternatePhone: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  country: "Zambia",

  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",

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

  nrcId: "",
  socialSecurityNapsa: "",
  nhimaHealthInsurance: "",
  tpinId: "",

  grossSalaryStarting: "",
  currency: "ZMW",
  paymentFrequency: "Monthly",
  paymentMethod: "BANK",

  accountName: "",
  accountNumber: "",
  bankName: "",
  branchCode: "",
  accountType: "Savings",

  openingLeaveBalance: "Incremental two (2) days per month of service",
  initialLeaveRateMonthly: "2",

  ceilingYear: "2025",
  ceilingAmount: "",

  monday: "Office",
  tuesday: "Office",
  wednesday: "Office",
  thursday: "Office",
  friday: "Office",
  saturday: "Off",
  sunday: "Off",

  notes: "",
  
  // ✅ Custom salary components
  customSalaryComponents: [],
};

const TAB_ORDER = [
  "Personal",
  "Contact",
  "Employment",
  "Leave-Setup",
  "Compensation & Payroll",
  "Work Schedule",
  "Documents",
] as const;

type TabKey = typeof TAB_ORDER[number];

type AddEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (payload: any) => void;
  departments: string[];
  level?: string[];
  verifiedData?: any;
  editData?: any;
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
  editData,
  level,
}) => {
  const [step, setStep] = useState<"verification" | "form">("verification");
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const activeTab = TAB_ORDER[currentTabIndex];
  const isLastTab = currentTabIndex === TAB_ORDER.length - 1;
  const [isPreFilled, setIsPreFilled] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [customDoc, setCustomDoc] = useState<{
    name: string;
    category: string;
    file: File | null;
  }>({
    name: "",
    category: "",
    file: null,
  });
  
  const levelsFromHrSettings = getLevelsFromHrSettings();

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [documents, setDocuments] = useState<Record<string, DocumentUpload>>({
    NRC: { uploaded: false },
    CV: { uploaded: false },
    EducationCertificates: { uploaded: false },
    PoliceReport: { uploaded: false },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Auto-set salary structure and gross when level changes
  useEffect(() => {
    if (!formData.level) return;

    const structureId = getSalaryStructureByLevel(formData.level);
    if (!structureId) return;

    const defaultGross = getDefaultGrossSalary(structureId);

    setFormData(prev => ({
      ...prev,
      salaryStructure: structureId,
      salaryStructureSource: "AUTO",
      grossSalaryStarting: defaultGross ? defaultGross.toString() : prev.grossSalaryStarting,
    }));
  }, [formData.level]);

  // ✅ Auto-set salary structure when job title changes
  useEffect(() => {
    if (!formData.jobTitle) return;

    const structureId = getSalaryStructureByDesignation(formData.jobTitle);
    if (!structureId) return;

    const defaultGross = getDefaultGrossSalary(structureId);

    setFormData(prev => ({
      ...prev,
      salaryStructure: structureId,
      salaryStructureSource: "AUTO",
      grossSalaryStarting: defaultGross ? defaultGross.toString() : prev.grossSalaryStarting,
    }));
  }, [formData.jobTitle]);

  useEffect(() => {
    if (!editData) return;
    setStep("form");
    setIsPreFilled(true);
  }, [editData]);

  useEffect(() => {
    if (isOpen && !editData) {
      setFormData(DEFAULT_FORM_DATA);
      setStep("verification");
      setIsPreFilled(false);
      setCurrentTabIndex(0);
    }
  }, [isOpen, editData]);

  useEffect(() => {
    if (!editData) return;

    setFormData((prev) => ({
      ...prev,
      firstName: editData.firstName || editData.name?.split(" ")[0] || "",
      lastName: editData.lastName || editData.name?.split(" ").slice(1).join(" ") || "",
      jobTitle: editData.jobTitle || "",
      department: editData.department || "",
      employmentStatus: editData.status || "Active",
      workLocation: editData.location || "",
      employeeId: editData.id || prev.employeeId,
    }));
  }, [editData]);

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

  const validateCurrentTab = (): string | null => {
    switch (activeTab) {
      case "Personal":
        if (!formData.firstName || !formData.lastName)
          return "First name and last name are required";
        if (!formData.dateOfBirth || !formData.gender)
          return "Date of birth and gender are required";
        return null;

      case "Contact":
        if (!formData.email || !formData.phoneNumber)
          return "Email and phone number are required";
        return null;

      case "Employment":
        if (!formData.department || !formData.jobTitle || !formData.engagementDate)
          return "Department, job title and engagement date are required";
        return null;

      case "Compensation & Payroll":
        if (!formData.salaryStructure || !formData.grossSalaryStarting)
          return "Salary structure and gross salary are required";
        return null;

      default:
        return null;
    }
  };

  const handleNext = () => {
    const error = validateCurrentTab();
    if (error) {
      setError(error);
      return;
    }
    setError(null);
    setCurrentTabIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setError(null);
    setCurrentTabIndex((prev) => prev - 1);
  };

  const handleInputChange = (field: string, value: string | boolean | any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    Level: formData.level,
    EmployeeType: formData.employeeType,
    EmploymentStatus: formData.employmentStatus,
    AccountType: formData.accountType,
    BankName: formData.bankName,
    AccountName: formData.accountName,
    AccountNumber: formData.accountNumber,
    PaymentMethod: formData.paymentMethod,
    GrossSalaryStarting: Number(formData.grossSalaryStarting),
    SalaryStructure: formData.salaryStructure,
    CustomSalaryComponents: formData.customSalaryComponents,
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
    setLoading(true);
    setError(null);

    try {
      const payload = buildPayload();
      console.log("Payload:", payload);
      onSuccess?.(payload);
    } catch (e: any) {
      setError(e.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
                {editData ? "Edit Employee" : "Employee Onboarding"}
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
                    <span className="font-medium">ID:</span> {formData.employeeId}
                  </div>
                )}
                {formData.department && (
                  <div>
                    <span className="font-medium">Dept:</span> {formData.department}
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
        <div className="flex border-b border-gray-200 bg-white px-6 overflow-x-auto">
          {TAB_ORDER.map((tab, index) => {
            const isClickable = index <= currentTabIndex;

            return (
              <button
                key={tab}
                disabled={!isClickable}
                onClick={() => isClickable && setCurrentTabIndex(index)}
                className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition
                  ${
                    index === currentTabIndex
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : isClickable
                      ? "text-gray-700 hover:text-purple-600"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
              >
                {tab}
              </button>
            );
          })}
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
              Level={levelsFromHrSettings}
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
              documents={documents}
              setUploadingDoc={setUploadingDoc}
              removeDocument={removeDocument}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <div className="flex gap-2">
            {currentTabIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="px-5 py-2 text-sm border rounded-lg hover:bg-gray-100"
              >
                Previous
              </button>
            )}

            {!isLastTab ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Employee"}
              </button>
            )}
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

        {/* ✅ Custom Document Upload Modal */}
        {uploadingDoc === "CUSTOM" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-4 border-b">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Add Other Document</h3>
                  <p className="text-xs text-gray-500">Upload additional employee documents</p>
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
                        <p className="text-xs text-green-600">File selected</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 10MB)</p>
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
              <div className="px-5 py-4 border-t flex justify-end gap-3 bg-gray-50">
                <button
                  onClick={() => {
                    setUploadingDoc(null);
                    setCustomDoc({ name: "", category: "", file: null });
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!customDoc.name || !customDoc.category || !customDoc.file) {
                      alert("Please fill all fields");
                      return;
                    }
                    addCustomDocument({
                      name: customDoc.name,
                      category: customDoc.category,
                      file: customDoc.file,
                    });
                    setUploadingDoc(null);
                    setCustomDoc({ name: "", category: "", file: null });
                  }}
                  disabled={!customDoc.name || !customDoc.category || !customDoc.file}
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEmployeeModal;