import React, { useState } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaEdit, 
  FaTrash,
  FaEye,
  FaFileInvoiceDollar,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const AccountsReceivable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Sample Data
  const stats = [
    { label: 'Total Outstanding', value: '₹12,45,000', change: '+12%', trend: 'up', color: 'blue' },
    { label: 'Overdue Amount', value: '₹3,25,000', change: '-5%', trend: 'down', color: 'red' },
    { label: 'Avg Collection Days', value: '45 days', change: '+3 days', trend: 'neutral', color: 'yellow' },
    { label: 'Current Month Revenue', value: '₹8,50,000', change: '+18%', trend: 'up', color: 'green' }
  ];

  const invoices = [
    { id: 'INV-001', customer: 'ABC Corp', amount: 125000, due: '2025-01-15', status: 'Pending', days: 5, overdue: false },
    { id: 'INV-002', customer: 'XYZ Ltd', amount: 85000, due: '2025-01-05', status: 'Overdue', days: -5, overdue: true },
    { id: 'INV-003', customer: 'Tech Solutions', amount: 250000, due: '2025-01-25', status: 'Pending', days: 15, overdue: false },
    { id: 'INV-004', customer: 'Global Industries', amount: 175000, due: '2025-01-08', status: 'Overdue', days: -2, overdue: true },
    { id: 'INV-005', customer: 'Retail Mart', amount: 95000, due: '2025-01-18', status: 'Pending', days: 8, overdue: false },
    { id: 'INV-006', customer: 'Manufacturing Co', amount: 310000, due: '2025-01-30', status: 'Pending', days: 20, overdue: false },
  ];

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || inv.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                <FaFileInvoiceDollar className={`text-${stat.color}-600 text-xl`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-80">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search invoices or customers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 bg-white"
              >
                <FaFilter className="text-gray-600" />
                <span className="text-gray-700 font-medium capitalize">{filterStatus}</span>
              </button>
              
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {['all', 'pending', 'overdue', 'paid'].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 capitalize ${
                        filterStatus === status ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 bg-white">
              <FaDownload /> Export
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 bg-teal-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-teal-700 shadow-sm">
              <FaPlus /> New Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-teal-600">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{invoice.customer}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{invoice.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{invoice.due}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {invoice.overdue ? (
                        <FaExclamationTriangle className="text-red-500 text-xs" />
                      ) : (
                        <FaClock className="text-gray-400 text-xs" />
                      )}
                      <span className={`text-sm font-medium ${
                        invoice.overdue ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {Math.abs(invoice.days)} days {invoice.overdue ? 'overdue' : 'left'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FaFileInvoiceDollar className="mx-auto text-4xl mb-3 text-gray-300" />
              <p className="text-sm">No invoices found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Aging Report Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Aging Report Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600 mb-1">Current</p>
            <p className="text-xl font-bold text-green-700">₹5.2L</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">1-30 Days</p>
            <p className="text-xl font-bold text-blue-700">₹3.8L</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-gray-600 mb-1">31-60 Days</p>
            <p className="text-xl font-bold text-yellow-700">₹2.1L</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-gray-600 mb-1">61-90 Days</p>
            <p className="text-xl font-bold text-orange-700">₹0.9L</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-gray-600 mb-1">90+ Days</p>
            <p className="text-xl font-bold text-red-700">₹0.3L</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsReceivable;