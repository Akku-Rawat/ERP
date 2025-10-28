import React, { useState } from "react";
import QuotationTemplate from "../../components/sales/QuotationTemplate";

interface Quotation {
  id: string;
  customer: string;
  date: string;
  amount: number;
  opportunityStage: string;
}


const QuotationsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

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
    <div className="p-4">
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
        <table className="min-w-full border border-gray-200 rounded-lg bg-white">
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
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      q.opportunityStage === "Approved"
                        ? "bg-green-100 text-green-800"
                        : q.opportunityStage === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {q.opportunityStage}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => setSelectedQuotation(q)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View
                  </button>
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

       {selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <QuotationTemplate
            open={true}
            quotationData={selectedQuotation}
            onClose={() => setSelectedQuotation(null)}
          />
        </div>
      )}
    </div>
  );
};

export default QuotationsTable;