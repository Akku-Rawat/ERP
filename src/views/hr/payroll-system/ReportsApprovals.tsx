
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
    <div className="bg-card rounded-xl shadow-sm border border-theme p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-main flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Payroll Reports
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadNEFT}
            className="px-4 py-2 bg-success text-white rounded-lg hover:bg-[var(--success)] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            NEFT File
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-theme">
        {["summary", "department", "tax", "compliance"].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type as any)}
            className={`px-4 py-2 font-medium capitalize transition-all ${
              reportType === type
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-main"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {reportType === "summary" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-info rounded-lg p-4 border border-theme">
              <p className="text-xs text-white font-medium mb-1">
                Total Employees
              </p>
              <p className="text-3xl font-bold text-white">
                {summaryData.totalEmployees}
              </p>
            </div>
            <div className="bg-success rounded-lg p-4 border border-theme">
              <p className="text-xs text-white font-medium mb-1">
                Gross Payout
              </p>
              <p className="text-3xl font-bold text-white">
                ₹{(summaryData.totalGross / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-danger rounded-lg p-4 border border-theme">
              <p className="text-xs text-white font-medium mb-1">
                Total Deductions
              </p>
              <p className="text-3xl font-bold text-white">
                ₹{(summaryData.totalDeductions / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-primary rounded-lg p-4 border border-theme">
              <p className="text-xs text-white font-medium mb-1">
                Net Payout
              </p>
              <p className="text-3xl font-bold text-white">
                ₹{(summaryData.totalNet / 1000).toFixed(0)}K
              </p>
            </div>
          </div>

          <div className="bg-app rounded-lg p-4 border border-theme">
            <h4 className="font-semibold text-main mb-3">
              Statutory Deductions
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Income Tax:</span>
                <span className="font-bold text-main">
                  ₹{summaryData.totalTax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Provident Fund:</span>
                <span className="font-bold text-main">
                  ₹{summaryData.totalPF.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">ESI:</span>
                <span className="font-bold text-main">
                  ₹{summaryData.totalESI.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleDownloadReport("Summary")}
            className="w-full px-4 py-2 border border-theme text-primary rounded-lg row-hover flex items-center justify-center gap-2"
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
              className="border border-theme rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-main">{dept.department}</h4>
                <span className="px-3 py-1 bg-app rounded-full text-sm font-medium">
                  {dept.count} employees
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-success rounded p-3">
                  <p className="text-xs text-white mb-1">Gross Pay</p>
                  <p className="text-xl font-bold text-white">
                    ₹{dept.gross.toLocaleString()}
                  </p>
                </div>
                <div className="bg-info rounded p-3">
                  <p className="text-xs text-white mb-1">Net Pay</p>
                  <p className="text-xl font-bold text-white">
                    ₹{dept.net.toLocaleString()}
                  </p>
                </div>
                <div className="bg-primary rounded p-3">
                  <p className="text-xs text-white mb-1">
                    Avg Per Employee
                  </p>
                  <p className="text-xl font-bold text-white">
                    ₹{Math.round(dept.net / dept.count).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => handleDownloadReport("Department")}
            className="w-full px-4 py-2 border border-theme text-primary rounded-lg row-hover flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Department Report
          </button>
        </div>
      )}

      {reportType === "tax" && (
        <div className="space-y-4">
          <div className="bg-warning rounded-lg p-6 border border-theme">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
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
                    className="bg-card rounded-lg p-4 border border-theme"
                  >
                    <p className="font-semibold text-main mb-2">
                      {record.employeeName}
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted">Old Regime</p>
                        <p className="font-bold text-main">
                          ₹{comparison.oldRegime.toLocaleString()}/year
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">New Regime</p>
                        <p className="font-bold text-main">
                          ₹{comparison.newRegime.toLocaleString()}/year
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Recommendation</p>
                        <p
                          className={`font-bold ${comparison.recommendation === "Old" ? "text-success" : "text-info"}`}
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
            className="w-full px-4 py-2 border border-theme text-primary rounded-lg row-hover flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Tax Report
          </button>
        </div>
      )}

      {reportType === "compliance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-info rounded-lg p-4 border border-theme">
              <h4 className="font-semibold text-white mb-3">
                PF Compliance
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white">Employee Contribution:</span>
                  <span className="font-bold text-white">
                    ₹{summaryData.totalPF.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Employer Contribution:</span>
                  <span className="font-bold text-white">
                    ₹{summaryData.totalPF.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-theme">
                  <span className="font-semibold text-white">Total PF:</span>
                  <span className="font-bold text-white">
                    ₹{(summaryData.totalPF * 2).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-success rounded-lg p-4 border border-theme">
              <h4 className="font-semibold text-white mb-3">
                ESI Compliance
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white">
                    Employee Contribution (0.75%):
                  </span>
                  <span className="font-bold text-white">
                    ₹{summaryData.totalESI.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">
                    Employer Contribution (3.25%):
                  </span>
                  <span className="font-bold text-white">
                    ₹{Math.round(summaryData.totalESI * 4.33).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-theme">
                  <span className="font-semibold text-white">
                    Total ESI:
                  </span>
                  <span className="font-bold text-white">
                    ₹{Math.round(summaryData.totalESI * 5.33).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDownloadReport("Compliance")}
            className="w-full px-4 py-2 border border-theme text-primary rounded-lg row-hover flex items-center justify-center gap-2"
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
    <div className="bg-card rounded-xl shadow-sm border border-theme p-6">
      <h3 className="text-xl font-bold text-main mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6 text-warning" />
        Approval Workflow
      </h3>

      {pendingRecords.length === 0 ? (
        <div className="text-center py-8 text-muted">
          <Check className="w-12 h-12 mx-auto mb-2 text-success" />
          <p>No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRecords.map((record) => (
            <div
              key={record.id}
              className="border-2 border-theme rounded-lg p-4 bg-warning"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-white">
                      {record.employeeName}
                    </p>
                    <span className="px-2 py-1 bg-card text-warning text-xs font-medium rounded-full">
                      Pending Approval
                    </span>
                  </div>
                  <p className="text-sm text-white mb-3">
                    {record.employeeId} • {record.department} •{" "}
                    {record.designation}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-card rounded p-2">
                      <p className="text-xs text-muted">Gross Pay</p>
                      <p className="font-bold text-success">
                        ₹{record.grossPay.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-card rounded p-2">
                      <p className="text-xs text-muted">Deductions</p>
                      <p className="font-bold text-danger">
                        ₹{record.totalDeductions.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-card rounded p-2">
                      <p className="text-xs text-muted">Net Pay</p>
                      <p className="font-bold text-info">
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
                        className="w-full px-3 py-2 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-danger text-sm bg-card text-main"
                        rows={2}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => onApprove(record.id)}
                    className="px-4 py-2 bg-success text-white rounded-lg hover:bg-[var(--success)] flex items-center gap-2 text-sm"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  {selectedRecord === record.id ? (
                    <>
                      <button
                        onClick={handleReject}
                        className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-[var(--danger)] flex items-center gap-2 text-sm"
                      >
                        <X className="w-4 h-4" />
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRecord(null);
                          setRejectionReason("");
                        }}
                        className="px-4 py-2 border border-theme text-main rounded-lg row-hover text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectedRecord(record.id)}
                      className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-[var(--danger)] flex items-center gap-2 text-sm"
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