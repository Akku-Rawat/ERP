import React, { useState, useRef, useEffect } from "react";
import { X, Printer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";

import InvoiceTemplate1 from "../../components/template/invoice/InvoiceTemplate1";
import InvoiceTemplate2 from "../../components/template/invoice/InvoiceTemplate2";
import InvoiceTemplate3 from "../../components/template/invoice/InvoiceTemplate3";

import { getAllSalesInvoices } from "../../api/salesApi";

import type { InvoiceSummary, InvoiceData } from "./types/invoice";

/* ============================================
   TEMPLATE CONFIG
============================================ */
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

/* ============================================
   DUMMY PREVIEW DATA (UNCHANGED)
============================================ */
const previewDummyInvoice: InvoiceData = {
  invoiceNumber: "PREVIEW-001",
  customerName: "Preview Corp",
  postingDate: "2025-11-01",
  currency: "INR",
  billingAddressLine1: "456, Sample Street",
  billingCity: "Demo City",
  billingState: "Demo State",
  billingPostalCode: "123456",
  total: 33300,
  totalTax: 1800,
  adjustment: 0,
  items: [
    {
      itemCode: "",
      itemName: "Preview Product",
      description: "Demo item",
      qty: 1,
      price: 30000,
      discount: 2000,
      amount: 28000,
    },
  ],
  paymentTerms: "Net 10",
  notes: "This is a preview invoice.",
  invoiceDate: "",
  invoiceDueDate: "",
  poNumber: "",
  totalDiscount: 0
};

/* ============================================
   MAIN COMPONENT
============================================ */
const InvoicesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null
  );
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(
    null
  );

  const componentRef = useRef<HTMLDivElement>(null);

  /* ============================================
     FETCH INVOICES (LIST)
  ============================================ */
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await getAllSalesInvoices();
      if (!res || res.status_code !== 200) {
        console.error("Failed to load invoices");
        return;
      }

      const mapped: InvoiceSummary[] = res.data.map((inv: any) => ({
        invoiceNumber: inv.invoiceNumber,
        customerName: inv.customerName,
        date: inv.Date,
        currency: inv.currency,
        total: inv.Total,
        totalTax: Number(inv.totalTax ?? 0),
        status: inv.custom_invoice_status ?? "",
        invoiceType: inv.invoiceTypeParent ?? "",
      }));

      setInvoices(mapped);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  /* ============================================
     PRINT HANDLER
  ============================================ */
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice-${selectedInvoice?.customerName}-${selectedInvoice?.invoiceNumber}`,
  });

  /* ============================================
     HANDLERS
  ============================================ */
  const handleViewClick = (inv: InvoiceSummary) => {
    setSelectedInvoice(previewDummyInvoice);
    setShowTemplateSelector(true);
    setSelectedTemplate(null);
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
  };

  const handleCloseAll = () => {
    setSelectedInvoice(null);
    setSelectedTemplate(null);
    setShowTemplateSelector(false);
  };

  const renderTemplate = (templateId: TemplateType, preview = false) => {
    const data = preview ? previewDummyInvoice : selectedInvoice;
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

  /* ============================================
     UI
  ============================================ */
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
              <th className="px-4 py-2 text-left">Invoice No</th>
              <th className="px-4 py-2 text-left">Invoice status</th>
              <th className="px-4 py-2 text-left">Invoice Type</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.invoiceNumber} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{inv.invoiceNumber}</td>
                <td className="px-4 py-2">{inv.status}</td>
                <td className="px-4 py-2">{inv.invoiceType}</td>
                <td className="px-4 py-2">{inv.customerName}</td>
                <td className="px-4 py-2">{inv.date}</td>
                <td className="px-4 py-2">
                  {inv.currency} {inv.total.toLocaleString()}
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
                <td colSpan={5} className="text-center text-gray-400 py-6">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================= TEMPLATE SELECTOR ========================= */}
      {showTemplateSelector && selectedInvoice && !selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-[62.5vw] w-full relative">
            <button
              onClick={handleCloseAll}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-2">Choose Invoice Template</h2>
            <p className="text-sm text-gray-600 mb-6">
              Invoice for {selectedInvoice.customerName}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-items-center">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition transform hover:scale-105 border-2 border-transparent hover:border-blue-400 flex flex-col items-center w-[20vw] min-w-[280px] h-[65vh]"
                >
                  <div className="w-[45vw] max-w-[900px] flex justify-center items-start p-2 overflow-hidden h-[60vh]">
                    <div className="w-[41vw] scale-[0.45] origin-top">
                      {renderTemplate(template.id, true)}
                    </div>
                  </div>

                  <div className={`text-white text-center w-full py-2 font-semibold text-sm ${template.color}`}>
                    {template.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================= FULL PREVIEW ========================= */}
      {selectedInvoice && selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-[70vw] h-[95vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Invoice Preview
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedTemplate(null);
                      setShowTemplateSelector(true);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    ← Back to Templates
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Printer className="w-4 h-4" />
                    Print/Download
                  </button>

                  <button
                    onClick={handleCloseAll}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto bg-gray-100 p-4">
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-8 rounded-lg" ref={componentRef}>
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

export default InvoicesTable;
