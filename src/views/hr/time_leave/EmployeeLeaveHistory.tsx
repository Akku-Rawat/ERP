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
import { useEffect } from "react";
import { getAllEmployeeLeaveHistory } from "../../../api/leaveApi";


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
};

const mapEmployeeLeaveFromApi = (l: any): EmployeeLeaveHistory => ({
  id: l.leaveId,

  employee_name: l.employee.employeeName,
  employee_id: l.employee.employeeId,
  department: l.employee.department,

  type: l.leaveType.name,

  status:
    l.status === "APPROVED"
      ? "Approved"
      : l.status === "REJECTED"
      ? "Rejected"
      : l.status === "CANCELLED"
      ? "Cancelled"
      : "Pending",

  start_date: l.duration.fromDate,
  end_date: l.duration.toDate,
  days: l.duration.totalDays,

  reason: "-", // API does not send reason
  applied_date: l.appliedOn,
});




/* Component */
const EmployeeHistory: React.FC = () => {
  const [selectedLeave, setSelectedLeave] = useState<EmployeeLeaveHistory | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [leaves, setLeaves] = useState<EmployeeLeaveHistory[]>([]);
  const [loading, setLoading] = useState(false);
const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);


  const filteredData = selectedEmployee
    ? leaves.filter((l) => l.employee_id === selectedEmployee)
    : leaves;

  const uniqueEmployees = Array.from(
    new Map(
      leaves.map((l) => [
        l.employee_id,
        { id: l.employee_id, name: l.employee_name },
      ])
    ).values()
  );


useEffect(() => {
  const fetchEmployeeLeaves = async () => {
    setLoading(true);
    try {
      const res = await getAllEmployeeLeaveHistory(page, pageSize);

      const mapped = (res.data?.leaves || []).map(mapEmployeeLeaveFromApi);
      setLeaves(mapped);

      const pg = res.data?.pagination;
      if (pg) {
        setTotalPages(pg.total_pages);
        setTotalItems(pg.total);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchEmployeeLeaves();
}, [page, pageSize]); 



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
      {/*  TABLE  */}
      <Table
        columns={columns}
        data={filteredData}
        loading={loading}
        showToolbar
        extraFilters={historyFilters}
        toolbarPlaceholder="Search employee name, reason..."
        emptyMessage="No leave history found."
        currentPage={page}
         enableColumnSelector
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          pageSizeOptions={[10, 25, 50, 100]}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1); // reset page
          }}
          onPageChange={setPage}
        />
      

      {/*  DETAILS MODAL  */}
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



export default EmployeeHistory;