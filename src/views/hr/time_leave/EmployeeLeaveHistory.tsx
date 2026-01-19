import React, { useState } from "react";
import { FaCalendarAlt, FaClock, FaUser } from "react-icons/fa";
import { CalendarDays, Users } from "lucide-react";
import Table from "../../../components/ui/Table/Table";
import StatusBadge from "../../../components/ui/Table/StatusBadge";
import ActionButton from "../../../components/ui/Table/ActionButton";
import Modal from "../../../components/ui/modal/modal";
import { Card } from "../../../components/ui/modal/formComponent";
import type { Column } from "../../../components/ui/Table/type";
import { useTableLogic } from "../../../components/ui/Table/useTableLogic";

/* Types */
type EmployeeLeaveHistory = {
  id: string;
  employee_name: string;
  employee_id: string;
  department: string;
  type: string;
  status: "Approved" | "Pending" | "Rejected" | "Cancelled";
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  applied_date: string;
  approved_by?: string;
};

/* Mock Data */
const MOCK_EMPLOYEE_LEAVES: EmployeeLeaveHistory[] = [
  {
    id: "1",
    employee_name: "Rajesh Kumar",
    employee_id: "EMP001",
    department: "Engineering",
    type: "Casual Leave",
    status: "Approved",
    start_date: "2026-01-20",
    end_date: "2026-01-21",
    days: 2,
    reason: "Personal work",
    applied_date: "15-01-2026",
    approved_by: "Amit Sharma",
  },
  {
    id: "2",
    employee_name: "Priya Singh",
    employee_id: "EMP002",
    department: "HR",
    type: "Sick Leave",
    status: "Approved",
    start_date: "2026-01-18",
    end_date: "2026-01-19",
    days: 2,
    reason: "Fever and cold",
    applied_date: "17-01-2026",
    approved_by: "Neha Verma",
  },
  {
    id: "3",
    employee_name: "Amit Patel",
    employee_id: "EMP003",
    department: "Sales",
    type: "Casual Leave",
    status: "Pending",
    start_date: "2026-01-22",
    end_date: "2026-01-24",
    days: 3,
    reason: "Family function",
    applied_date: "14-01-2026",
  },
  {
    id: "4",
    employee_name: "Neha Sharma",
    employee_id: "EMP004",
    department: "Marketing",
    type: "Emergency Leave",
    status: "Approved",
    start_date: "2026-01-10",
    end_date: "2026-01-10",
    days: 1,
    reason: "Medical emergency",
    applied_date: "10-01-2026",
    approved_by: "Rajesh Kumar",
  },
  {
    id: "5",
    employee_name: "Vikram Joshi",
    employee_id: "EMP005",
    department: "Engineering",
    type: "Sick Leave",
    status: "Rejected",
    start_date: "2026-01-15",
    end_date: "2026-01-16",
    days: 2,
    reason: "Doctor appointment",
    applied_date: "14-01-2026",
  },
  {
    id: "6",
    employee_name: "Rajesh Kumar",
    employee_id: "EMP001",
    department: "Engineering",
    type: "Sick Leave",
    status: "Approved",
    start_date: "2026-01-10",
    end_date: "2026-01-11",
    days: 2,
    reason: "Fever",
    applied_date: "09-01-2026",
    approved_by: "Amit Sharma",
  },
  {
    id: "7",
    employee_name: "Priya Singh",
    employee_id: "EMP002",
    department: "HR",
    type: "Casual Leave",
    status: "Approved",
    start_date: "2025-12-28",
    end_date: "2025-12-30",
    days: 3,
    reason: "Year end vacation",
    applied_date: "20-12-2025",
    approved_by: "Neha Verma",
  },
];

/* Component */
const EmployeeHistory: React.FC = () => {
  const [selectedLeave, setSelectedLeave] = useState<EmployeeLeaveHistory | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  /* Filter by employee */
  const filteredData = selectedEmployee
    ? MOCK_EMPLOYEE_LEAVES.filter((l) => l.employee_id === selectedEmployee)
    : MOCK_EMPLOYEE_LEAVES;

  /* Get unique employees */
  const uniqueEmployees = Array.from(
    new Map(
      MOCK_EMPLOYEE_LEAVES.map((l) => [l.employee_id, { id: l.employee_id, name: l.employee_name }])
    ).values()
  );

  /* Columns */
  const columns: Column<EmployeeLeaveHistory>[] = [
    {
      key: "employee",
      header: "Employee",
      align: "left",
      render: (l) => (
        <div>
          <div className="font-semibold flex items-center gap-2">
            <FaUser className="text-primary text-xs" />
            {l.employee_name}
          </div>
          <div className="text-xs text-muted">{l.employee_id} • {l.department}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      align: "left",
      render: (l) => (
        <div>
          <div className="font-semibold text-sm">{l.type}</div>
          <div className="text-xs text-muted italic">{l.reason}</div>
        </div>
      ),
    },
    {
      key: "period",
      header: "Period",
      align: "left",
      render: (l) => (
        <span className="text-xs">
          <FaCalendarAlt className="inline mr-1 text-muted" />
          {l.start_date} → {l.end_date}
        </span>
      ),
    },
    {
      key: "days",
      header: "Days",
      align: "center",
      render: (l) => (
        <span className="inline-flex items-center gap-1">
          <FaClock className="text-muted" />
          {l.days}
        </span>
      ),
    },
    {
      key: "applied_date",
      header: "Applied",
      align: "left",
    },
    {
      key: "status",
      header: "Status",
      align: "left",
      render: (l) => <StatusBadge status={l.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (l) => (
        <ActionButton
          type="view"
          iconOnly
          onClick={() => setSelectedLeave(l)}
        />
      ),
    },
  ];

  const {
    yearFilter,
    setYearFilter,
    leaveTypeFilter,
    setLeaveTypeFilter,
    departmentFilter,
    setDepartmentFilter,
  } = useTableLogic<EmployeeLeaveHistory>({
    columns,
    data: filteredData,
  });

  /* Filters */
  const historyFilters = (
    <>
      {/* EMPLOYEE FILTER */}
      <div className="relative">
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="
            appearance-none
            px-4 py-2
            pr-9
            rounded-xl
            border border-[var(--border)]
            bg-app
            text-[10px] font-black uppercase tracking-widest
            text-muted
            hover:text-primary hover:border-primary
            focus:outline-none focus:ring-2 focus:ring-primary/10
            cursor-pointer
          "
        >
          <option value="">Employee: All</option>
          {uniqueEmployees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          ▾
        </span>
      </div>

      {/* DEPARTMENT FILTER */}
      <div className="relative">
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="
            appearance-none
            px-4 py-2
            pr-9
            rounded-xl
            border border-[var(--border)]
            bg-app
            text-[10px] font-black uppercase tracking-widest
            text-muted
            hover:text-primary hover:border-primary
            focus:outline-none focus:ring-2 focus:ring-primary/10
            cursor-pointer
          "
        >
          <option value="">Department: All</option>
          <option value="Engineering">Dept: Engineering</option>
          <option value="HR">Dept: HR</option>
          <option value="Sales">Dept: Sales</option>
          <option value="Marketing">Dept: Marketing</option>
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          ▾
        </span>
      </div>

      {/* YEAR FILTER */}
      <div className="relative">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="
            appearance-none
            px-4 py-2
            pr-9
            rounded-xl
            border border-[var(--border)]
            bg-app
            text-[10px] font-black uppercase tracking-widest
            text-muted
            hover:text-primary hover:border-primary
            focus:outline-none focus:ring-2 focus:ring-primary/10
            cursor-pointer
          "
        >
          <option value="">Year: All</option>
          <option value="2026">Year: 2026</option>
          <option value="2025">Year: 2025</option>
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          ▾
        </span>
      </div>

      {/* LEAVE TYPE FILTER */}
      <div className="relative">
        <select
          value={leaveTypeFilter}
          onChange={(e) => setLeaveTypeFilter(e.target.value)}
          className="
            appearance-none
            px-4 py-2
            pr-9
            rounded-xl
            border border-[var(--border)]
            bg-app
            text-[10px] font-black uppercase tracking-widest
            text-muted
            hover:text-primary hover:border-primary
            focus:outline-none focus:ring-2 focus:ring-primary/10
            cursor-pointer
          "
        >
          <option value="">Type: All</option>
          <option value="Casual Leave">Type: Casual</option>
          <option value="Sick Leave">Type: Sick</option>
          <option value="Emergency Leave">Type: Emergency</option>
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          ▾
        </span>
      </div>
    </>
  );

  return (
    <div className="p-8">
      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Requests"
          value={filteredData.length}
          color="text-blue-500"
        />
        <StatCard
          label="Approved"
          value={filteredData.filter((l) => l.status === "Approved").length}
          color="text-green-500"
        />
        <StatCard
          label="Pending"
          value={filteredData.filter((l) => l.status === "Pending").length}
          color="text-yellow-500"
        />
        <StatCard
          label="Rejected"
          value={filteredData.filter((l) => l.status === "Rejected").length}
          color="text-red-500"
        />
      </div>

      {/* ===== TABLE ===== */}
      <Table
        columns={columns}
        data={filteredData}
        showToolbar
        extraFilters={historyFilters}
        toolbarPlaceholder="Search employee name, reason..."
        emptyMessage="No leave history found."
      />

      {/* ===== DETAILS MODAL ===== */}
      <Modal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        title="Leave Request Details"
        subtitle="Complete leave information"
        icon={CalendarDays}
        maxWidth="md"
      >
        {selectedLeave && (
          <div className="space-y-4">
            <Card title="Employee Information">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">Employee Name</span>
                  <p className="font-semibold">{selectedLeave.employee_name}</p>
                </div>
                <div>
                  <span className="text-muted">Employee ID</span>
                  <p className="font-semibold">{selectedLeave.employee_id}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted">Department</span>
                  <p className="font-semibold">{selectedLeave.department}</p>
                </div>
              </div>
            </Card>

            <Card title="Leave Details">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">Type</span>
                  <p className="font-semibold">{selectedLeave.type}</p>
                </div>
                <div>
                  <span className="text-muted">Status</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedLeave.status} />
                  </div>
                </div>
                <div>
                  <span className="text-muted">Period</span>
                  <p>
                    {selectedLeave.start_date} → {selectedLeave.end_date}
                  </p>
                </div>
                <div>
                  <span className="text-muted">Days</span>
                  <p>{selectedLeave.days}</p>
                </div>
                <div>
                  <span className="text-muted">Applied Date</span>
                  <p>{selectedLeave.applied_date}</p>
                </div>
                {selectedLeave.approved_by && (
                  <div>
                    <span className="text-muted">Approved By</span>
                    <p className="font-semibold">{selectedLeave.approved_by}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-muted">Reason</span>
                  <p className="italic mt-1">"{selectedLeave.reason}"</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

/* Stat Card Component */
const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="bg-card border border-theme rounded-xl p-4 text-center">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-muted mt-1">{label}</div>
  </div>
);

export default EmployeeHistory;