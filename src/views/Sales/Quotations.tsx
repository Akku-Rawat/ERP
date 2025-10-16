import React, { useState } from "react";

interface Quotation {
  id: string;
  customer: string;
  date: string;
  amount: number;
  opportunityStage: string;
}

const QuotationsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Local quotation data (moved from Sales file)
  const quotations: Quotation[] = [
    { id: "QUO-001", customer: "Acme Corp", date: "2025-10-14", amount: 25000, opportunityStage: "Awaiting Response" },
    { id: "QUO-002", customer: "Globex Ltd", date: "2025-10-15", amount: 35000, opportunityStage: "Approved" },
    { id: "QUO-003", customer: "Initech", date: "2025-10-16", amount: 45000, opportunityStage: "Rejected" },
  ];

  const filteredQuotations = quotations.filter(
    (q) =>
      q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search Quotations..."
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
              <th className="px-4 py-2 text-left">Quotation ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Follow-Up Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Opportunity Stage</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotations.map((q) => (
              <tr key={q.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{q.id}</td>
                <td className="px-4 py-2">{q.customer}</td>
                <td className="px-4 py-2">{q.date}</td>
                <td className="px-4 py-2">₹{q.amount.toLocaleString()}</td>
                <td className="px-4 py-2">{q.opportunityStage}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}

            {filteredQuotations.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">
                  No quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationsTable;
