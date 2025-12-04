import React, { useState, useRef, useEffect } from "react";
import { X, Printer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import Template1 from "../../components/template/quotation/QuotationTemplate1";
import Template2 from "../../components/template/quotation/QuotationTemplate2";
import Template3 from "../../components/template/quotation/QuotationTemplate3";
import { getAllQuotations } from "../../api/quotationApi";
import type { QuotationSummary, QuotationData } from "../../types/quotation";
import Pagination from "../../components/Pagination";

type TemplateType = "template1" | "template2" | "template3";

const templates = [
  {
    id: "template1" as TemplateType,
    name: "Classic Quotation",
    description: "Traditional quotation with orange accents",
    color: "bg-orange-500",
  },
  {
    id: "template2" as TemplateType,
    name: "Modern Quotation",
    description: "Contemporary design with soft colors",
    color: "bg-[#BC9F7B]",
  },
  {
    id: "template3" as TemplateType,
    name: "GST Style Quotation",
    description: "Professional GST compliant format",
    color: "bg-blue-600",
  },
];

// === Dummy Preview ===
export const previewDummyQuotation: QuotationData = {
  id: "QT-PREVIEW",
  quotationId: "QT-2025-PREVIEW",
  customerName: "Preview Customer Pvt Ltd",
  quotationDate: "2025-10-29",
  validUntil: "2025-11-12",
  currency: "INR",
  amount: 454300,
  opportunityStage: "Preview",

  billingAddressLine1: "123 Sample Street",
  billingAddressLine2: "Sector 42",
  billingCity: "Mumbai",
  billingState: "MH",
  billingPostalCode: "400001",
  billingCountry: "India",

  shippingAddressLine1: "456 Industrial Area",
  shippingAddressLine2: "Phase 2",
  shippingCity: "Pune",
  shippingState: "MH",
  shippingPostalCode: "411001",
  shippingCountry: "India",

  poNumber: "PO-2025-001",
  bankName: "HDFC Bank",
  accountNumber: "123456789012",
  routingNumber: "HDFC0001234",

  items: [
    {
      productName: "Web Application Development",
      description: "Custom CRM with dashboard, user auth & reporting",
      quantity: 1,
      listPrice: 250000,
      discount: 0,
      tax: 45000,
    },
    {
      productName: "Mobile App (iOS & Android)",
      description: "React-Native companion app with push notifications",
      quantity: 1,
      listPrice: 150000,
      discount: 15000,
      tax: 24300,
    },
  ],

  subTotal: 400000,
  totalDiscount: 15000,
  totalTax: 69300,
  adjustment: 0,
  grandTotal: 454300,

  termsAndConditions:
    "• 50% advance payment required to start work.\n" +
    "• Remaining 50% payable on delivery.\n" +
    "• Quote valid for 15 days from the quotation date.",
  notes: "Thank you for considering us!",
};

// === Sample Quotations (with table fields) ===
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

// === Component ===
const QuotationsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuotation, setSelectedQuotation] =
    useState<QuotationData | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(
    null,
  );
  const [quotations, setQuotations] = useState<QuotationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const componentRef = useRef<HTMLDivElement>(null);


  const fetchQuotations = async () => {
    try {
      setLoading(true);

      const res = await getAllQuotations(page, pageSize);
      if (!res || res.status_code !== 200) {
        console.error("Failed to load quotations");
        return;
      }
      console.log("res: ", res);

      const mapped: QuotationSummary[] = res.data.map((quote: any) => ({
        quotationNumber: quote.name,
        customerName: quote.customer_name,
        industryBases: quote.custom_industry_bases,
        transactionDate: quote.transaction_date,
        validTill: quote.valid_till,
        grandTotal: Number(quote.grand_total ?? 0),
        currency: quote.currency,
      }));

      setTotalPages(res.pagination?.total_pages || 1);
      setQuotations(mapped);
    } catch (err) {
      console.error("Error fetching quotations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [page, pageSize]);

  const filteredQuotations = quotations.filter(
    (quote) =>
      (quote.quotationNumber ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Quotation-${selectedQuotation?.customerName}-${selectedQuotation?.quotationId}`,
  });

  const handleViewClick = (quote: QuotationSummary) => {
    // setSelectedQuotation(quote);
    setSelectedQuotation(previewDummyQuotation);
    setShowTemplateSelector(true);
    setSelectedTemplate(null);
  };

  const handleTemplateSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
  };

  const handleCloseAll = () => {
    setSelectedQuotation(null);
    setSelectedTemplate(null);
    setShowTemplateSelector(false);
  };

  const renderTemplate = (templateId: TemplateType, usePreviewData = false) => {
    const data = usePreviewData ? previewDummyQuotation : selectedQuotation;
    if (!data) return null;

    switch (templateId) {
      case "template1":
        return (
          <Template1
            ref={componentRef}
            data={data}
            companyLogoUrl={undefined}
          />
        );
      case "template2":
        return (
          <Template2
            ref={componentRef}
            data={data}
            companyLogoUrl={undefined}
          />
        );
      case "template3":
        return (
          <Template3
            ref={componentRef}
            data={data}
            companyLogoUrl={undefined}
          />
        );
      default:
        return null;
    }
  };

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
              <th className="px-4 py-2 text-left">Quotation No</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Customer Industry Bases</th>
              <th className="px-4 py-2 text-left">Transaction Date</th>
              <th className="px-4 py-2 text-left">Valid Till</th>
              <th className="px-4 py-2 text-left">Currency</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotations.map((q) => (
              <tr key={q.quotationNumber} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{q.quotationNumber}</td>
                <td className="px-4 py-2">{q.customerName}</td>
                <td className="px-4 py-2">{q.industryBases}</td>
                <td className="px-4 py-2">{q.transactionDate}</td>
                <td className="px-4 py-2">{q.validTill}</td>
                <td className="px-4 py-2">
                  {q.currency}
                </td>
                <td className="px-4 py-2">
                  {q.currency === "INR" ? "₹" : "$"}
                  {q.grandTotal?.toLocaleString() ?? q.grandTotal.toLocaleString()}
                </td>
                {/* <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${q.opportunityStage === "Approved"
                      ? "bg-green-100 text-green-800"
                      : q.opportunityStage === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {q.opportunityStage || "Pending"}
                  </span>
                </td> */}
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewClick(q)}
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

      {showTemplateSelector && selectedQuotation && !selectedTemplate && (
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
            <h2 className="text-2xl font-bold mb-2">
              Choose Quotation Template
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Quotation for {selectedQuotation.customerName}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
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

      {/* Full Screen Quotation Preview */}
      {selectedQuotation && selectedTemplate && (
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
                    Quotation Preview
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Preview and download your Quotation
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
                    Download/Print
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

              {/* Quotation Content */}
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

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default QuotationsTable;
