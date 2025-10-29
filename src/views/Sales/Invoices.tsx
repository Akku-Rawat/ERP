import React, { useState } from "react";
import InvoiceTemplate1 from "../../components/template/invoice/InvoiceTemplate1";
import InvoiceTemplate2 from "../../components/template/invoice/InvoiceTemplate2";
import InvoiceTemplate3 from "../../components/template/invoice/InvoiceTemplate3";


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
      { productName: "ERP Setup", description: "Full company license", quantity: 1, listPrice: 20000, discount: 0, tax: 2500 },
      { productName: "Support", description: "Annual maintenance", quantity: 1, listPrice: 2000, discount: 0, tax: 500 },
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
      { productName: "Data Import", description: "All branch migration", quantity: 1, listPrice: 30000, discount: 0, tax: 2400 },
      { productName: "Consulting", description: "Site visit x2", quantity: 2, listPrice: 1000, discount: 0, tax: 600 },
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
      { productName: "Server License", description: "Annual fee", quantity: 1, listPrice: 40000, discount: 0, tax: 3000 },
      { productName: "Training", description: "3-day onsite", quantity: 1, listPrice: 1000, discount: 0, tax: 1000 },
    ],
    paymentTerms: "Due end of month",
    notes: "Late fee after due date.",
  },
];

const InvoicesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const companyLogoUrl = undefined; 

  // -- Search
  const filteredInvoices = sampleInvoices.filter(
    (inv) =>
      inv.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.CutomerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // -- Table view
  const handleViewClick = (inv: InvoiceData) => {
    setSelectedInvoice(inv);
    setShowTemplateSelector(true);
    setSelectedTemplate("");
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
  };

  const handleCloseAll = () => {
    setShowTemplateSelector(false);
    setSelectedTemplate("");
    setSelectedInvoice(null);
  };

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
            {filteredInvoices.map((inv, idx) => (
              <tr key={inv.invoiceId || idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{inv.invoiceId}</td>
                <td className="px-4 py-2">{inv.CutomerName}</td>
                <td className="px-4 py-2">{inv.dateOfInvoice}</td>
                <td className="px-4 py-2">{inv.dueDate}</td>
                <td className="px-4 py-2">₹{inv.grandTotal.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2">{/* Status not in the sample data, use paid/overdue etc. if wanted */}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => handleViewClick(inv)}
                  >View</button>
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

      {/* Template Selector Modal */}
      {showTemplateSelector && selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl w-full relative">
            <button
              onClick={handleCloseAll}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
            <div>
              <h2 className="text-2xl font-bold mb-6">Select Invoice Template</h2>
              <div className="grid grid-cols-3 gap-6">
                {/* Template 1 preview */}
                <div
                  onClick={() => handleTemplateSelect("template1")}
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-orange-400 flex flex-col items-center"
                >
                  <div className="w-full flex justify-center p-2">
                    <div className="scale-75 origin-top-left w-full max-w-[390px] h-[410px] overflow-hidden pointer-events-none">
                      <InvoiceTemplate1 data={selectedInvoice} companyLogoUrl={companyLogoUrl} />
                    </div>
                  </div>
                  <div className="bg-orange-500 text-white text-center w-full py-2 font-semibold text-sm">
                    Classic Invoice
                  </div>
                </div>
                {/* Template 2 preview */}
                <div
                  onClick={() => handleTemplateSelect("template2")}
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-[#D4B5A0] flex flex-col items-center"
                >
                  <div className="w-full flex justify-center p-2">
                    <div className="scale-75 origin-top-left w-full max-w-[390px] h-[410px] overflow-hidden pointer-events-none">
                      <InvoiceTemplate2 data={selectedInvoice} companyLogoUrl={companyLogoUrl} />
                    </div>
                  </div>
                  <div className="bg-[#D4B5A0] text-white text-center w-full py-2 font-semibold text-sm">
                    Modern Invoice
                  </div>
                </div>
                {/* Template 3 preview */}
                <div
                  onClick={() => handleTemplateSelect("template3")}
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-blue-500 flex flex-col items-center"
                >
                  <div className="w-full flex justify-center p-2">
                    <div className="scale-75 origin-top-left w-full max-w-[390px] h-[410px] overflow-hidden pointer-events-none">
                      <InvoiceTemplate3 data={selectedInvoice} companyLogoUrl={companyLogoUrl} />
                    </div>
                  </div>
                  <div className="bg-blue-600 text-white text-center w-full py-2 font-semibold text-sm">
                    Neat Blue Invoice
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full screen detailed modal for template */}
      {selectedInvoice && selectedTemplate === "template1" && (
        <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto flex justify-center items-start p-8">
          <div className="w-full max-w-5xl mx-auto relative">
            <button
              onClick={handleCloseAll}
              className="fixed top-4 right-4 z-[60] bg-red-500 text-white rounded-full p-3 hover:bg-red-600 shadow-lg"
            >
              <span className="text-2xl font-bold">×</span>
            </button>
            <InvoiceTemplate1 data={selectedInvoice} companyLogoUrl={companyLogoUrl} />
          </div>
        </div>
      )}
      {selectedInvoice && selectedTemplate === "template2" && (
        <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto flex justify-center items-start p-8">
          <div className="w-full max-w-5xl mx-auto relative">
            <button
              onClick={handleCloseAll}
              className="fixed top-4 right-4 z-[60] bg-red-500 text-white rounded-full p-3 hover:bg-red-600 shadow-lg"
            >
              <span className="text-2xl font-bold">×</span>
            </button>
            <InvoiceTemplate2 data={selectedInvoice} companyLogoUrl={companyLogoUrl} />
          </div>
        </div>
      )}
      {selectedInvoice && selectedTemplate === "template3" && (
        <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto flex justify-center items-start p-8">
          <div className="w-full max-w-5xl mx-auto relative">
            <button
              onClick={handleCloseAll}
              className="fixed top-4 right-4 z-[60] bg-red-500 text-white rounded-full p-3 hover:bg-red-600 shadow-lg"
            >
              <span className="text-2xl font-bold">×</span>
            </button>
            <InvoiceTemplate3 data={selectedInvoice} companyLogoUrl={companyLogoUrl} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesTable;
