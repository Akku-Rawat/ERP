import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import QuotationModal from "../../components/sales/QuotationModal"; 

export interface QuotationItem {
  productName: string;
  description: string;
  quantity: number;
  listPrice: number;
  discount: number;
  tax: number;
}

export interface QuotationData {
  id?: string;
  quotationId?: string;
  quotationNumber?: string;
  customerName: string;
  quotationDate: string;
  validUntil: string;
  currency: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  items: QuotationItem[];
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  adjustment: number;
  grandTotal: number;
  amount?: number;
  opportunityStage?: string;
  subject?: string;
  poNumber?: string;
  poDate?: string;
  paymentTerms?: string;
  termsAndConditions?: string;
  notes?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  iban?: string;
  swiftCode?: string;
}

const sampleQuotations: QuotationData[] = [
  {
    id: "QUO-001",
    quotationId: "QT-2025-001",
    quotationNumber: "QT-2025-001",
    customerName: "Acme Technologies Ltd",
    quotationDate: "2025-10-29",
    validUntil: "2025-11-12",
    currency: "INR",
    amount: 531000,
    opportunityStage: "Awaiting Response",
    billingAddressLine1: "Plot 42, Tech Park",
    billingCity: "Bengaluru",
    billingState: "KA",
    billingPostalCode: "560001",
    items: [
      {
        productName: "Enterprise CRM",
        description: "Custom cloud-based CRM with analytics",
        quantity: 1,
        listPrice: 500000,
        discount: 50000,
        tax: 81000,
      },
    ],
    subTotal: 500000,
    totalDiscount: 50000,
    totalTax: 81000,
    adjustment: 0,
    grandTotal: 531000,
    paymentTerms: "50% advance, 50% on delivery",
    termsAndConditions: "Quote valid for 15 days. Prices exclude shipping.",
  },
  {
    id: "QUO-002",
    quotationId: "QT-2025-002",
    quotationNumber: "QT-2025-002",
    customerName: "Globex Ltd",
    quotationDate: "2025-10-15",
    validUntil: "2025-10-30",
    currency: "USD",
    amount: 6000,
    opportunityStage: "Approved",
    billingAddressLine1: "100 Main St",
    billingCity: "New York",
    billingState: "NY",
    billingPostalCode: "10001",
    items: [
      {
        productName: "Consulting Hours",
        description: "Senior architect – 40 hrs",
        quantity: 40,
        listPrice: 150,
        discount: 0,
        tax: 0,
      },
    ],
    subTotal: 6000,
    totalDiscount: 0,
    totalTax: 0,
    adjustment: 0,
    grandTotal: 6000,
  },
];

const QuotationsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationData | null>(null);

  const filteredQuotations = sampleQuotations.filter(
    (q) =>
      (q.id ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setSelectedQuotation(null);
    setModalOpen(true);
  };

  const handleEditClick = (quotation: QuotationData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedQuotation(quotation);
    setModalOpen(true);
  };

  const handleDelete = (quotation: QuotationData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete quotation "${quotation.id}"?`)) {
      // Hook up real delete logic here
      alert("Delete functionality ready — connect to API later");
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header: Search Input + Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search Quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Quotation
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-4 text-left">Quotation ID</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Follow-Up Date</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Opportunity Stage</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredQuotations.map((q) => (
              <tr key={q.id} className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150">
                <td className="px-6 py-4">{q.id}</td>
                <td className="px-6 py-4">{q.customerName}</td>
                <td className="px-6 py-4">{q.validUntil}</td>
                <td className="px-6 py-4">
                  {q.currency === "INR" ? "₹" : "$"}
                  {q.amount?.toLocaleString() ?? q.grandTotal.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      q.opportunityStage === "Approved"
                        ? "bg-green-100 text-green-800"
                        : q.opportunityStage === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {q.opportunityStage || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => handleEditClick(q, e)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(q, e)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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

      {/* Modal for add/edit */}
      <QuotationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        quotation={selectedQuotation}
        onSubmit={(data) => {
          setModalOpen(false);
          // Add/save logic here
        }}
      />
    </div>
  );
};

export default QuotationsTable;
