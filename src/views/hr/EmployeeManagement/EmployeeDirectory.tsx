import React, { useState } from "react";
import {
  Search,
  Plus,
  User,
  Edit2,
  Trash2,
  ChevronDown,
  X,
  Upload,
} from "lucide-react";

type Employee = {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  location: string;
  status: "Active" | "On Leave" | "Inactive";
};

const demoEmployees: Employee[] = [
  {
    id: "E001",
    name: "June Ner",
    jobTitle: "Senior Developer",
    department: "Engineering",
    location: "New York",
    status: "Active",
  },
  {
    id: "E002",
    name: "Cesh Spalq",
    jobTitle: "Product Manager",
    department: "Product",
    location: "San Francisco",
    status: "Active",
  },
  {
    id: "E003",
    name: "Nash Fosh",
    jobTitle: "UI Designer",
    department: "Design",
    location: "Los Angeles",
    status: "Active",
  },
  {
    id: "E004",
    name: "Atn Knowling",
    jobTitle: "Backend Developer",
    department: "Engineering",
    location: "New York",
    status: "Active",
  },
  {
    id: "E005",
    name: "Uad Sunefing",
    jobTitle: "QA Engineer",
    department: "QA",
    location: "Chicago",
    status: "On Leave",
  },
  {
    id: "E006",
    name: "Wowe Maled Ahly",
    jobTitle: "Frontend Developer",
    department: "Engineering",
    location: "Austin",
    status: "Active",
  },
  {
    id: "E007",
    name: "Jane Doe",
    jobTitle: "HR Manager",
    department: "HR",
    location: "New York",
    status: "Active",
  },
  {
    id: "E008",
    name: "Yaint Smith",
    jobTitle: "Sales Manager",
    department: "Sales",
    location: "Boston",
    status: "Active",
  },
  {
    id: "E009",
    name: "Super Din",
    jobTitle: "DevOps Engineer",
    department: "Engineering",
    location: "Seattle",
    status: "Inactive",
  },
  {
    id: "E010",
    name: "John Miller",
    jobTitle: "Data Analyst",
    department: "Analytics",
    location: "Denver",
    status: "Active",
  },
  {
    id: "E011",
    name: "Sarah Wilson",
    jobTitle: "Marketing Lead",
    department: "Marketing",
    location: "Miami",
    status: "Active",
  },
  {
    id: "E012",
    name: "Mike Johnson",
    jobTitle: "Accountant",
    department: "Finance",
    location: "New York",
    status: "Active",
  },
];

const uniqueDepartments = [...new Set(demoEmployees.map((e) => e.department))];
const uniqueLocations = [...new Set(demoEmployees.map((e) => e.location))];
const statusOptions = ["Active", "On Leave", "Inactive"];

// ============================================
// ADD EMPLOYEE MODAL COMPONENT
// ============================================
type AddEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
};

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  departments,
}) => {
  const [activeTab, setActiveTab] = useState("Work");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mobile: "",
    tags: "",
    department: "",
    jobPosition: "",
    jobTitle: "",
    manager: "",
    workAddress: "",
    workLocation: "",
    monday: "Unspecified",
    tuesday: "Unspecified",
    wednesday: "Unspecified",
    thursday: "Unspecified",
    friday: "Unspecified",
    saturday: "Unspecified",
    sunday: "Unspecified",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in required fields (Name and Email)");
      return;
    }
    console.log("Saving employee:", formData);
    alert("Employee created successfully!");
    onClose();
  };

  if (!isOpen) return null;

  const tabs = [
    "Work",
    "Resume",
    "Certifications",
    "Personal",
    "Payroll",
    "Salary Adjustments",
    "Settings",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto pt-8 pb-8">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-5xl mx-4 min-h-[600px] flex flex-col">
        {/* Top Bar with Close Button */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
              A
            </span>
            <span className="font-medium">MNSIS</span>
            <span className="text-gray-400">11:11 AM</span>
            <span className="ml-4">Creating a new record...</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-8 py-6 border-b border-gray-200 bg-white">
          <div className="flex gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                  <User className="w-12 h-12 text-gray-300" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition shadow-sm">
                  <Upload className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Name and Contact Info */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Employee's Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="text-2xl font-normal text-gray-400 bg-transparent border-b-2 border-gray-300 outline-none w-full mb-4 pb-1 focus:border-gray-500 transition"
              />

              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📧</span>
                  <input
                    type="email"
                    placeholder="e.g. johndoe@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-transparent outline-none flex-1 placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <span>☎️</span>
                  <input
                    type="tel"
                    placeholder="Work Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-transparent outline-none flex-1 placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <span>📱</span>
                  <input
                    type="tel"
                    placeholder="Work Mobile"
                    value={formData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    className="bg-transparent outline-none flex-1 placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <span>🏷️</span>
                  <input
                    type="text"
                    placeholder="e.g. Founder, Motorhead..."
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    className="bg-transparent outline-none flex-1 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white px-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition relative whitespace-nowrap ${
                activeTab === tab
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === "Work" && (
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      WORK
                    </h3>

                    <div className="space-y-4 bg-white p-4 rounded-sm border border-gray-200">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Department
                        </label>
                        <select
                          value={formData.department}
                          onChange={(e) =>
                            handleInputChange("department", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        >
                          <option value=""></option>
                          {departments.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Job Position
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sales Manager"
                          value={formData.jobPosition}
                          onChange={(e) =>
                            handleInputChange("jobPosition", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Job Title
                        </label>
                        <input
                          type="text"
                          placeholder="Manager"
                          value={formData.jobTitle}
                          onChange={(e) =>
                            handleInputChange("jobTitle", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      LOCATION
                    </h3>
                    <div className="space-y-4 bg-white p-4 rounded-sm border border-gray-200">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Work Address
                        </label>
                        <input
                          type="text"
                          placeholder="Indore, India"
                          value={formData.workAddress}
                          onChange={(e) =>
                            handleInputChange("workAddress", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Work Location
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Building 2, Remote, etc."
                          value={formData.workLocation}
                          onChange={(e) =>
                            handleInputChange("workLocation", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Usual Work Location */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      USUAL WORK LOCATION
                    </h3>
                    <div className="space-y-3 bg-white p-4 rounded-sm border border-gray-200">
                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].map((day) => (
                        <div
                          key={day}
                          className="flex items-center justify-between"
                        >
                          <label className="text-xs text-gray-700 font-medium capitalize w-24">
                            {day}
                          </label>
                          <select
                            value={formData[day as keyof typeof formData]}
                            onChange={(e) =>
                              handleInputChange(day, e.target.value)
                            }
                            className="flex-1 px-2 py-1 text-xs border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                          >
                            <option value="Unspecified">Unspecified</option>
                            <option value="Office">Office</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      NOTE
                    </h3>
                    <div className="bg-white p-4 rounded-sm border border-gray-200">
                      <textarea
                        placeholder="Provide additional information about this person..."
                        value={formData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        rows={4}
                        className="w-full text-sm outline-none resize-none placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Organization Chart */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                    ORGANIZATION CHART
                  </h3>
                  <div className="bg-white p-6 rounded-sm border border-gray-200">
                    <p className="text-xs text-gray-500 mb-4">
                      Set a manager for reports to show in org chart
                    </p>

                    {/* Manager Selection */}
                    <div className="mb-6">
                      <label className="block text-xs text-gray-600 mb-2 font-medium">
                        Manager
                      </label>
                      <select
                        value={formData.manager}
                        onChange={(e) =>
                          handleInputChange("manager", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-gray-500 outline-none bg-white"
                      >
                        <option value="">Select Manager</option>
                        <option value="Sarah Wilson">
                          Sarah Wilson (Marketing Lead)
                        </option>
                        <option value="Jane Doe">Jane Doe (HR Manager)</option>
                        <option value="Yaint Smith">
                          Yaint Smith (Sales Manager)
                        </option>
                        <option value="Mike Johnson">
                          Mike Johnson (Accountant)
                        </option>
                      </select>
                    </div>

                    {/* Org Chart Preview */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-3">Preview:</p>
                      {formData.manager ? (
                        <>
                          <div className="bg-blue-50 rounded p-3 border border-blue-200">
                            <div className="text-xs font-medium text-blue-900">
                              {formData.manager}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              Manager
                            </div>
                          </div>
                          <div className="ml-6 border-l-2 border-gray-300 pl-4">
                            <div className="bg-green-50 rounded p-3 border border-green-200">
                              <div className="text-xs font-medium text-green-900">
                                {formData.name || "New Employee"}
                              </div>
                              <div className="text-xs text-green-600 mt-1">
                                {formData.jobPosition || "Position Not Set"}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-400 text-xs">
                          Select a manager to preview org chart
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "Work" && (
            <div className="px-8 py-16 text-center">
              <p className="text-gray-500">
                {activeTab} content will appear here
              </p>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t border-gray-200 bg-white px-8 py-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
          >
            Discard
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EMPLOYEE DIRECTORY (PARENT COMPONENT)
// ============================================
const EmployeeDirectory: React.FC = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [itemsToShow, setItemsToShow] = useState(5);
  const [showModal, setShowModal] = useState(false);

  const filteredEmployees = demoEmployees.filter(
    (emp) =>
      (search.trim() === "" ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(search.toLowerCase())) &&
      (department === "" || emp.department === department) &&
      (location === "" || emp.location === location) &&
      (status === "" || emp.status === status),
  );

  const displayedEmployees = filteredEmployees.slice(0, itemsToShow);

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete employee "${name}"?`)) {
      alert("Delete functionality ready — connect to API later");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search name/job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700 appearance-none cursor-pointer"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700 appearance-none cursor-pointer"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700 appearance-none cursor-pointer"
              >
                <option value="">All Status</option>
                {statusOptions.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Add Button - This opens the modal */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add New Employee
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
              <tr>
                <th className="px-6 py-4 text-left">Employee ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Job Title</th>
                <th className="px-6 py-4 text-left">Department</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                    {emp.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="text-white w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {emp.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{emp.jobTitle}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{emp.location}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        emp.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : emp.status === "On Leave"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-indigo-600 hover:text-indigo-800 transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(emp.id, emp.name, e)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* See More Button */}
          {displayedEmployees.length < filteredEmployees.length && (
            <div className="border-t border-gray-200">
              <button
                onClick={() => setItemsToShow(itemsToShow + 5)}
                className="w-full py-3 bg-gray-50 hover:bg-indigo-50 text-indigo-600 text-sm font-medium transition-colors"
              >
                See More ({filteredEmployees.length - displayedEmployees.length}{" "}
                remaining)
              </button>
            </div>
          )}

          {displayedEmployees.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              {search || department || location || status
                ? "No employees match your filters."
                : "No employees added yet."}
            </div>
          )}
        </div>

        {/* Results Info */}
        {displayedEmployees.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {displayedEmployees.length} of {filteredEmployees.length}{" "}
            employees
          </div>
        )}
      </div>

      {/* MODAL IS CALLED HERE */}
      <AddEmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        departments={uniqueDepartments}
      />
    </div>
  );
};

export default EmployeeDirectory;
