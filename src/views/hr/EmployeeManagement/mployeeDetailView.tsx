import React, { useState } from "react";
import type { Employee } from "../../../types/employee";
import StatusBadge from "../../../components/ui/Table/StatusBadge";
import {

  Eye,
  Download,

} from "lucide-react";

type Props = {
  employee: Employee;
  onBack: () => void;
};
const FILE_BASE_URL = "http://41.60.191.7:8081";
const getFileUrl = (file?: string | null) => {
  if (!file) return null;
  return `${FILE_BASE_URL}${file}`;
};


const EmployeeDetailView: React.FC<Props> = ({ employee, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents'>('overview');
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    employment: true,
    payroll: true,
    compliance: true,
    bank: true,
  });
  
  const {
    status,
    identityInfo,
    personalInfo,
    contactInfo,
    employmentInfo,
    payrollInfo,
    documents,
  } = employee;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };



  const handleUploadDocument = () => {
    console.log("Upload new document");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-6 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-sm text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-2 transition-colors group mb-6"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Employees
        </button>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-white shadow-md'
                : 'bg-card text-muted hover:text-main border border-border'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all inline-flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'bg-primary text-white shadow-md'
                : 'bg-card text-muted hover:text-main border border-border'
            }`}
          >
            Documents
            {documents && documents.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'documents' ? 'bg-white/20' : 'bg-primary/10 text-primary'
              }`}>
                {documents.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - ID Card Style Profile */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden sticky top-6">
                {/* Card Header with Gradient */}
                <div className="h-32 bg-gradient-to-br from-primary via-primary to-primary/80 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <StatusBadge status={status} />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6 relative">
                  {/* Avatar */}
                  <div className="relative -mt-16 mb-4">
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-card">
                      {personalInfo.FirstName[0]}{personalInfo.LastName[0]}
                    </div>
                    {status.toLowerCase() === 'active' && (
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-card rounded-full"></div>
                    )}
                  </div>

                  {/* Name */}
                  <h2 className="text-xl font-bold text-main mb-1">
                    {personalInfo.FirstName} {personalInfo.LastName}
                  </h2>
                  <p className="text-sm text-muted mb-1">{employmentInfo.JobTitle}</p>
                  <p className="text-xs text-muted mb-4">{employmentInfo.Department}</p>

                  {/* ID Badge */}
                  <div className="bg-background rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted font-semibold uppercase">Employee ID</span>
                      <span className="text-sm font-bold text-main font-mono">{employmentInfo.employeeId}</span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-muted truncate">{contactInfo.workEmail}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-muted">{contactInfo.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-muted">{employmentInfo.workLocation}</span>
                    </div>
                  </div>

                  {/* Salary Highlight */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <p className="text-xs text-green-700 dark:text-green-400 font-bold uppercase tracking-wide mb-1">Gross Salary</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {payrollInfo.currency} {Number(payrollInfo.grossSalary).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">{payrollInfo.paymentFrequency}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Detailed Info Sections */}
            <div className="lg:col-span-2 space-y-4">
              {/* Personal & Contact Section */}
              <CollapsibleSection
                title="Personal & Contact Information"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                isExpanded={expandedSections.personal}
                onToggle={() => toggleSection('personal')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <InfoField label="Gender" value={personalInfo.Gender} />
                  <InfoField label="Date of Birth" value={personalInfo.Dob} />
                  <InfoField label="Marital Status" value={personalInfo.maritalStatus} />
                  <InfoField label="Nationality" value={personalInfo.Nationality} />
                  <InfoField label="Personal Email" value={contactInfo.Email} />
                  <InfoField label="Work Email" value={contactInfo.workEmail} />
                  <InfoField label="Phone" value={contactInfo.phoneNumber} />
                  <InfoField label="Alt. Phone" value={contactInfo.alternatePhone} />
                  <InfoField 
                    label="Address" 
                    value={`${contactInfo.address.street}, ${contactInfo.address.city}`}
                    className="md:col-span-2"
                  />
                </div>
                
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Emergency Contact</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    <InfoField label="Name" value={contactInfo.emergencyContact.name} />
                    <InfoField label="Relationship" value={contactInfo.emergencyContact.relationship} />
                    <InfoField label="Phone" value={contactInfo.emergencyContact.phone} />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Employment Section */}
              <CollapsibleSection
                title="Employment Details"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                isExpanded={expandedSections.employment}
                onToggle={() => toggleSection('employment')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <InfoField label="Employee Type" value={employmentInfo.EmployeeType} />
                  <InfoField label="Reporting Manager" value={employmentInfo.reportingManager} />
                  <InfoField label="Joining Date" value={employmentInfo.joiningDate} />
                  <InfoField label="Probation Period" value={employmentInfo.probationPeriod} />
                  <InfoField label="Contract End" value={employmentInfo.contractEndDate} />
                  <InfoField label="Shift" value={employmentInfo.shift} />
                  <InfoField label="Work Address" value={employmentInfo.workAddress} className="md:col-span-2" />
                </div>
              </CollapsibleSection>

              {/* Payroll Section */}
              <CollapsibleSection
                title="Salary & Deductions"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                isExpanded={expandedSections.payroll}
                onToggle={() => toggleSection('payroll')}
              >
                <div className="space-y-3 mb-5">
                  {Object.entries(payrollInfo.salaryBreakdown).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted font-medium">{k}</span>
                      <span className="text-sm font-bold text-main">
                        {payrollInfo.currency} {Number(v).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Statutory Deductions</p>
                  <div className="space-y-2">
                    <DeductionRow label="NAPSA (Employee)" value={`${payrollInfo.statutoryDeductions.napsaEmployeeRate}%`} />
                    <DeductionRow label="NAPSA (Employer)" value={`${payrollInfo.statutoryDeductions.napsaEmployerRate}%`} />
                    <DeductionRow label="NHIMA" value={`${payrollInfo.statutoryDeductions.nhimaRate}%`} />
                    <DeductionRow label="PAYE" value={`${payrollInfo.currency} ${Number(payrollInfo.statutoryDeductions.payeAmount).toLocaleString()}`} />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Compliance & Bank Combined */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CollapsibleSection
                  title="Compliance IDs"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  isExpanded={expandedSections.compliance}
                  onToggle={() => toggleSection('compliance')}
                >
                  <div className="space-y-3">
                    <CompactField label="NRC ID" value={identityInfo.NrcId} />
                    <CompactField label="TPIN" value={identityInfo.TpinId} />
                    <CompactField label="NAPSA" value={identityInfo.SocialSecurityNapsa} />
                    <CompactField label="NHIMA" value={identityInfo.NhimaHealthInsurance} />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Bank Account"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  }
                  isExpanded={expandedSections.bank}
                  onToggle={() => toggleSection('bank')}
                >
                  <div className="space-y-3">
                    <CompactField label="Account Name" value={payrollInfo.bankAccount.AccountName} />
                    <CompactField label="Account Number" value={payrollInfo.bankAccount.AccountNumber} />
                    <CompactField label="Bank Name" value={payrollInfo.bankAccount.BankName} />
                    <CompactField label="Branch Code" value={payrollInfo.bankAccount.branchCode} />
                    <CompactField label="Account Type" value={payrollInfo.bankAccount.AccountType} />
                  </div>
                </CollapsibleSection>
              </div>
            </div>
          </div>
        ) : (
          /* Documents Section */
          <div className="bg-card rounded-xl shadow-md border border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-main uppercase tracking-wider">
                  Employee Documents
                </h3>
                <button 
                  onClick={handleUploadDocument}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {documents && documents.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {documents.map((doc) => {


  return (
    <div key={doc.id} className="group flex items-center justify-between p-4 border rounded-xl">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
          📄
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold">
            {doc.description}
          </p>
          <p className="text-xs text-muted">
            PDF Document
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
  {doc.file ? (
    <>
      {/* VIEW */}
      <button
        onClick={() => window.open(getFileUrl(doc.file), "_blank")}
        className="p-2.5 text-primary hover:bg-primary/10 rounded-lg transition"
        title="View document"
      >
        <Eye className="w-5 h-5" />
      </button>

      {/* DOWNLOAD */}
      <a
        href={getFileUrl(doc.file)}
        download
        className="p-2.5 text-muted hover:text-main hover:bg-row-hover rounded-lg transition"
        title="Download document"
      >
        <Download className="w-5 h-5" />
      </a>
    </>
  ) : (
    <span className="text-xs text-muted italic">No file</span>
  )}
</div>

    </div>
  );
})}

                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center">
                    <svg className="w-10 h-10 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-muted text-sm font-semibold mb-1">No documents uploaded yet</p>
                  <p className="text-muted/70 text-xs">Upload employee documents to get started</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* Collapsible Section Component */
const CollapsibleSection = ({ title, icon, children, isExpanded, onToggle }: any) => (
  <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between hover:bg-row-hover transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <h3 className="text-sm font-bold text-main uppercase tracking-wider">{title}</h3>
      </div>
      <svg
        className={`w-5 h-5 text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isExpanded && (
      <div className="px-6 pb-6 border-t border-border">
        <div className="pt-5">{children}</div>
      </div>
    )}
  </div>
);

/* Field Components */
const InfoField = ({ label, value, className = "" }: any) => (
  <div className={className}>
    <p className="text-xs text-muted font-semibold mb-1 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-main">{value || "—"}</p>
  </div>
);

const CompactField = ({ label, value }: any) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-xs text-muted font-semibold uppercase tracking-wide">{label}</span>
    <span className="text-sm font-bold text-main text-right">{value || "—"}</span>
  </div>
);

const DeductionRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm text-muted font-medium">{label}</span>
    <span className="text-sm font-bold text-red-600 dark:text-red-400">{value}</span>
  </div>
);

export default EmployeeDetailView;