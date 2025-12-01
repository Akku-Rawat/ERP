import React, { useState, useRef } from "react";
import { X, Printer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
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

type TemplateType = "template1" | "template2" | "template3";

const templates = [
  {
    id: "template1" as TemplateType,
    name: "Invoice Template1",
    description: "Traditional invoice with orange accents",
    color: "bg-[#748B75]",
  },
  {
    id: "template2" as TemplateType,
    name: "Invoice Template2",
    description: "Contemporary design with soft colors",
    color: "bg-[#D4B5A0]",
  },
  {
    id: "template3" as TemplateType,
    name: "Invoice Template3",
    description: "Professional clean blue style",
    color: "bg-[#B2B1CF]",
  },
];

const previewDummyInvoice: InvoiceData = {
  invoiceId: "PREVIEW-001",
  invoiceNumber: "PREVIEW-001",
  CutomerName: "Preview Corp",
  dateOfInvoice: "2025-11-01",
  dueDate: "2025-11-10",
  currency: "INR",
  billingAddressLine1: "456, Sample Street",
  billingCity: "Demo City",
  billingState: "Demo State",
  billingPostalCode: "123456",
  subTotal: 33500,
  totalDiscount: 2000,
  totalTax: 1800,
  adjustment: 0,
  grandTotal: 33300,
  items: [
    {
      productName: "Preview Product",
      description: "Demo item",
      quantity: 1,
      listPrice: 30000,
      discount: 2000,
      tax: 1500,
    },
    {
      productName: "Preview Service",
      description: "Demo service",
      quantity: 1,
      listPrice: 5000,
      discount: 0,
      tax: 300,
    },
  ],
  paymentTerms: "Net 10",
  notes: "This is a preview invoice.",
};

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
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null,
  );
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(
    null,
  );
  const componentRef = useRef<HTMLDivElement>(null);

  // Print and download use react-to-print (browser dialog handles both)
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice-${selectedInvoice?.CutomerName}-${selectedInvoice?.invoiceNumber}`,
  });

  const filteredInvoices = sampleInvoices.filter(
    (inv) =>
      inv.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.CutomerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleViewClick = (inv: InvoiceData) => {
    setSelectedInvoice(inv);
    setShowTemplateSelector(true);
    setSelectedTemplate(null);
  };

  const handleTemplateSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
  };

  const handleCloseAll = () => {
    setSelectedInvoice(null);
    setSelectedTemplate(null);
    setShowTemplateSelector(false);
  };

  const renderTemplate = (templateId: TemplateType, usePreviewData = false) => {
    const data = usePreviewData ? previewDummyInvoice : selectedInvoice;
    if (!data) return null;
    switch (templateId) {
      case "template1":
        return <InvoiceTemplate1 data={data} companyLogoUrl={undefined} />;
      case "template2":
        return <InvoiceTemplate2 data={data} companyLogoUrl={undefined} />;
      case "template3":
        return <InvoiceTemplate3 data={data} companyLogoUrl={undefined} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {/* Search */}
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
        <table className="min-w-full border border-gray-200 rounded-lg bg-white">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Invoice ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Issue Date</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr
                key={inv.invoiceId || inv.invoiceNumber}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-2">{inv.invoiceId}</td>
                <td className="px-4 py-2">{inv.CutomerName}</td>
                <td className="px-4 py-2">{inv.dateOfInvoice}</td>
                <td className="px-4 py-2">{inv.dueDate}</td>
                <td className="px-4 py-2">
                  ₹{inv.grandTotal.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewClick(inv)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View
                  </button>
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

      {showTemplateSelector && selectedInvoice && !selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-[62.5vw] w-full relative">
            {" "}
            {/* 1200px ≈ 62.5vw */}
            {/* Close Button */}
            <button
              onClick={handleCloseAll}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
            {/* Modal Content */}
            <h2 className="text-2xl font-bold mb-2">Choose Invoice Template</h2>
            <p className="text-sm text-gray-600 mb-6">
              Invoice for {selectedInvoice.CutomerName}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-items-center">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-blue-400 flex flex-col items-center w-[20vw] min-w-[280px] h-[65vh] max-h-[510px]"
                >
                  {/* Preview Frame */}
                  <div className="w-[45vw] max-w-[900px] flex justify-center items-start p-2 overflow-hidden h-[60vh] max-h-[450px]">
                    <div className="w-[41vw] h-[105vh] flex justify-center items-start scale-[0.45] origin-top">
                      {renderTemplate(template.id, true)}
                    </div>
                  </div>

                  {/* Template Name */}
                  <div
                    className={`text-white text-center w-full py-2 font-semibold text-sm ${template.color}`}
                  >
                    {template.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Invoice Preview */}
      {selectedInvoice && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-[70vw] h-[95vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header with Buttons */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Invoice Preview
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Preview and download your invoice
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Back Button */}
                  <button
                    onClick={() => {
                      setSelectedTemplate(null);
                      setShowTemplateSelector(true);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                  >
                    ← Back to Templates
                  </button>

                  {/* Print Button */}
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Printer className="w-4 h-4" />
                    Print/Download
                  </button>

                  {/* Close button */}
                  <button
                    onClick={handleCloseAll}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Invoice Content */}
              <div className="flex-1 overflow-auto bg-gray-100 p-4">
                <div className="flex justify-center">
                  <div
                    className="bg-gray-100 p-8 rounded-lg"
                    ref={componentRef}
                  >
                    {renderTemplate(selectedTemplate, false)}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProformaInvoicesTable;
