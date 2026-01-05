import React, { useState, useMemo } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

// Reusable Components
import Table from "../../components/ui/Table/Table"; 
import type { Column } from "../../components/ui/Table/type";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, { ActionGroup, ActionMenu } from "../../components/ui/Table/ActionButton";

// Modals
import IdentityVerificationModal from "../../components/Hr/employeedirectorymodal/IdentityVerificationModal";
import AddEmployeeModal from "../../components/Hr/employeedirectorymodal/AddEmployeeModal";

// Types
type Employee = {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  location: string;
  status: "Active" | "On Leave" | "Inactive";
};

const demoEmployees: Employee[] = [
  { id: "E001", name: "June Ner", jobTitle: "Senior Developer", department: "Engineering", location: "New York", status: "Active" },
  { id: "E002", name: "Cesh Spalq", jobTitle: "Product Manager", department: "Product", location: "San Francisco", status: "Active" },
  { id: "E003", name: "Nash Fosh", jobTitle: "UI Designer", department: "Design", location: "Los Angeles", status: "Active" },
  { id: "E004", name: "Atn Knowling", jobTitle: "Backend Developer", department: "Engineering", location: "New York", status: "Active" },
  { id: "E005", name: "Uad Sunefing", jobTitle: "QA Engineer", department: "QA", location: "Chicago", status: "On Leave" },
  { id: "E006", name: "Wowe Maled Ahly", jobTitle: "Frontend Developer", department: "Engineering", location: "Austin", status: "Active" },
  { id: "E007", name: "Jane Doe", jobTitle: "HR Manager", department: "HR", location: "New York", status: "Active" },
  { id: "E008", name: "Yaint Smith", jobTitle: "Sales Manager", department: "Sales", location: "Boston", status: "Active" },
  { id: "E009", name: "Super Din", jobTitle: "DevOps Engineer", department: "Engineering", location: "Seattle", status: "Inactive" },
  { id: "E010", name: "John Miller", jobTitle: "Data Analyst", department: "Analytics", location: "Denver", status: "Active" },
  { id: "E011", name: "Sarah Wilson", jobTitle: "Marketing Lead", department: "Marketing", location: "Miami", status: "Active" },
  { id: "E012", name: "Mike Johnson", jobTitle: "Accountant", department: "Finance", location: "New York", status: "Active" },
];

const EmployeeDirectory: React.FC = () => {
  // Modal States
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [verifiedData, setVerifiedData] = useState<any>(null);

  // Filter States 
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  // Pagination States 
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Unique values for dropdowns
  const uniqueDepartments = [...new Set(demoEmployees.map((e) => e.department))];
  const uniqueLocations = [...new Set(demoEmployees.map((e) => e.location))];

  // --- FILTER LOGIC ---
  const filteredEmployees = useMemo(() => {
    return demoEmployees.filter((emp) => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = !department || emp.department === department;
      const matchesLoc = !location || emp.location === location;
      const matchesStatus = !status || emp.status === status;
      return matchesSearch && matchesDept && matchesLoc && matchesStatus;
    });
  }, [searchTerm, department, location, status]);

  // Pagination Calculations
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // --- HANDLERS ---
  const handleVerified = (data: any) => {
    setVerifiedData(data);
    setShowVerificationModal(false);
    setShowAddEmployee(true);
  };

  const handleManualEntry = () => {
    setVerifiedData(null);
    setShowVerificationModal(false);
    setShowAddEmployee(true);
  };

  const handleAddClick = () => {
    setVerifiedData(null);
    setShowAddEmployee(true);
  };

  const handleEdit = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    console.log("Edit:", id);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (window.confirm(`Delete employee ${id}?`)) {
      console.log("Delete:", id);
    }
  };

  const handleRowClick = (employee: Employee) => {
    console.log("Row Click:", employee);
  };

  // --- COLUMNS DEFINITION ---
  const columns: Column<Employee>[] = [
    { 
      key: "name", 
      header: "Name", 
      align: "left",
      render: (emp) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {emp.name.charAt(0)}
          </div>
          <span className="font-medium text-gray-800">{emp.name}</span>
        </div>
      )
    },
    { key: "jobTitle", header: "Job Title", align: "left" },
    { key: "department", header: "Department", align: "left" },
    { key: "location", header: "Location", align: "left" },
    { 
      key: "status", 
      header: "Status", 
      align: "center",
      render: (emp) => <StatusBadge status={emp.status} /> 
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (emp) => (
        <ActionGroup>
          <ActionButton
            type="view"
            iconOnly
            onClick={() => handleRowClick(emp)}
          />
          <ActionMenu
            onEdit={(e) => handleEdit(emp.id, e)}
            onDelete={(e) => handleDelete(emp.id, e)}
          />
        </ActionGroup>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* --- CUSTOM FILTER BAR  --- */}
      <div className="bg-white rounded-lg shadow px-5 py-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative w-52">
            <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name/job title"
              className="pl-8 pr-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
            />
          </div>

          {/* Department */}
          <div className="relative w-40">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="block w-full px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-600 text-sm focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="">Department</option>
              {uniqueDepartments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <FaSearch className="absolute right-3 top-2.5 text-gray-400 pointer-events-none text-xs" /> 
          </div>

          {/* Location */}
          <div className="relative w-36">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-600 text-sm focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="">Location</option>
              {uniqueLocations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Status */}
          <div className="relative w-28">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-600 text-sm focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddClick}
            className="ml-auto flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
          >
            <FaPlus className="w-4 h-4" /> Add New Employee
          </button>
        </div>
      </div>

      {/* --- REUSABLE TABLE WRAPPED IN WHITE BG --- */}
     
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <Table
          columns={columns}
          data={paginatedData} // Filtered data yahan pass ho raha hai
          showToolbar
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          toolbarPlaceholder="Search name or job title..."
          enableColumnSelector
          
          // Pagination Props
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          
          
          className="shadow-none border-none"
          cardClassName="bg-transparent"
        />
      </div>

      {/* Modals */}
      {showVerificationModal && (
        <IdentityVerificationModal
          onVerified={handleVerified}
          onManualEntry={handleManualEntry}
          onClose={() => setShowVerificationModal(false)}
        />
      )}

      <AddEmployeeModal
        isOpen={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
        departments={uniqueDepartments}
        prefilledData={verifiedData}
      />
    </div>
  );
};

export default EmployeeDirectory;33333333333