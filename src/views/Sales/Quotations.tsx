import React, { useState, useRef } from "react";
import { X, Download, Printer, Check, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import Template1 from "../../components/template/quotation/Template1";
import Template2 from "../../components/template/quotation/Template2";
import Template3 from "../../components/template/quotation/Template3";

interface Quotation {
  id: string;
  customer: string;
  date: string;
  amount: number;
  opportunityStage: string;
}

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

const QuotationsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<TemplateType | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

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

  const handleViewClick = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setShowTemplateSelector(true);
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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Quotation-${selectedQuotation?.customer}-${selectedQuotation?.date}`,
  } as any);

  const renderTemplate = (templateId: TemplateType) => {
    if (!selectedQuotation) return null;
    
    switch (templateId) {
      case "template1":
        return <Template1 quotationData={selectedQuotation} />;
      case "template2":
        return <Template2 quotationData={selectedQuotation} />;
      case "template3":
        return <Template3 quotationData={selectedQuotation} />;
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
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl w-full relative">
      {/* Close Button */}
      <button
        onClick={handleCloseAll}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
      >
        ×
      </button>
      <div>
        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">Choose Quotation Template</h2>
        <p className="text-sm text-gray-600 mb-6">
          Quotation for {selectedQuotation.customer}
        </p>
        {/* Template Grid */}
        <div className="grid grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-blue-400 flex flex-col items-center"
            >
              {/* Preview - scaled, fully visible */}
              <div className="w-full flex justify-center p-2">
                <div className="scale-75 origin-top-left w-full max-w-[390px] h-[410px] overflow-hidden pointer-events-none">
                  {renderTemplate(template.id)}
                </div>
              </div>
              {/* Footer Bar with Color */}
              <div className={`text-white text-center w-full py-2 font-semibold text-sm ${template.color}`}>
                {template.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}


      {/* Full Template View */}
      {selectedQuotation && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-[95vw] h-[95vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Quotation Preview</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Preview and download your quotation
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedTemplate(null);
                      setShowTemplateSelector(true);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                  >
                    ← Back to Templates
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleCloseAll}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Quotation Preview */}
              <div className="flex-1 overflow-auto bg-gray-100 p-8">
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-8 rounded-lg">
                    <div ref={componentRef}>
                      {renderTemplate(selectedTemplate)}
                    </div>
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

export default QuotationsTable;
