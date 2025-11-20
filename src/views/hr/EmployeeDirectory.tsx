import React, { useState } from 'react';
import { Search, Plus, User, Edit2, Trash2, ChevronDown } from 'lucide-react';

type Employee = {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  location: string;
  status: 'Active' | 'On Leave' | 'Inactive';
};

const demoEmployees: Employee[] = [
  { id: 'E001', name: 'June Ner', jobTitle: 'Senior Developer', department: 'Engineering', location: 'New York', status: 'Active' },
  { id: 'E002', name: 'Cesh Spalq', jobTitle: 'Product Manager', department: 'Product', location: 'San Francisco', status: 'Active' },
  { id: 'E003', name: 'Nash Fosh', jobTitle: 'UI Designer', department: 'Design', location: 'Los Angeles', status: 'Active' },
  { id: 'E004', name: 'Atn Knowling', jobTitle: 'Backend Developer', department: 'Engineering', location: 'New York', status: 'Active' },
  { id: 'E005', name: 'Uad Sunefing', jobTitle: 'QA Engineer', department: 'QA', location: 'Chicago', status: 'On Leave' },
  { id: 'E006', name: 'Wowe Maled Ahly', jobTitle: 'Frontend Developer', department: 'Engineering', location: 'Austin', status: 'Active' },
  { id: 'E007', name: 'Jane Doe', jobTitle: 'HR Manager', department: 'HR', location: 'New York', status: 'Active' },
  { id: 'E008', name: 'Yaint Smith', jobTitle: 'Sales Manager', department: 'Sales', location: 'Boston', status: 'Active' },
  { id: 'E009', name: 'Super Din', jobTitle: 'DevOps Engineer', department: 'Engineering', location: 'Seattle', status: 'Inactive' },
  { id: 'E010', name: 'John Miller', jobTitle: 'Data Analyst', department: 'Analytics', location: 'Denver', status: 'Active' },
  { id: 'E011', name: 'Sarah Wilson', jobTitle: 'Marketing Lead', department: 'Marketing', location: 'Miami', status: 'Active' },
  { id: 'E012', name: 'Mike Johnson', jobTitle: 'Accountant', department: 'Finance', location: 'New York', status: 'Active' },
];

// Unique filter values
const uniqueDepartments = [...new Set(demoEmployees.map(e => e.department))];
const uniqueLocations = [...new Set(demoEmployees.map(e => e.location))];
const statusOptions = ['Active', 'On Leave', 'Inactive'];

const EmployeeDirectory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [itemsToShow, setItemsToShow] = useState(5);

  // Filtering
  const filteredEmployees = demoEmployees.filter(emp =>
    (search.trim() === '' ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(search.toLowerCase())
    ) &&
    (department === '' || emp.department === department) &&
    (location === '' || emp.location === location) &&
    (status === '' || emp.status === status)
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
                {uniqueDepartments.map(d => (
                  <option key={d} value={d}>{d}</option>
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
                {uniqueLocations.map(l => (
                  <option key={l} value={l}>{l}</option>
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
                {statusOptions.map(stat => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Add Button */}
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm">
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
                      <span className="font-medium text-gray-900">{emp.name}</span>
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
                        emp.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : emp.status === 'On Leave'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
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
                          // Edit functionality
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
                See More ({filteredEmployees.length - displayedEmployees.length} remaining)
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
            Showing {displayedEmployees.length} of {filteredEmployees.length} employees
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDirectory;
