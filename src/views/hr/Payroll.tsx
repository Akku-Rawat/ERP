import React, { useMemo, useState } from 'react';
import { FaUsers, FaChevronDown, FaUserCircle } from 'react-icons/fa';

type PayrollRecord = {
  id: string;
  employeeName: string;
  department: string;
  grade: string;
  grossPay: number;
  netPay: number;
  status: 'Paid' | 'Pending' | 'Verified';
};

const demoPayrollRecords: PayrollRecord[] = [
  { id: 'P001', employeeName: 'Jenny Wilson', department: 'Sales', grade: 'G4', grossPay: 81000, netPay: 15000, status: 'Paid' },
  { id: 'P002', employeeName: 'Darrell Steward', department: 'Marketing', grade: 'G3', grossPay: 81000, netPay: 15000, status: 'Pending' },
  { id: 'P003', employeeName: 'Eleanor Pena', department: 'HR', grade: 'G5', grossPay: 81000, netPay: 31000, status: 'Paid' },
  { id: 'P004', employeeName: 'Cody Fisher', department: 'Sales', grade: 'G4', grossPay: 13000, netPay: 16200, status: 'Pending' },
  { id: 'P005', employeeName: 'Jerome Bell', department: 'Jerome', grade: 'G5', grossPay: 75000, netPay: 13600, status: 'Paid' },
  { id: 'P006', employeeName: 'Marvin McKinney', department: 'HR', grade: 'G', grossPay: 23000, netPay: 32000, status: 'Pending' },
];

const Payroll: React.FC = () => {
  // master records (stateful) so we can update statuses when running payroll
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(demoPayrollRecords);

  // UI state
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Pending' | 'Verified'>('All');

  // Process confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // derive departments list
  const departments = useMemo(() => {
    const setDepts = new Set<string>();
    payrollRecords.forEach(r => setDepts.add(r.department));
    return ['All Departments', ...Array.from(setDepts)];
  }, [payrollRecords]);

  // Derived filtered records based on selectedDept and filterStatus
  const filteredRecords = useMemo(() => {
    return payrollRecords.filter(record => {
      const byDept = selectedDept === 'All Departments' ? true : record.department === selectedDept;
      const byStatus = filterStatus === 'All' ? true : record.status === filterStatus;
      return byDept && byStatus;
    });
  }, [payrollRecords, selectedDept, filterStatus]);

  // Calculate totals from filtered records
  const totalGrossPay = filteredRecords.reduce((sum, record) => sum + record.grossPay, 0);
  const totalNetPay = filteredRecords.reduce((sum, record) => sum + record.netPay, 0);
  const totalDeductions = totalGrossPay - totalNetPay;

  // handlers
  const handleDepartmentFilter = (dept: string) => {
    setSelectedDept(dept);
    setDropdownOpen(false);
  };

  const openFilterModal = () => {
    setFilterModalOpen(true);
  };
  const closeFilterModal = () => {
    setFilterModalOpen(false);
  };
  const applyFilterStatus = (status: 'All' | 'Paid' | 'Pending' | 'Verified') => {
    setFilterStatus(status);
    setFilterModalOpen(false);
  };

  // Process payroll: open confirmation modal
  const handleRunPayrollClick = () => {
    setConfirmModalOpen(true);
  };

  // Confirm processing: mark filtered Pending records as Paid
  const confirmProcessPayroll = () => {
    setPayrollRecords(prev => {
      const updated = prev.map(rec => {
        // only update records currently visible (filteredRecords)
        const isVisible = filteredRecords.some(fr => fr.id === rec.id);
        if (isVisible && rec.status === 'Pending') {
          return { ...rec, status: 'Paid' as const };
        }
        return rec;
      });
      return updated;
    });
    setConfirmModalOpen(false);
    // small feedback
    setTimeout(() => alert('Payroll processed for visible records (Pending → Paid).'), 50);
  };

  // Export currently filtered records as CSV
  const exportFilteredAsCSV = () => {
    const header = ['EmpID', 'Employee', 'Department', 'Grade', 'GrossPay', 'NetPay', 'Status'];
    const lines = filteredRecords.map(r =>
      [
        r.id,
        `"${String(r.employeeName).replace(/"/g, '""')}"`,
        r.department,
        r.grade,
        r.grossPay,
        r.netPay,
        r.status
      ].join(',')
    );
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${selectedDept === 'All Departments' ? 'all' : selectedDept}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
  

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* Headcount */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Headcount</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">120</p>
        </div>

        {/* Monthly Hires */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Monthly Hires</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">5</p>
        </div>

        {/* Voluntary Leaves */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Voluntary Leaves</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">8</p>
        </div>

        {/* Next Payday */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Next Payday</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">30 Apr 2024</p>
        </div>
      </div>

      {/* Payroll Section */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payroll</h2>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white"
            >
              {selectedDept} <FaChevronDown className="text-xs" />
            </button>

            {/* Dropdown menu (keeps UI intact visually) */}
            {dropdownOpen && (
              <div className="absolute z-20 mt-2 w-56 bg-white border border-gray-200 rounded shadow">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => handleDepartmentFilter(dept)}
                    className={`block text-left w-full px-4 py-2 hover:bg-gray-50 ${dept === selectedDept ? 'font-semibold bg-gray-50' : ''}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={openFilterModal}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white"
          >
            Filter
          </button>
        </div>

        {/* Payroll Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-gray-300">
              <tr className="text-gray-700 font-semibold">
                <th className="py-4 px-4">Employee</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Grade</th>
                <th className="py-4 px-4">Gross Pay</th>
                <th className="py-4 px-4">Net Pay</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-2xl text-gray-400" />
                      <span className="font-medium text-gray-800">{record.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{record.department}</td>
                  <td className="py-4 px-4 text-gray-600">{record.grade}</td>
                  <td className="py-4 px-4 text-gray-800 font-medium">₹ {record.grossPay.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-800 font-medium">₹ {record.netPay.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : record.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Row */}
        <div className="border-t-2 border-gray-300 pt-4">
          <div className="grid grid-cols-3 gap-8 text-lg">
            <div>
              <p className="text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">₹ {totalGrossPay.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Deductions</p>
              <p className="text-2xl font-bold text-gray-800">₹ {totalDeductions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Net Pay</p>
              <p className="text-2xl font-bold text-gray-800">₹ {totalNetPay.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Run Payroll Button */}
      <div className="flex justify-end">
        <button
          onClick={handleRunPayrollClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Run Payroll
        </button>
      </div>

      {/* --- Filter Modal (overlay) --- */}
      {filterModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-30">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="All">All</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                </select>
              </div>

              {/* future filters placeholder (no UI change) */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Extra (placeholder)</label>
                <input className="w-full border rounded px-3 py-2" placeholder="e.g., min gross > 30000 (future)" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={closeFilterModal} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={() => applyFilterStatus(filterStatus)} className="bg-blue-600 text-white px-4 py-2 rounded">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Confirm Process Modal (Run Payroll) --- */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-30">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Confirm Payroll Processing</h3>

            <p className="text-sm text-gray-600 mb-4">
              You are about to process payroll for <strong>{filteredRecords.length}</strong> visible records.
            </p>

            <div className="grid grid-cols-3 gap-4 text-center py-3 border rounded mb-4">
              <div>
                <p className="text-xs text-gray-500">Total Gross</p>
                <p className="font-semibold">₹ {totalGrossPay.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Deductions</p>
                <p className="font-semibold">₹ {totalDeductions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Net Pay</p>
                <p className="font-semibold">₹ {totalNetPay.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div>
                <button
                  onClick={exportFilteredAsCSV}
                  className="px-3 py-2 border rounded text-sm"
                >
                  Export CSV (visible)
                </button>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setConfirmModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={confirmProcessPayroll} className="bg-blue-600 text-white px-4 py-2 rounded">Confirm & Process</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
