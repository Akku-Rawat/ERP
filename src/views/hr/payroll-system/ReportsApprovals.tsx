// ReportsApprovals.tsx - Reports and Approval Workflow Components

import React, { useState } from "react";
import {
  Download,
  BarChart3,
  Check,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { PayrollRecord } from "./types";
import { generateNEFTFile, compareTaxRegimes } from "./utils";

interface PayrollReportsProps {
  records: PayrollRecord[];
}

export const PayrollReports: React.FC<PayrollReportsProps> = ({ records }) => {
  const [reportType, setReportType] = useState<
    "summary" | "department" | "tax" | "compliance"
  >("summary");

  const paidRecords = records.filter((r) => r.status === "Paid");

  const summaryData = {
    totalEmployees: paidRecords.length,
    totalGross: paidRecords.reduce((sum, r) => sum + r.grossPay, 0),
    totalDeductions: paidRecords.reduce((sum, r) => sum + r.totalDeductions, 0),
    totalNet: paidRecords.reduce((sum, r) => sum + r.netPay, 0),
    totalTax: paidRecords.reduce((sum, r) => sum + r.taxDeduction, 0),
    totalPF: paidRecords.reduce((sum, r) => sum + r.pfDeduction, 0),
    totalESI: paidRecords.reduce((sum, r) => sum + r.esiDeduction, 0),
  };

  const departmentData = Object.values(
    paidRecords.reduce(
      (acc, r) => {
        if (!acc[r.department]) {
          acc[r.department] = {
            department: r.department,
            count: 0,
            gross: 0,
            net: 0,
          };
        }
        acc[r.department].count++;
        acc[r.department].gross += r.grossPay;
        acc[r.department].net += r.netPay;
        return acc;
      },
      {} as Record<string, any>,
    ),
  );

  const handleDownloadNEFT = () => {
    const neftContent = generateNEFTFile(paidRecords);
    const blob = new Blob([neftContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NEFT_Payroll_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = (type: string) => {
    alert(`Downloading ${type} report...`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          Payroll Reports
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadNEFT}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            NEFT File
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {["summary", "department", "tax", "compliance"].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type as any)}
            className={`px-4 py-2 font-medium capitalize transition-all ${
              reportType === type
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {reportType === "summary" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">
                Total Employees
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {summaryData.totalEmployees}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p className="text-xs text-green-700 font-medium mb-1">
                Gross Payout
              </p>
              <p className="text-3xl font-bold text-green-900">
                ₹{(summaryData.totalGross / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <p className="text-xs text-red-700 font-medium mb-1">
                Total Deductions
              </p>
              <p className="text-3xl font-bold text-red-900">
                ₹{(summaryData.totalDeductions / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <p className="text-xs text-purple-700 font-medium mb-1">
                Net Payout
              </p>
              <p className="text-3xl font-bold text-purple-900">
                ₹{(summaryData.totalNet / 1000).toFixed(0)}K
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-3">
              Statutory Deductions
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Income Tax:</span>
                <span className="font-bold text-slate-800">
                  ₹{summaryData.totalTax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Provident Fund:</span>
                <span className="font-bold text-slate-800">
                  ₹{summaryData.totalPF.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">ESI:</span>
                <span className="font-bold text-slate-800">
                  ₹{summaryData.totalESI.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleDownloadReport("Summary")}
            className="w-full px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Summary Report
          </button>
        </div>
      )}

      {reportType === "department" && (
        <div className="space-y-4">
          {departmentData.map((dept: any) => (
            <div
              key={dept.department}
              className="border border-slate-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-800">{dept.department}</h4>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium">
                  {dept.count} employees
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded p-3">
                  <p className="text-xs text-slate-600 mb-1">Gross Pay</p>
                  <p className="text-xl font-bold text-green-700">
                    ₹{dept.gross.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-50 rounded p-3">
                  <p className="text-xs text-slate-600 mb-1">Net Pay</p>
                  <p className="text-xl font-bold text-blue-700">
                    ₹{dept.net.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 rounded p-3">
                  <p className="text-xs text-slate-600 mb-1">
                    Avg Per Employee
                  </p>
                  <p className="text-xl font-bold text-purple-700">
                    ₹{Math.round(dept.net / dept.count).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => handleDownloadReport("Department")}
            className="w-full px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Department Report
          </button>
        </div>
      )}

      {reportType === "tax" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
            <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Tax Regime Comparison
            </h4>
            <div className="space-y-4">
              {paidRecords.slice(0, 3).map((record) => {
                const comparison = compareTaxRegimes(
                  record.taxableIncome,
                  record.taxSavings,
                );
                return (
                  <div
                    key={record.id}
                    className="bg-white rounded-lg p-4 border border-amber-200"
                  >
                    <p className="font-semibold text-slate-800 mb-2">
                      {record.employeeName}
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-600">Old Regime</p>
                        <p className="font-bold text-slate-800">
                          ₹{comparison.oldRegime.toLocaleString()}/year
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">New Regime</p>
                        <p className="font-bold text-slate-800">
                          ₹{comparison.newRegime.toLocaleString()}/year
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Recommendation</p>
                        <p
                          className={`font-bold ${comparison.recommendation === "Old" ? "text-green-600" : "text-blue-600"}`}
                        >
                          {comparison.recommendation} (Save ₹
                          {comparison.savings.toLocaleString()})
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => handleDownloadReport("Tax")}
            className="w-full px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Tax Report
          </button>
        </div>
      )}

      {reportType === "compliance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">
                PF Compliance
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Employee Contribution:</span>
                  <span className="font-bold">
                    ₹{summaryData.totalPF.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Employer Contribution:</span>
                  <span className="font-bold">
                    ₹{summaryData.totalPF.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <span className="font-semibold text-blue-900">Total PF:</span>
                  <span className="font-bold text-blue-900">
                    ₹{(summaryData.totalPF * 2).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3">
                ESI Compliance
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Employee Contribution (0.75%):
                  </span>
                  <span className="font-bold">
                    ₹{summaryData.totalESI.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Employer Contribution (3.25%):
                  </span>
                  <span className="font-bold">
                    ₹{Math.round(summaryData.totalESI * 4.33).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-green-200">
                  <span className="font-semibold text-green-900">
                    Total ESI:
                  </span>
                  <span className="font-bold text-green-900">
                    ₹{Math.round(summaryData.totalESI * 5.33).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDownloadReport("Compliance")}
            className="w-full px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Compliance Report
          </button>
        </div>
      )}
    </div>
  );
};

interface ApprovalWorkflowManagerProps {
  records: PayrollRecord[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export const ApprovalWorkflowManager: React.FC<
  ApprovalWorkflowManagerProps
> = ({ records, onApprove, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const pendingRecords = records.filter((r) => r.status === "Pending");

  const handleReject = () => {
    if (!selectedRecord || !rejectionReason) {
      alert("Please provide a reason for rejection");
      return;
    }
    onReject(selectedRecord, rejectionReason);
    setSelectedRecord(null);
    setRejectionReason("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6 text-amber-600" />
        Approval Workflow
      </h3>

      {pendingRecords.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <Check className="w-12 h-12 mx-auto mb-2 text-green-500" />
          <p>No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRecords.map((record) => (
            <div
              key={record.id}
              className="border-2 border-amber-200 rounded-lg p-4 bg-amber-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-slate-800">
                      {record.employeeName}
                    </p>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      Pending Approval
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    {record.employeeId} • {record.department} •{" "}
                    {record.designation}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-slate-600">Gross Pay</p>
                      <p className="font-bold text-green-600">
                        ₹{record.grossPay.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-slate-600">Deductions</p>
                      <p className="font-bold text-red-600">
                        ₹{record.totalDeductions.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-slate-600">Net Pay</p>
                      <p className="font-bold text-blue-600">
                        ₹{record.netPay.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {selectedRecord === record.id && (
                    <div className="mt-3">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason for rejection..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        rows={2}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => onApprove(record.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  {selectedRecord === record.id ? (
                    <>
                      <button
                        onClick={handleReject}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                      >
                        <X className="w-4 h-4" />
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRecord(null);
                          setRejectionReason("");
                        }}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectedRecord(record.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
