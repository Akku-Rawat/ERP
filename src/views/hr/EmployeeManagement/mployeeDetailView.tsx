import React from "react";
import type { Employee } from "../../../types/employee";
import StatusBadge from "../../../components/ui/Table/StatusBadge";

type Props = {
  employee: Employee;
  onBack: () => void;
};

const EmployeeDetailView: React.FC<Props> = ({ employee, onBack }) => {
  const {
    status,
    identityInfo,
    personalInfo,
    contactInfo,
    employmentInfo,
    payrollInfo,
  } = employee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Compact Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-5">
          <button
            onClick={onBack}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-3 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold shadow">
                {personalInfo.FirstName[0]}{personalInfo.LastName[0]}
              </div>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {personalInfo.FirstName} {personalInfo.OtherNames} {personalInfo.LastName}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span>{employmentInfo.JobTitle}</span>
                  <span>•</span>
                  <span>{employmentInfo.Department}</span>
                  <span>•</span>
                  <span className="text-gray-500">ID: {employmentInfo.employeeId}</span>
                </div>
              </div>
            </div>
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Personal & Contact Combined */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b">
                Personal & Contact Information
              </h3>
              <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-sm">
                <Field label="Gender" value={personalInfo.Gender} />
                <Field label="Date of Birth" value={personalInfo.Dob} />
                <Field label="Marital Status" value={personalInfo.maritalStatus} />
                <Field label="Nationality" value={personalInfo.Nationality} />
                <Field label="Personal Email" value={contactInfo.Email} />
                <Field label="Work Email" value={contactInfo.workEmail} />
                <Field label="Phone" value={contactInfo.phoneNumber} />
                <Field label="Alt. Phone" value={contactInfo.alternatePhone} />
                <Field 
                  label="Address" 
                  value={`${contactInfo.address.street}, ${contactInfo.address.city}`}
                  className="col-span-1"
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Emergency Contact</p>
                <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
                  <Field label="Name" value={contactInfo.emergencyContact.name} compact />
                  <Field label="Relationship" value={contactInfo.emergencyContact.relationship} compact />
                  <Field label="Phone" value={contactInfo.emergencyContact.phone} compact />
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b">
                Employment Details
              </h3>
              <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-sm">
                <Field label="Employee Type" value={employmentInfo.EmployeeType} />
                <Field label="Reporting Manager" value={employmentInfo.reportingManager} />
                <Field label="Joining Date" value={employmentInfo.joiningDate} />
                <Field label="Probation Period" value={employmentInfo.probationPeriod} />
                <Field label="Contract End" value={employmentInfo.contractEndDate} />
                <Field label="Work Location" value={employmentInfo.workLocation} />
                <Field label="Shift" value={employmentInfo.shift} />
                <Field label="Work Address" value={employmentInfo.workAddress} className="col-span-2" />
              </div>
            </div>

            {/* Payroll Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b">
                Salary Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {Object.entries(payrollInfo.salaryBreakdown).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">{k}</span>
                    <span className="font-semibold text-gray-900">
                      {payrollInfo.currency} {Number(v).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Statutory Deductions</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <DeductionRow label="NAPSA (Employee)" value={`${payrollInfo.statutoryDeductions.napsaEmployeeRate}%`} />
                  <DeductionRow label="NAPSA (Employer)" value={`${payrollInfo.statutoryDeductions.napsaEmployerRate}%`} />
                  <DeductionRow label="NHIMA" value={`${payrollInfo.statutoryDeductions.nhimaRate}%`} />
                  <DeductionRow label="PAYE" value={`${payrollInfo.currency} ${Number(payrollInfo.statutoryDeductions.payeAmount).toLocaleString()}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-5">
            
            {/* Compliance IDs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b">
                Compliance IDs
              </h3>
              <div className="space-y-2.5 text-sm">
                <CompactField label="NRC ID" value={identityInfo.NrcId} />
                <CompactField label="TPIN" value={identityInfo.TpinId} />
                <CompactField label="NAPSA" value={identityInfo.SocialSecurityNapsa} />
                <CompactField label="NHIMA" value={identityInfo.NhimaHealthInsurance} />
              </div>
            </div>

            {/* Payroll Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b">
                Payroll Summary
              </h3>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 mb-3">
                <p className="text-xs text-green-700 font-medium">Gross Salary</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {payrollInfo.currency} {Number(payrollInfo.grossSalary).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency</span>
                  <span className="font-medium text-gray-900">{payrollInfo.paymentFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium text-gray-900">{payrollInfo.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b">
                Bank Account
              </h3>
              <div className="space-y-2.5 text-sm">
                <CompactField label="Account Name" value={payrollInfo.bankAccount.AccountName} />
                <CompactField label="Account Number" value={payrollInfo.bankAccount.AccountNumber} />
                <CompactField label="Bank Name" value={payrollInfo.bankAccount.BankName} />
                <CompactField label="Branch Code" value={payrollInfo.bankAccount.branchCode} />
                <CompactField label="Account Type" value={payrollInfo.bankAccount.AccountType} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Compact Components ---------- */

const Field = ({ label, value, className = "", compact = false }: any) => (
  <div className={className}>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className={`font-medium text-gray-900 ${compact ? 'text-sm' : ''}`}>
      {value || "—"}
    </p>
  </div>
);

const CompactField = ({ label, value }: any) => (
  <div className="flex justify-between items-start py-1.5 border-b border-gray-100">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-semibold text-gray-900 text-right text-sm max-w-[60%] break-words">
      {value || "—"}
    </span>
  </div>
);

const DeductionRow = ({ label, value }: any) => (
  <div className="flex justify-between py-1.5 border-b border-gray-100">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-red-600">{value}</span>
  </div>
);

export default EmployeeDetailView;