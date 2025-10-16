import React, { useState } from "react";

interface Invoice {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
  dueDate: string;
}

const InvoicesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const invoices: Invoice[] = [
    { id: "INV-001", customer: "Acme Corp", date: "2025-10-01", amount: 25000, status: "Paid", dueDate: "2025-10-10" },
    { id: "INV-002", customer: "Globex Ltd", date: "2025-10-03", amount: 35000, status: "Overdue", dueDate: "2025-10-12" },
    { id: "INV-003", customer: "Initech", date: "2025-10-05", amount: 45000, status: "Pending", dueDate: "2025-10-18" },
  ];

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search Invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Invoice ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Issue Date</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{inv.id}</td>
                <td className="px-4 py-2">{inv.customer}</td>
                <td className="px-4 py-2">{inv.date}</td>
                <td className="px-4 py-2">{inv.dueDate}</td>
                <td className="px-4 py-2">₹{inv.amount.toLocaleString()}</td>
                <td className="px-4 py-2">{inv.status}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}

            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-6">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesTable;
