import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import ProformaInvoiceModal from "../../components/sales/ProformaInvoiceModal";

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
  {
    invoiceId: "INV-003",
    invoiceNumber: "INV-003",
    CutomerName: "Initech",
    dateOfInvoice: "2025-10-05",
    dueDate: "2025-10-18",
    currency: "INR",
    billingAddressLine1: "789, Elm Street",
    billingCity: "Bangalore",
    billingState: "Karnataka",
    billingPostalCode: "560001",
    subTotal: 41000,
    totalDiscount: 0,
    totalTax: 4000,
    adjustment: 0,
    grandTotal: 45000,
    items: [
      {
        productName: "Server License",
        description: "Annual fee",
        quantity: 1,
        listPrice: 40000,
        discount: 0,
        tax: 3000,
      },
      {
        productName: "Training",
        description: "3-day onsite",
        quantity: 1,
        listPrice: 1000,
        discount: 0,
        tax: 1000,
      },
    ],
    paymentTerms: "Due end of month",
    notes: "Late fee after due date.",
  },
];

const ProformaInvoicesTable: React.FC = () => {
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
            placeholder="Search Proforma Invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Proforma
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-4 text-left">Invoice ID</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Issue Date</th>
              <th className="px-6 py-4 text-left">Due Date</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.map((inv) => (
              <tr
                key={inv.invoiceId || inv.invoiceNumber}
                className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
              >
                <td className="px-6 py-4">{inv.invoiceId}</td>
                <td className="px-6 py-4">{inv.CutomerName}</td>
                <td className="px-6 py-4">{inv.dateOfInvoice}</td>
                <td className="px-6 py-4">{inv.dueDate}</td>
                <td className="px-6 py-4">
                  ₹{inv.grandTotal.toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => handleEditClick(inv, e)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(inv, e)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for add/edit */}
      <ProformaInvoiceModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        invoice={selectedInvoice}
        onSubmit={(data) => {
          setModalOpen(false);
          // Save/update logic here (state or API)
        }}
      />
    </div>
  );
};

export default ProformaInvoicesTable;
