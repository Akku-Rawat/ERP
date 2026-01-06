import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllEmployees,
  getEmployeeById,
  deleteEmployeeById,
} from "../../../api/employeeapi";

import AddEmployeeModal from "../../../components/Hr/employeedirectorymodal/AddEmployeeModal";

import Table from "../../../components/ui/Table/Table";
import StatusBadge from "../../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../../components/ui/Table/ActionButton";

import type { Column } from "../../../components/ui/Table/type";
import type { EmployeeSummary, Employee } from "../../../types/employee";

const EmployeeDirectory: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees(page, pageSize);
      console.log(res);
      setEmployees(res.data.employees);
      setTotalPages(res.data.pagination?.total_pages || 1);
      setTotalItems(res.data.pagination?.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  /* ===============================
     ACTION HANDLERS
  ================================ */

  const handleAdd = () => {
    setEditEmployee(null);
    setShowModal(true);
  };

  const handleEdit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await getEmployeeById(id);
      setEditEmployee(res.data ?? res);
      setShowModal(true);
    } catch {
      toast.error("Unable to fetch employee details");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this employee?")) return;

    try {
      await deleteEmployeeById(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast.success("Employee deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSaved = async () => {
    setShowModal(false);
    setEditEmployee(null);
    await fetchEmployees();
    toast.success(editEmployee ? "Employee updated" : "Employee added");
  };

  /* ===============================
     FILTERING
  ================================ */

  const filteredEmployees = employees.filter((e) =>
    [e.id, e.name, e.jobTitle, e.department, e.workLocation, e.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const uniqueDepartments = Array.from(
    new Set(employees.map((e) => e.department))
  ).filter((d) => d !== "");

  /* ===============================
     TABLE COLUMNS
  ================================ */

  const columns: Column<EmployeeSummary>[] = [
    { key: "id", header: "Employee ID", align: "left" },
    { key: "name", header: "Name", align: "left" },
    { key: "jobTitle", header: "Job Title", align: "left" },
    {
      key: "department",
      header: "Department",
      align: "left",
      render: (e) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          {e.department}
        </code>
      ),
    },
    { key: "workLocation", header: "Location", align: "left" },
    {
      key: "status",
      header: "Status",
      align: "left",
      render: (e) => <StatusBadge status={e.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (e) => (
        <ActionGroup>
          <ActionButton
            type="view"
            onClick={() => handleEdit(e.id, {} as any)}
          />
          <ActionMenu
            onEdit={(ev) => handleEdit(e.id, ev as any)}
            onDelete={(ev) => handleDelete(e.id, ev as any)}
          />
        </ActionGroup>
      ),
    },
  ];

  /* ===============================
     RENDER
  ================================ */

  return (
    <div className="p-8">
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-2 text-muted">Loading employees…</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredEmployees}
          showToolbar
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          enableAdd
          addLabel="Add Employee"
          onAdd={handleAdd}
          enableColumnSelector
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      )}

      <AddEmployeeModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditEmployee(null);
        }}
        onSuccess={handleSaved}
        departments={uniqueDepartments}
        level={[]}
        editData={editEmployee}
      />
    </div>
  );
};

export default EmployeeDirectory;
