import React, { useMemo, useState } from "react";
import {
  showApiError,
  showSuccess,
  showLoading,
  closeSwal,
} from "../../../utils/alert";
import {
  Eye,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  FileText,
  X,
} from "lucide-react";
import { updateEmployeeDocuments } from "../../../api/employeeapi";
import { ERP_BASE } from "../../../config/api";
import { calculateZmPayrollFromGross } from "../payroll-system/util";
import { useAssignedSalaryStructure } from "../../../hooks/useAssignedSalaryStructure";


type Props = {
  employee: any;
  onBack: () => void;
  onDocumentUploaded: () => Promise<void>;
};

const getFileUrl = (file?: string | null) => {
  if (!file) return null;
  return `${ERP_BASE}${file}`;
};

// Document Upload Modal Component
const DocumentUploadModal: React.FC<{
  onClose: () => void;
  onUpload: (payload: { description: string; file: File }) => Promise<void>;
}> = ({ onClose, onUpload }) => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (!description || !file) return;

  try {
    setLoading(true);
    await onUpload({ description, file });
    onClose();
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-card w-full max-w-md rounded-xl shadow-xl">
        <div className="flex justify-between items-center px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-main">Upload Document</h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-muted hover:text-main" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted">
              Document Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-main"
              placeholder="e.g. NRC, Offer Letter"
            />
          </div>

          <label className="block">
            <div className="border-2 border-dashed border-border rounded-lg p-5 text-center cursor-pointer hover:border-primary transition">
              <Upload className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-xs text-muted">
                Click to upload or drag & drop
              </p>
              <p className="text-[11px] text-muted/70 mt-1">
                PDF, JPG, PNG (max 5MB)
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          {file && (
            <div className="flex items-center gap-2 text-xs bg-background border border-border rounded-lg px-3 py-2">
              <FileText className="w-4 h-4 text-muted" />
              <span className="truncate flex-1 text-main">{file.name}</span>
              <span className="text-muted">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border bg-background">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs border border-border rounded-lg hover:bg-row-hover"
          >
            Cancel
          </button>
          <button
            disabled={!description || !file || loading}
            onClick={handleSubmit}
            className="px-5 py-1.5 text-xs bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary/90"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployeeDetailView: React.FC<Props> = ({
  employee,
  onBack,
  onDocumentUploaded,
}) => {
  const [activeTab, setActiveTab] = useState<
    "personal" | "employment" | "compensation" | "documents"
  >("personal");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const {
    status,
    identityInfo,
    personalInfo,
    contactInfo,
    employmentInfo,
    payrollInfo,
    documents,
    leaveInfo,
  } = employee;

  const employeeCode = String(employee?.employeeId ?? employmentInfo?.employeeId ?? "").trim();

  const {
    assignedSalaryStructureName,
    assignedSalaryStructureFromDate,
    salaryStructureDetail,
  } = useAssignedSalaryStructure(employeeCode);

  const salaryBreakdownRows = useMemo(() => {
    const currency = String(payrollInfo?.currency ?? "ZMW").trim() || "ZMW";

    const earnings = Array.isArray(salaryStructureDetail?.earnings) ? salaryStructureDetail.earnings : [];
    if (earnings.length > 0) {
      return earnings
        .map((e: any) => ({
          label: String(e?.component ?? "").trim(),
          amount: e?.amount,
          currency,
        }))
        .filter((r: any) => r.label && r.amount !== undefined && r.amount !== null);
    }

    const breakdown = payrollInfo?.salaryBreakdown || {};
    return Object.entries(breakdown).map(([k, v]) => ({
      label: String(k),
      amount: v,
      currency,
    }));
  }, [payrollInfo?.currency, payrollInfo?.salaryBreakdown, salaryStructureDetail]);

  const compensationHeader = useMemo(() => {
    const currency = String(payrollInfo?.currency ?? "ZMW").trim() || "ZMW";
    const structureName = String(assignedSalaryStructureName ?? "").trim();
    const fromDate = String(assignedSalaryStructureFromDate ?? "").trim();

    const earnings = Array.isArray((salaryStructureDetail as any)?.earnings)
      ? (salaryStructureDetail as any).earnings
      : [];
    const deductions = Array.isArray((salaryStructureDetail as any)?.deductions)
      ? (salaryStructureDetail as any).deductions
      : [];
    const totalEarnings = earnings.reduce((s: number, r: any) => s + Number(r?.amount ?? 0), 0);
    const totalDeductions = deductions.reduce((s: number, r: any) => s + Number(r?.amount ?? 0), 0);
    const net = totalEarnings - totalDeductions;

    return {
      currency,
      structureName,
      fromDate,
      totalEarnings,
      totalDeductions,
      net,
    };
  }, [assignedSalaryStructureFromDate, assignedSalaryStructureName, payrollInfo?.currency, salaryStructureDetail]);

  const statutoryCalc = useMemo(() => {
    const grossFromEmployee = Number(payrollInfo?.grossSalary ?? 0) || 0;
    const earnings = Array.isArray((salaryStructureDetail as any)?.earnings)
      ? (salaryStructureDetail as any).earnings
      : [];
    const grossFromStructure = earnings.reduce((s: number, r: any) => s + Number(r?.amount ?? 0), 0);

    const gross = grossFromStructure > 0 ? grossFromStructure : grossFromEmployee;
    const rates = {
      napsaEmployeeRate: payrollInfo?.statutoryDeductions?.napsaEmployeeRate,
      napsaEmployerRate: payrollInfo?.statutoryDeductions?.napsaEmployerRate,
      nhimaRate: payrollInfo?.statutoryDeductions?.nhimaRate,
    };

    return calculateZmPayrollFromGross(gross, { rates });
  }, [payrollInfo?.grossSalary, payrollInfo?.statutoryDeductions, salaryStructureDetail]);

  const getStatusBadge = () => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "active")
      return "bg-green-100 text-green-700 border-green-300";
    return "bg-gray-100 text-gray-600 border-gray-300";
  };

const handleUploadDocument = async ({
  description,
  file,
}: {
  description: string;
  file: File;
}) => {
  try {
    showLoading("Uploading Document...");

    const formData = new FormData();
    formData.append("employeeId", employee.id);
    formData.append("name[0]", description);
    formData.append("description[0]", description);
    formData.append("file[0]", file);
    formData.append("isUpdate", "1");
    formData.append("isDelete", "0");

    await updateEmployeeDocuments(formData);

    await onDocumentUploaded();

    closeSwal();
    showSuccess("Document uploaded successfully");
  } catch (error) {
    closeSwal();
    showApiError(error);
  }
};


  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <div className="bg-card border-b border-border px-6 py-3">
        <button
          onClick={onBack}
          className="text-sm text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-2 mb-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white text-lg font-bold">
              {personalInfo?.FirstName?.[0]}
              {personalInfo?.LastName?.[0]}
            </div>
            <div>
              <h1 className="text-lg font-bold text-main">
                {personalInfo?.FirstName} {personalInfo?.LastName}
              </h1>
              <p className="text-muted text-xs">
                {employmentInfo?.JobTitle} • {employmentInfo?.Department}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge()}`}
          >
            {status}
          </div>
        </div>
      </div>

      {/* L-Shaped Layout - More Compact */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT SIDEBAR - Compact ID Card */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-card rounded-lg shadow border border-border overflow-hidden sticky top-4">
              {/* Compact Header */}
              <div className="bg-gradient-to-br from-primary to-primary/90 px-4 py-5 text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-primary text-xl font-bold shadow-lg mb-2 ring-2 ring-white/30">
                  {personalInfo?.FirstName?.[0]}
                  {personalInfo?.LastName?.[0]}
                </div>
                <h3 className="text-black text-sm font-bold">
                  {personalInfo?.FirstName} {personalInfo?.LastName}
                </h3>
                <p className="text-black text-xs">{employmentInfo?.JobTitle}</p>
              </div>

              {/* Employee ID */}
              <div className="px-4 py-2 border-b border-border text-center">
                <p className="text-[10px] text-black font-bold uppercase mb-0.5">
                  Employee ID
                </p>
                <p className="text-sm font-mono font-bold text-black">
                  {employeeCode || employmentInfo?.employeeId || employee?.employeeId || employee?.id || "—"}
                </p>
              </div>

              {/* Quick Info - Compact */}
              <div className="px-4 py-3 space-y-2.5">
                <QuickInfo
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={contactInfo?.workEmail}
                />
                <QuickInfo
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone"
                  value={contactInfo?.phoneNumber}
                />
                <QuickInfo
                  icon={<MapPin className="w-4 h-4" />}
                  label="Location"
                  value={employmentInfo?.workLocation}
                />
                <QuickInfo
                  icon={<Calendar className="w-4 h-4" />}
                  label="Joined"
                  value={employmentInfo?.joiningDate}
                />
              </div>

              {/* Compact Salary */}
              <div className="px-4 pb-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-1.5 mb-1">
                    <DollarSign className="w-3 h-3 text-green-600" />
                    <p className="text-[10px] text-green-700 dark:text-green-400 font-bold uppercase">
                      Gross Salary
                    </p>
                  </div>
                  <p className="text-xl font-bold text-green-900 dark:text-green-100">
                    {payrollInfo?.currency}{" "}
                    {Number(payrollInfo?.grossSalary || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-green-700 dark:text-green-400">
                    {payrollInfo?.paymentFrequency}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - Tabbed */}
          <div className="col-span-12 lg:col-span-9">
            {/* Compact Tabs */}
            <div className="bg-card rounded-t-lg border border-border border-b-0 px-4 pt-3 flex gap-1 overflow-x-auto">
              {[
                {
                  id: "personal",
                  label: "Personal",
                  icon: <FileText className="w-3.5 h-3.5" />,
                },
                {
                  id: "employment",
                  label: "Employment",
                  icon: <Briefcase className="w-3.5 h-3.5" />,
                },
                {
                  id: "compensation",
                  label: "Compensation",
                  icon: <DollarSign className="w-3.5 h-3.5" />,
                },
                {
                  id: "documents",
                  label: "Documents",
                  icon: <FileText className="w-3.5 h-3.5" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all inline-flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-background text-primary border-t-2 border-x-2 border-primary -mb-[2px]"
                      : "text-muted hover:text-main"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content - Compact */}
            <div className="bg-card rounded-b-lg rounded-tr-lg border border-border shadow">
              <div
                className="p-5"
                style={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}
              >
                {/* PERSONAL TAB */}
                {activeTab === "personal" && (
                  <div className="space-y-5">
                    <Section title="Personal Information">
                      <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                        <InfoField
                          label="Full Name"
                          value={`${personalInfo?.FirstName} ${personalInfo?.OtherNames || ""} ${personalInfo?.LastName}`}
                          className="col-span-2"
                        />
                        <InfoField
                          label="Gender"
                          value={personalInfo?.Gender}
                        />
                        <InfoField
                          label="Date of Birth"
                          value={personalInfo?.Dob}
                        />
                        <InfoField
                          label="Marital Status"
                          value={personalInfo?.maritalStatus}
                        />
                        <InfoField
                          label="Nationality"
                          value={personalInfo?.Nationality}
                        />
                      </div>
                    </Section>

                    <Section title="Contact Information">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <InfoField
                          label="Personal Email"
                          value={contactInfo?.Email}
                        />
                        <InfoField
                          label="Work Email"
                          value={contactInfo?.workEmail}
                        />
                        <InfoField
                          label="Phone"
                          value={contactInfo?.phoneNumber}
                        />
                        <InfoField
                          label="Alt. Phone"
                          value={contactInfo?.alternatePhone}
                        />
                        <InfoField
                          label="Address"
                          value={`${contactInfo?.address?.street}, ${contactInfo?.address?.city}`}
                          className="col-span-2"
                        />
                      </div>
                    </Section>

                    <Section title="Emergency Contact">
                      <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                        <InfoField
                          label="Name"
                          value={contactInfo?.emergencyContact?.name}
                        />
                        <InfoField
                          label="Relationship"
                          value={contactInfo?.emergencyContact?.relationship}
                        />
                        <InfoField
                          label="Phone"
                          value={contactInfo?.emergencyContact?.phone}
                        />
                      </div>
                    </Section>

                    <Section title="Compliance IDs">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <InfoField label="NRC ID" value={identityInfo?.NrcId} />
                        <InfoField label="TPIN" value={identityInfo?.TpinId} />
                        <InfoField
                          label="NAPSA"
                          value={identityInfo?.SocialSecurityNapsa}
                        />
                        <InfoField
                          label="NHIMA"
                          value={identityInfo?.NhimaHealthInsurance}
                        />
                      </div>
                    </Section>
                  </div>
                )}

                {/* EMPLOYMENT TAB */}
                {activeTab === "employment" && (
                  <div className="space-y-5">
                    <Section title="Employment Details">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <InfoField
                          label="Employee Type"
                          value={employmentInfo?.EmployeeType}
                        />
                        <InfoField
                          label="Manager"
                          value={employmentInfo?.reportingManager}
                        />
                        <InfoField
                          label="Joining Date"
                          value={employmentInfo?.joiningDate}
                        />
                        <InfoField
                          label="Probation"
                          value={employmentInfo?.probationPeriod}
                        />
                        <InfoField
                          label="Contract End"
                          value={employmentInfo?.contractEndDate}
                        />
                        <InfoField
                          label="Shift"
                          value={employmentInfo?.shift}
                        />
                        <InfoField
                          label="Work Address"
                          value={employmentInfo?.workAddress}
                          className="col-span-2"
                        />
                      </div>
                    </Section>

                    {employmentInfo?.weeklySchedule && (
                      <Section title="Weekly Schedule">
                        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                          <InfoField
                            label="Mon"
                            value={employmentInfo.weeklySchedule.monday || "—"}
                          />
                          <InfoField
                            label="Tue"
                            value={employmentInfo.weeklySchedule.tuesday || "—"}
                          />
                          <InfoField
                            label="Wed"
                            value={
                              employmentInfo.weeklySchedule.wednesday || "—"
                            }
                          />
                          <InfoField
                            label="Thu"
                            value={
                              employmentInfo.weeklySchedule.thursday || "—"
                            }
                          />
                          <InfoField
                            label="Fri"
                            value={employmentInfo.weeklySchedule.friday || "—"}
                          />
                          <InfoField
                            label="Sat"
                            value={
                              employmentInfo.weeklySchedule.saturday || "—"
                            }
                          />
                          <InfoField
                            label="Sun"
                            value={employmentInfo.weeklySchedule.sunday || "—"}
                          />
                        </div>
                      </Section>
                    )}

                    {leaveInfo && (
                      <Section title="Leave Setup">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          <InfoField
                            label="Opening Balance"
                            value={leaveInfo?.openingLeaveBalance}
                            className="col-span-2"
                          />
                          <InfoField
                            label="Monthly Rate"
                            value={`${leaveInfo?.initialLeaveRateMonthly} days/month`}
                          />
                          <InfoField
                            label="Ceiling"
                            value={`${leaveInfo?.ceilingAmount} days (${leaveInfo?.ceilingYear})`}
                          />
                        </div>
                      </Section>
                    )}
                  </div>
                )}

                {/* COMPENSATION TAB */}
                {activeTab === "compensation" && (
                  <div className="space-y-5">
                    <div className="bg-background border border-border rounded-xl px-4 py-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">
                            Assigned Salary Structure
                          </div>
                          <div className="text-sm font-extrabold text-main mt-1 break-words">
                            {compensationHeader.structureName || "—"}
                          </div>
                          {compensationHeader.fromDate ? (
                            <div className="text-[11px] text-muted mt-0.5">
                              Effective from: {compensationHeader.fromDate}
                            </div>
                          ) : null}
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Gross</div>
                          <div className="text-sm font-extrabold text-main tabular-nums">
                            {compensationHeader.currency} {Number(compensationHeader.totalEarnings || 0).toLocaleString()}
                          </div>
                          <div className="text-[11px] text-muted mt-0.5">
                            Net: {compensationHeader.currency} {Number(compensationHeader.net || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Section title="Salary Breakdown">
                      <div className="space-y-2">
                        {salaryBreakdownRows.map((row: any) => (
                            <div
                              key={row.label}
                              className="flex justify-between items-center py-1.5 border-b border-border"
                            >
                              <span className="text-xs text-muted font-medium">
                                {row.label}
                              </span>
                              <span className="text-xs font-bold text-main">
                                {row.currency}{" "}
                                {Number(row.amount ?? 0).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        <div className="flex justify-between items-center py-2 bg-background rounded-lg px-3 mt-2">
                          <span className="text-sm text-main font-bold">
                            Gross Salary
                          </span>
                          <span className="text-base font-bold text-primary">
                            {payrollInfo?.currency}{" "}
                            {Number(
                              payrollInfo?.grossSalary || 0,
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Section>

                    {Array.isArray((salaryStructureDetail as any)?.deductions) && (salaryStructureDetail as any).deductions.length > 0 && (
                      <Section title="Salary Structure Deductions">
                        <div className="space-y-2">
                          {(salaryStructureDetail as any).deductions
                            .map((d: any) => ({
                              label: (() => {
                                const component = String(d?.component ?? "").trim();
                                const abbr = String(d?.abbr ?? "").trim();
                                if (component.toLowerCase() === "income tax" || abbr.toUpperCase() === "IT") return "PAYE";
                                return component;
                              })(),
                              amount: d?.amount,
                            }))
                            .filter((d: any) => d.label)
                            .map((d: any) => (
                              <div
                                key={d.label}
                                className="flex justify-between items-center py-1.5 border-b border-border"
                              >
                                <span className="text-xs text-muted font-medium">{d.label}</span>
                                <span className="text-xs font-bold text-main">
                                  {payrollInfo?.currency || "ZMW"}{" "}
                                  {Number(d.amount ?? 0).toLocaleString()}
                                </span>
                              </div>
                            ))}
                        </div>
                      </Section>
                    )}

                    {Array.isArray((salaryStructureDetail as any)?.deductions) && (salaryStructureDetail as any).deductions.length > 0 ? null : (
                      <Section title="Statutory Deductions">
                        <div className="space-y-2">
                          <DeductionRow
                            label="NAPSA (Employee)"
                            value={`${Number(statutoryCalc?.rates?.napsaEmployeeRate ?? 0)}% • ${payrollInfo?.currency || "ZMW"} ${Number(statutoryCalc?.statutory?.napsaEmployee ?? 0).toLocaleString()}`}
                          />
                          <DeductionRow
                            label="NAPSA (Employer)"
                            value={`${Number(statutoryCalc?.rates?.napsaEmployerRate ?? 0)}% • ${payrollInfo?.currency || "ZMW"} ${Number(statutoryCalc?.statutory?.napsaEmployer ?? 0).toLocaleString()}`}
                          />
                          <DeductionRow
                            label="NHIMA"
                            value={`${Number(statutoryCalc?.rates?.nhimaRate ?? 0)}% • ${payrollInfo?.currency || "ZMW"} ${Number(statutoryCalc?.statutory?.nhima ?? 0).toLocaleString()}`}
                          />
                          <DeductionRow
                            label="PAYE"
                            value={`${payrollInfo?.currency || "ZMW"} ${Number(statutoryCalc?.statutory?.paye ?? 0).toLocaleString()}`}
                          />
                        </div>
                      </Section>
                    )}

                    <Section title="Bank Account">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <InfoField
                          label="Account Name"
                          value={payrollInfo?.bankAccount?.AccountName}
                        />
                        <InfoField
                          label="Account Number"
                          value={payrollInfo?.bankAccount?.AccountNumber}
                        />
                        <InfoField
                          label="Bank Name"
                          value={payrollInfo?.bankAccount?.BankName}
                        />
                        <InfoField
                          label="Branch Code"
                          value={payrollInfo?.bankAccount?.branchCode}
                        />
                        <InfoField
                          label="Account Type"
                          value={payrollInfo?.bankAccount?.AccountType}
                        />
                      </div>
                    </Section>
                  </div>
                )}

                {/* DOCUMENTS TAB */}
                {activeTab === "documents" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-main uppercase tracking-wider">
                        Documents
                      </h3>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                      </button>
                    </div>

                    {documents && documents.length > 0 ? (
                      <div className="space-y-2">
                        {documents.map((doc: any) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-background transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                📄
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-main truncate">
                                  {doc.description}
                                </p>
                                <p className="text-[10px] text-muted">
                                  PDF Document
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 ml-3">
                              {doc.file ? (
                                <>
                                  <button
                                    onClick={() => {
                                      const url = getFileUrl(doc.file) || undefined;
                                      if (!url) return;
                                      window.open(url, "_blank");
                                    }}
                                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                                    title="View"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <a
                                    href={getFileUrl(doc.file) || undefined}
                                    download
                                    className="p-2 text-muted hover:text-main hover:bg-row-hover rounded-lg transition"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </>
                              ) : (
                                <span className="text-[10px] text-muted italic">
                                  No file
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/5 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-muted/40" />
                        </div>
                        <p className="text-muted text-xs font-semibold mb-1">
                          No documents uploaded
                        </p>
                        <p className="text-muted/70 text-[10px]">
                          Click upload to add documents
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <DocumentUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadDocument}
        />
      )}
    </div>
  );
};

// Helper Components
const QuickInfo = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-2">
    <div className="text-primary mt-0.5 flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-muted font-semibold mb-0.5">{label}</p>
      <p className="text-xs text-main font-medium truncate">{value || "—"}</p>
    </div>
  </div>
);

const Section = ({ title, children }: any) => (
  <div>
    <h3 className="text-xs font-bold text-main uppercase tracking-wider mb-3 pb-2 border-b border-border">
      {title}
    </h3>
    {children}
  </div>
);

const InfoField = ({ label, value, className = "" }: any) => (
  <div className={className}>
    <p className="text-[10px] text-muted font-semibold mb-0.5 uppercase tracking-wide">
      {label}
    </p>
    <p className="text-xs font-semibold text-main">{value || "—"}</p>
  </div>
);

const DeductionRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center py-1.5 border-b border-border">
    <span className="text-xs text-muted font-medium">{label}</span>
    <span className="text-xs font-bold text-red-600 dark:text-red-400">
      {value}
    </span>
  </div>
);

export default EmployeeDetailView;
