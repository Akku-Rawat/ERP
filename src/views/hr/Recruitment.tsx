import React, { useState } from 'react';
import { FaBriefcase, FaUsers, FaCalendarAlt, FaPlus, FaFilter, FaChevronDown } from 'react-icons/fa';

type JobOpening = {
  id: string;
  jobTitle: string;
  department: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract';
  postingDate: string;
  candidates: number;
  status: 'Open' | 'Closed';
};

const demoJobOpenings: JobOpening[] = [
  { id: 'J001', jobTitle: 'Software Engineer', department: 'Engineering', type: 'Full-Time', postingDate: '03/15/2024', candidates: 23, status: 'Open' },
  { id: 'J002', jobTitle: 'Marketing Coordinator', department: 'Marketing', type: 'Part-Time', postingDate: '03/10/2024', candidates: 14, status: 'Open' },
  { id: 'J003', jobTitle: 'Sales Associate', department: 'Sales', type: 'Full-Time', postingDate: '03/05/2024', candidates: 7, status: 'Closed' },
  { id: 'J004', jobTitle: 'Product Manager', department: 'Engineering', type: 'Full-Time', postingDate: '02/25/2024', candidates: 12, status: 'Open' },
  { id: 'J005', jobTitle: 'HR Specialist', department: 'Human Resources', type: 'Full-Time', postingDate: '02/20/2024', candidates: 19, status: 'Open' },
];

const Recruitment: React.FC = () => {
  const [filteredJobs, setFilteredJobs] = useState(demoJobOpenings);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const handleDepartmentFilter = (dept: string) => {
    setSelectedDepartment(dept);
    if (dept === 'All') {
      setFilteredJobs(demoJobOpenings);
    } else {
      setFilteredJobs(demoJobOpenings.filter(job => job.department === dept));
    }
  };

  const openingsCount = filteredJobs.filter(j => j.status === 'Open').length;
  const newCandidates = 8;
  const interviewsScheduled = 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recruitment</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
          <FaPlus /> New Job
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Openings */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Openings</p>
              <p className="text-4xl font-bold text-gray-800">{openingsCount}</p>
            </div>
            <FaBriefcase className="text-gray-400 text-4xl" />
          </div>
        </div>

        {/* New Candidates */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">New Candidates</p>
              <p className="text-4xl font-bold text-teal-600">{newCandidates}</p>
            </div>
            <FaUsers className="text-teal-500 text-4xl" />
          </div>
        </div>

        {/* Interviews Scheduled */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Interviews Scheduled</p>
              <p className="text-4xl font-bold text-blue-600">{interviewsScheduled}</p>
            </div>
            <FaCalendarAlt className="text-blue-500 text-4xl" />
          </div>
        </div>
      </div>

      {/* Job Openings Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Job Openings</h2>
        </div>

        {/* Filter and Search */}
        <div className="flex gap-4 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            <FaFilter /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Department <FaChevronDown />
          </button>
        </div>

        {/* Jobs Table */}
        <table className="w-full text-left text-sm">
          <thead className="border-b-2 border-gray-200">
            <tr className="text-gray-700 font-semibold">
              <th className="py-3 px-4">Job Title</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Posting Date</th>
              <th className="py-3 px-4">Candidates</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map(job => (
              <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{job.jobTitle}</td>
                <td className="py-3 px-4 text-gray-600">{job.department}</td>
                <td className="py-3 px-4 text-gray-600">{job.type}</td>
                <td className="py-3 px-4 text-gray-600">{job.postingDate}</td>
                <td className="py-3 px-4 font-semibold text-gray-800">{job.candidates}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-semibold ${
                      job.status === 'Open'
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recruitment;
