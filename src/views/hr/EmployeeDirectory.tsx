import React, { useState } from 'react';
import { FaSearch, FaPlus, FaUser, FaEllipsisV } from 'react-icons/fa';

type Employee = {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  location?: string;
  status: 'Active' | 'On Leave' | 'Inactive';
};

const demoEmployees: Employee[] = [
  { id: 'E001', name: 'June Ner', jobTitle: 'Job Title', department: 'Depalopment', location: 'Pestile', status: 'Active' },
  { id: 'E002', name: 'Cesh Spalq', jobTitle: 'Job Title', department: 'Depalopment', location: 'Pestile', status: 'Active' },
  { id: 'E003', name: 'Nash Fosh', jobTitle: 'Job Tite', department: 'Depalopment', location: 'Pestile', status: 'Active' },
  { id: 'E004', name: 'Atn Knowling', jobTitle: 'Development', department: 'Devalopment', location: 'Pectile', status: 'Active' },
  { id: 'E005', name: 'Uad Sunefing', jobTitle: 'Development', department: 'Devalopment', location: 'Pectile', status: 'Active' },
  { id: 'E006', name: 'Wowe Maled Ahly', jobTitle: 'Development', department: 'Development', location: 'On Ilide', status: 'Active' },
  { id: 'E007', name: 'Jane Doe', jobTitle: 'Job Title', department: 'Development', location: 'Mestile', status: 'Active' },
  { id: 'E008', name: 'Yaint Smith', jobTitle: 'Development', department: 'Development', location: 'Pastille', status: 'Active' },
  { id: 'E009', name: 'Super Din', jobTitle: 'Development', department: 'Development', location: 'Pectile', status: 'Active' },
];

const EmployeeDirectory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Department');
  const [filteredEmployees, setFilteredEmployees] = useState(demoEmployees);

  const handleSearch = (query: string) => {
    setSearch(query);
    const filtered = demoEmployees.filter(emp =>
      emp.name.toLowerCase().includes(query.toLowerCase()) ||
      emp.department.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employee Directory</h1>
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
          <FaPlus /> Add New Employee
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3">
          {['Department', 'Location', 'Location', 'Status'].map((filter, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedFilter === filter
                  ? 'border-b-2 border-teal-500 text-teal-600 bg-gray-50'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Cards */}
      <div>
        {/* First Row - 3 columns (Horizontal Layout) */}
        <h3 className="text-lg font-semibold mb-4">Employee Overview</h3>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {filteredEmployees.slice(0, 3).map(emp => (
            <div key={emp.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              {/* User Icon Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mb-4">
                <FaUser className="text-white text-2xl" />
              </div>

              {/* Employee Info */}
              <h4 className="text-lg font-semibold text-center">{emp.name}</h4>
              <p className="text-sm text-gray-600 text-center">{emp.jobTitle}</p>
              <p className="text-xs text-gray-500 text-center mb-4">{emp.department}</p>

              {/* Status Badge */}
              <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">
                {emp.status}
              </span>

              {/* Actions */}
              <div className="mt-4 w-full flex justify-between items-center px-4 py-2 bg-gray-50 rounded">
                <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">
                  View Profile
                </button>
                <FaEllipsisV className="text-gray-400 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        {/* Grid Layout - 3 columns (Card Grid) */}
        <div className="grid grid-cols-3 gap-6">
          {filteredEmployees.slice(3).map(emp => (
            <div key={emp.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              {/* User Icon Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mb-4">
                <FaUser className="text-white text-2xl" />
              </div>

              {/* Employee Info */}
              <h4 className="text-lg font-semibold text-center">{emp.name}</h4>
              <p className="text-sm text-gray-600 text-center">{emp.jobTitle}</p>
              <p className="text-xs text-gray-500 text-center mb-4">{emp.department}</p>

              {/* Status Badge */}
              <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">
                {emp.status}
              </span>

              {/* Actions */}
              <div className="mt-4 w-full flex justify-between items-center px-4 py-2 bg-gray-50 rounded">
                <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">
                  View Profile
                </button>
                <FaEllipsisV className="text-gray-400 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDirectory;
