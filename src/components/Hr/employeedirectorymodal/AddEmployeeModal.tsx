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

import { createEmployee, updateEmployeeById } from "../../../api/employeeapi";






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
  CompanyEmail: "",
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

 contractEndDate: "",
workLocation: "",
 workAddress: "",
 probationPeriod: "",
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

workSchedule: "",

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
 
] as const;



type AddEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  departments: string[];
  level?: string[];
  verifiedData?: any;
  editData?: any;
  mode?: "add" | "edit";
};



const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  departments,
  editData,
  level,
  mode = "add",
}) => {
  const [step, setStep] = useState<"verification" | "form">("verification");
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const activeTab = TAB_ORDER[currentTabIndex];
  const isLastTab = currentTabIndex === TAB_ORDER.length - 1;
  const [isPreFilled, setIsPreFilled] = useState(false);
  
  const [verifiedFields, setVerifiedFields] = useState<Record<string, boolean>>({});



  
  const levelsFromHrSettings = getLevelsFromHrSettings();

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
 
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

  // Auto-set salary structure when job title changes
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

  setStep("form");
  setIsPreFilled(true);

  setFormData(prev => ({
    ...prev,

    // PERSONAL
    firstName: editData.personalInfo?.FirstName || "",
    otherNames: editData.personalInfo?.OtherNames || "",
    lastName: editData.personalInfo?.LastName || "",
    dateOfBirth: editData.personalInfo?.Dob || "",
    gender: editData.personalInfo?.Gender || "",
    nationality: editData.personalInfo?.Nationality || "",
    maritalStatus: editData.personalInfo?.maritalStatus || "",

    // CONTACT
    email: editData.contactInfo?.Email || "",
    CompanyEmail: editData.contactInfo?.workEmail || "",
    phoneNumber: editData.contactInfo?.phoneNumber || "",
    alternatePhone: editData.contactInfo?.alternatePhone || "",
    street: editData.contactInfo?.address?.street || "",
    city: editData.contactInfo?.address?.city || "",
    province: editData.contactInfo?.address?.province || "",
    postalCode: editData.contactInfo?.address?.postalCode || "",
    country: editData.contactInfo?.address?.country || "Zambia",


    emergencyContactName: editData.contactInfo?.emergencyContact?.name ?? "",

   emergencyContactPhone: editData.contactInfo?.emergencyContact?.phone ?? "",

emergencyContactRelationship:
  editData.contactInfo?.emergencyContact?.relationship ?? "",

    // EMPLOYMENT
    employeeId: editData.employmentInfo?.employeeId || "",
    department: editData.employmentInfo?.Department || "",
    jobTitle: editData.employmentInfo?.JobTitle || "",
    employeeType: editData.employmentInfo?.EmployeeType || "",
    engagementDate: editData.employmentInfo?.joiningDate || "",
    probationPeriod: editData.employmentInfo?.probationPeriod || "",
    contractEndDate: editData.employmentInfo?.contractEndDate || "",
    workLocation: editData.employmentInfo?.workLocation || "",
    workAddress: editData.employmentInfo?.workAddress || "",
    shift: editData.employmentInfo?.shift || "",

    // STATUS
    employmentStatus: editData.status || "Active",

    // PAYROLL (basic safe fill)
    grossSalaryStarting: editData.payrollInfo?.grossSalary || "",
    currency: editData.payrollInfo?.currency || "ZMW",
    paymentFrequency: editData.payrollInfo?.paymentFrequency || "",
    paymentMethod: editData.payrollInfo?.paymentMethod || "BANK",

    accountNumber: editData.payrollInfo?.bankAccount?.AccountNumber || "",
    accountName: editData.payrollInfo?.bankAccount?.AccountName || "",
    bankName: editData.payrollInfo?.bankAccount?.BankName || "",
    branchCode: editData.payrollInfo?.bankAccount?.branchCode || "",
    accountType: editData.payrollInfo?.bankAccount?.AccountType || "Savings",
  }));
}, [editData]);

useEffect(() => {
  if (!verifiedData) return;

  setFormData((prev) => ({
    ...prev,
    nrcId: verifiedData.identityInfo?.nrc || "",
    socialSecurityNapsa: verifiedData.identityInfo?.ssn || "",
    firstName: verifiedData.personalInfo?.firstName || "",
    lastName: verifiedData.personalInfo?.lastName || "",
    gender: verifiedData.personalInfo?.gender || "",
  }));

  setVerifiedFields({
    nrcId: !!verifiedData.identityInfo?.nrc,
    socialSecurityNapsa: !!verifiedData.identityInfo?.ssn,
    firstName: true,
    lastName: true,
    gender: true,
  });

  setIsPreFilled(true);
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

 






  const buildPayload = () => ({
    FirstName: formData.firstName,
    LastName: formData.lastName,
    OtherNames: formData.otherNames,
    EmployeeId: formData.employeeId,
    EngagementDate: formData.engagementDate,
    contractEndDate: formData.contractEndDate,
    Dob: formData.dateOfBirth,
    Gender: formData.gender,
    Email: formData.email,
    workLocation: formData.workLocation, 
   workAddress: formData.workAddress,
     CompanyEmail: formData.CompanyEmail,
    MaritalStatus: formData.maritalStatus,
    ReportingManager: formData.reportingManager,
    PhoneNumber: formData.phoneNumber,
    AlternatePhone: formData.alternatePhone,
    JobTitle: formData.jobTitle,
    reportingManager: formData.reportingManager,
    probationPeriod: formData.probationPeriod,
    //ADRESSS
    addressStreet: formData.street,
    addressCity: formData.city,
    addressProvince: formData.province,
    addressPostalCode: formData.postalCode,
    addressCountry: formData.country,
    DepartmentId: formData.department,
    //EMERGENCY CONTACT
    emergencyContactName: formData.emergencyContactName,
    emergencyContactPhone: formData.emergencyContactPhone,
    emergencyContactRelationship: formData.emergencyContactRelationship,

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

 WorkScheduleId: formData.workSchedule,

    OpeningLeaveBalance: formData.openingLeaveBalance,
    InitialLeaveRateMonthly: Number(formData.initialLeaveRateMonthly),
    CeilingYear: Number(formData.ceilingYear),
    CeilingAmount: Number(formData.ceilingAmount),
   

  });

const handleSave = async () => {
  setLoading(true);
  setError(null);

  try {
    if (editData?.id) {
      // ✅ EDIT FLOW
      const payload = {
        id: String(editData.id), // backend expects this
        ...buildPayload(),
      };

      await updateEmployeeById(payload);
    } else {
      // ✅ CREATE FLOW
      await createEmployee(buildPayload());
    }

    onSuccess?.();
    onClose();
  } catch (e: any) {
    setError(e.message || "Failed to save employee");
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
    setVerifiedData(null);       
    setIsPreFilled(false);
    setVerifiedFields({});      
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
            const isClickable =
  mode === "edit" ? true : index <= currentTabIndex;


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
                verifiedFields={verifiedFields}
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

      
        
      </div>
    </div>
  );
};

export default AddEmployeeModal;