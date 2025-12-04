import React, { useState, useMemo } from "react";
import type { PayrollRecord, Bonus } from "./payroll/types";
import { demoEmployees } from "./payroll/data";
import { generatePayrollRecord, exportToCSV } from "./payroll/utils";
import { KPICards } from "./payroll/KPICards";
import { FilterBar } from "./payroll/FilterBar";
import { PayrollTable } from "./payroll/PayrollTable";
import { CreatePayrollModal } from "../../components/Hr/payrollmodal/CreatePayrollModal";
import { PayslipModal } from "../../components/Hr/payrollmodal/PayslipModal";
import { ProcessingModal } from "../../components/Hr/payrollmodal/ProcessingModal";
import { AddBonusModal } from "../hr/payroll/AddBonusModal";

const initialPayrollRecords: PayrollRecord[] = [
  generatePayrollRecord(demoEmployees[0], "Paid"),
  generatePayrollRecord(demoEmployees[5], "Paid"),
];

export default function Payroll() {
  // State Management
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(
    initialPayrollRecords,
  );
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] =
    useState<PayrollRecord | null>(null);
  const [showPayslip, setShowPayslip] = useState(false);
  const [showCreatePayroll, setShowCreatePayroll] = useState(false);
  const [processingModal, setProcessingModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonusRecord, setBonusRecord] = useState<PayrollRecord | null>(null);

  // Computed Values
  const departments = useMemo(() => {
    const setDepts = new Set<string>();
    payrollRecords.forEach((r) => setDepts.add(r.department));
    return ["All Departments", ...Array.from(setDepts)];
  }, [payrollRecords]);

  const filteredRecords = useMemo(() => {
    return payrollRecords.filter((record) => {
      const byDept =
        selectedDept === "All Departments"
          ? true
          : record.department === selectedDept;
      const byStatus =
        filterStatus === "All" ? true : record.status === filterStatus;
      const bySearch =
        searchQuery === ""
          ? true
          : record.employeeName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      return byDept && byStatus && bySearch;
    });
  }, [payrollRecords, selectedDept, filterStatus, searchQuery]);

  const availableEmployees = useMemo(() => {
    const processedIds = payrollRecords
      .filter((r) => r.status === "Pending" || r.status === "Processing")
      .map((r) => r.employeeId);

    return demoEmployees
      .filter((emp) => emp.isActive && !processedIds.includes(emp.id))
      .filter((emp) => {
        if (!employeeSearch) return true;
        return (
          emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
          emp.id.toLowerCase().includes(employeeSearch.toLowerCase()) ||
          emp.department.toLowerCase().includes(employeeSearch.toLowerCase())
        );
      });
  }, [payrollRecords, employeeSearch]);

  const totalGrossPay = filteredRecords.reduce(
    (sum, record) => sum + record.grossPay,
    0,
  );
  const totalNetPay = filteredRecords.reduce(
    (sum, record) => sum + record.netPay,
    0,
  );
  const totalDeductions = totalGrossPay - totalNetPay;
  const pendingCount = payrollRecords.filter(
    (r) => r.status === "Pending",
  ).length;
  const paidCount = payrollRecords.filter((r) => r.status === "Paid").length;
  const pendingRecords = payrollRecords.filter((r) => r.status === "Pending");

  // Event Handlers
  const handleSelectAll = () => {
    if (selectedEmployees.length === availableEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(availableEmployees.map((e) => e.id));
    }
  };

  const handleSelectEmployee = (empId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId],
    );
  };

  const handleCreatePayroll = () => {
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee");
      return;
    }

    const newRecords = selectedEmployees.map((empId) => {
      const employee = demoEmployees.find((e) => e.id === empId)!;
      return generatePayrollRecord(employee, "Pending");
    });

    setPayrollRecords((prev) => [...prev, ...newRecords]);
    setSelectedEmployees([]);
    setShowCreatePayroll(false);
    setEmployeeSearch("");
  };

  const handleProcessPayroll = () => {
    setProcessingModal(true);
  };

  const confirmProcessPayroll = () => {
    setPayrollRecords((prev) =>
      prev.map((rec) => {
        if (rec.status === "Pending") {
          return { ...rec, status: "Processing" as const };
        }
        return rec;
      }),
    );

    setProcessingModal(false);

    setTimeout(() => {
      setPayrollRecords((prev) =>
        prev.map((rec) => {
          if (rec.status === "Processing") {
            return {
              ...rec,
              status: "Paid" as const,
              paymentDate: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }),
            };
          }
          return rec;
        }),
      );
    }, 2000);
  };

  const handleViewPayslip = (record: PayrollRecord) => {
    setSelectedEmployee(record);
    setShowPayslip(true);
  };

  const handleCloseCreatePayroll = () => {
    setShowCreatePayroll(false);
    setSelectedEmployees([]);
    setEmployeeSearch("");
  };
  const handleAddBonusClick = (record: PayrollRecord) => {
    setBonusRecord(record);
    setShowBonusModal(true);
  };

  const saveBonus = (bonus: Bonus) => {
    setPayrollRecords((prev) =>
      prev.map((r) =>
        r.employeeId === bonusRecord?.employeeId
          ? {
              ...r,
              bonuses: [...(r.bonuses || []), bonus],
              grossPay: r.grossPay + bonus.amount, // increase gross pay
              netPay: r.netPay + bonus.amount, // increase net pay
            }
          : r,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Cards */}
        <KPICards
          totalEmployees={payrollRecords.length}
          paidCount={paidCount}
          pendingCount={pendingCount}
          totalNetPay={totalNetPay}
        />

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          departments={departments}
          onCreatePayroll={() => setShowCreatePayroll(true)}
          onExport={() => exportToCSV(filteredRecords)}
          onProcessPayroll={handleProcessPayroll}
          pendingCount={pendingCount}
          hasRecords={filteredRecords.length > 0}
        />

        {/* Payroll Table */}
        <PayrollTable
          records={filteredRecords}
          onViewPayslip={handleViewPayslip}
          totalGrossPay={totalGrossPay}
          onAddBonus={handleAddBonusClick}
          totalDeductions={totalDeductions}
          totalNetPay={totalNetPay}
        />

        {/* Modals */}
        <CreatePayrollModal
          show={showCreatePayroll}
          onClose={handleCloseCreatePayroll}
          availableEmployees={availableEmployees}
          selectedEmployees={selectedEmployees}
          employeeSearch={employeeSearch}
          setEmployeeSearch={setEmployeeSearch}
          onSelectAll={handleSelectAll}
          onSelectEmployee={handleSelectEmployee}
          onCreate={handleCreatePayroll}
        />

        <PayslipModal
          show={showPayslip}
          onClose={() => setShowPayslip(false)}
          employee={selectedEmployee}
        />

        <ProcessingModal
          show={processingModal}
          onClose={() => setProcessingModal(false)}
          onConfirm={confirmProcessPayroll}
          pendingRecords={pendingRecords}
          pendingCount={pendingCount}
        />
        <AddBonusModal
          show={showBonusModal}
          onClose={() => setShowBonusModal(false)}
          record={bonusRecord}
          onSave={saveBonus}
        />
      </div>
    </div>
  );
}
