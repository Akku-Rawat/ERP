import React, { useState } from 'react';
import { FaSearch, FaPlus, FaUser, FaEllipsisV, FaChevronDown } from 'react-icons/fa';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'On Leave': return 'bg-yellow-100 text-yellow-700';
      case 'Inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-teal-100 text-teal-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters/Search/Add New Employee */}
      <div className="bg-white rounded-lg shadow px-5 py-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative w-52">
            <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name/job title"
              className="pl-8 pr-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
              style={{ minWidth: 100 }}
            />
          </div>
          {/* Department */}
          <div className="relative w-40">
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="block w-full px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-600 text-sm focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="">Department</option>
              {uniqueDepartments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none text-xs" />
          </div>
          {/* Location */}
          <div className="relative w-36">
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="block w-full px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-600 text-sm focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="">Location</option>
              {uniqueLocations.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none text-xs" />
          </div>
          {/* Status */}
          <div className="relative w-28">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="block w-full px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-600 text-sm focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="">Status</option>
              {statusOptions.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none text-xs" />
          </div>
          {/* Add New Employee Button */}
          <button className="ml-auto bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
            <FaPlus /> Add New Employee
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr className="text-gray-700 font-semibold">
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Job Title</th>
              <th className="py-3 px-6">Department</th>
              <th className="py-3 px-6">Location</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.map((emp) => (
              <tr key={emp.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-base" />
                    </div>
                    <span className="font-medium text-gray-800">{emp.name}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-gray-700">{emp.jobTitle}</td>
                <td className="py-3 px-6 text-gray-700">{emp.department}</td>
                <td className="py-3 px-6 text-gray-700">{emp.location}</td>
                <td className="py-3 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(emp.status)}`}>
                      {emp.status}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <button className="text-teal-600 hover:text-teal-800 font-medium text-xs">
                      View Profile
                    </button>
                    <FaEllipsisV className="text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                </td>
              </tr>
            ))}
            {/* "See More" row */}
            {displayedEmployees.length < filteredEmployees.length && (
              <tr>
                <td colSpan={6}>
                  <button
                    onClick={() => setItemsToShow(itemsToShow + 5)}
                    className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-semibold rounded-b"
                  >
                    See More ({filteredEmployees.length - displayedEmployees.length} remaining)
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Results Info */}
      <div className="text-center text-xs text-gray-500 mt-1">
        Showing {displayedEmployees.length} of {filteredEmployees.length} employees
      </div>
    </div>
  );
};

export default EmployeeDirectory;
