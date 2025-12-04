import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Calendar,
  MapPin,
  TrendingUp,
} from "lucide-react";
import InvoiceModal from "../../components/sales/InvoiceModal";

interface InvoiceItem {
  productName: string;
  description: string;
  quantity: number;
  listPrice: number;
  discount: number;
  tax: number;
}

interface InvoiceData {
  invoiceId?: string;
  invoiceNumber?: string;
  CutomerName: string;
  dateOfInvoice: string;
  dueDate: string;
  currency: string;
  billingAddressLine1?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  items: InvoiceItem[];
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  adjustment: number;
  grandTotal: number;
  paymentTerms?: string;
  notes?: string;
}

const sampleInvoices: InvoiceData[] = [
  {
    invoiceId: "INV-001",
    invoiceNumber: "INV-001",
    CutomerName: "Acme Corp",
    dateOfInvoice: "2025-10-01",
    dueDate: "2025-10-10",
    currency: "INR",
    billingAddressLine1: "123, Queen Street",
    billingCity: "Delhi",
    billingState: "Delhi",
    billingPostalCode: "110001",
    subTotal: 22000,
    totalDiscount: 0,
    totalTax: 3000,
    adjustment: 0,
    grandTotal: 25000,
    items: [
      {
        productName: "ERP Setup",
        description: "Full company license",
        quantity: 1,
        listPrice: 20000,
        discount: 0,
        tax: 2500,
      },
      {
        productName: "Support",
        description: "Annual maintenance",
        quantity: 1,
        listPrice: 2000,
        discount: 0,
        tax: 500,
      },
    ],
    paymentTerms: "Net 10",
    notes: "Thank you for your business!",
  },
  {
    invoiceId: "INV-002",
    invoiceNumber: "INV-002",
    CutomerName: "Globex Ltd",
    dateOfInvoice: "2025-10-03",
    dueDate: "2025-10-12",
    currency: "INR",
    billingAddressLine1: "456, Park Lane",
    billingCity: "Mumbai",
    billingState: "Maharashtra",
    billingPostalCode: "400001",
    subTotal: 32000,
    totalDiscount: 0,
    totalTax: 3000,
    adjustment: 0,
    grandTotal: 35000,
    items: [
      {
        productName: "Data Import",
        description: "All branch migration",
        quantity: 1,
        listPrice: 30000,
        discount: 0,
        tax: 2400,
      },
      {
        productName: "Consulting",
        description: "Site visit x2",
        quantity: 2,
        listPrice: 1000,
        discount: 0,
        tax: 600,
      },
    ],
    paymentTerms: "Net 10",
    notes: "",
  },
];

const InvoicesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null,
  );

  const filteredInvoices = sampleInvoices.filter(
    (inv) =>
      inv.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.CutomerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddClick = () => {
    setSelectedInvoice(null);
    setModalOpen(true);
  };

  const handleEditClick = (invoice: InvoiceData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  const handleDelete = (invoice: InvoiceData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete invoice "${invoice.invoiceId}"?`)) {
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
            placeholder="Search Invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
          />
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <Plus className="w-4.5 h-4.5" /> Add Invoice
        </button>
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-teal-700">
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv, idx) => (
                <tr
                  key={inv.invoiceId || inv.invoiceNumber}
                  className={`border-b border-gray-100 hover:bg-teal-50 cursor-pointer transition-all duration-300 group ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-6 py-5">
                    <span className="font-semibold text-gray-900 text-sm group-hover:text-teal-700 transition-colors">
                      {inv.invoiceId}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:scale-105 transition-all duration-300">
                          {inv.CutomerName.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-sm group-hover:text-teal-700 transition-colors">
                          {inv.CutomerName}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>
                            {inv.billingCity}, {inv.billingState}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {inv.dateOfInvoice}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {inv.dueDate}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 shadow-sm group-hover:border-emerald-300 transition-all">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold text-sm">
                        ₹{inv.grandTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => handleEditClick(inv, e)}
                        className="p-2.5 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md border border-teal-200"
                        title="Edit"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(inv, e)}
                        className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md border border-red-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No invoices found
                      </p>
                      <p className="text-gray-400 text-sm">
                        Try adjusting your search
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        invoice={selectedInvoice}
        onSubmit={(data) => {
          setModalOpen(false);
          // Add/save logic here
        }}
      />
    </div>
  );
};

export default InvoicesTable;
