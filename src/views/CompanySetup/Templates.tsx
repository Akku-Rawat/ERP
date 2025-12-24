import React, { useState } from "react";
import InvoiceDefaultTemplate from "../../components/template/invoice/InvoiceDefaultTemplate";
import QuotationDefaultTemplate from "../../components/template/quotation/QuotationDefaultTemplate";
import RFQDefaultTemplate from "../../components/template/rfq/RFQDefaultTemplate";
// import InvoiceUploadModal from "../../components/template/invoice/InvoiceUploadModal";
import QuotationUploadModal from "../../components/template/quotation/QuotationUploadModal";
import RFQUploadModal from "../../components/template/rfq/RFQUploadModal";
// import InvoiceTemplate1 from "../../components/template/invoice/InvoiceTemplate1";
import InvoiceTemplate2 from "../../components/template/invoice/InvoiceTemplate2";
import InvoiceTemplate3 from "../../components/template/invoice/InvoiceTemplate3";
import QuotationTemplate1 from "../../components/template/quotation/QuotationTemplate1";
import QuotationTemplate2 from "../../components/template/quotation/QuotationTemplate2";
import QuotationTemplate3 from "../../components/template/quotation/QuotationTemplate3";
import RFQTemplate1 from "../../components/template/rfq/rfqTemplate1";
import RFQTemplate2 from "../../components/template/rfq/rfqTemplate2";
import RFQTemplate3 from "../../components/template/rfq/rfqTemplate3";

// --- TypeScript Interfaces ---

type InvoiceItem = {
  productName: string;
  description: string;
  quantity: number;
  listPrice: number;
  discount: number;
  tax: number;
};

type InvoiceData = {
  customerName: string;
  dateOfInvoice: string;
  dueDate: string;
  currency: string;
  poNumber?: string;
  poDate?: string;
  paymentTerms?: string;
  paymentMethod?: string;
  items: InvoiceItem[];
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  adjustment: number;
  grandTotal: number;
  termsAndConditions?: string;
  notes?: string;

  // Additional fields that may be needed
  invoiceId?: string;
  billingAddressLine1?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  companyName?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
};

type QuotationItem = {
  productName: string;
  description: string;
  quantity: number;
  listPrice: number;
  discount: number;
  tax: number;
};

type QuotationData = {
  customerName: string;
  subject?: string;
  quotationDate: string;
  validUntil: string;
  poNumber?: string;
  currency: string;
  items: QuotationItem[];
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  adjustment: number;
  grandTotal: number;
  termsAndConditions?: string;
  notes?: string;

  // Additional fields
  quotationId?: string;
  billingAddressLine1?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  companyName?: string;
};

type RFQItem = {
  service?: string;
  description: string;
  quantity: number;
  pricePerUnit: string;
  totalPrice: string;
  material?: string;
  size?: string;
  color?: string;
  paperType?: string;
};

type RFQData = {
  subject?: string;
  items: RFQItem[];
  totalCost: string;

  // Required fields for RFQUploadModal
  vendorName: string;
  date: string;
  rfqId?: string;
  vendorAddress?: string;
  requestingCompany?: string;
  requestingAddress?: string;
  deadline?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
  additionalRequirements?: string[];
  notes?: string;
};

// --- Dummy Data ---
const previewDummyInvoice: InvoiceData = {
  customerName: "Client Co.",
  dateOfInvoice: "2025-11-01",
  dueDate: "2025-11-10",
  currency: "INR",
  poNumber: "PO-2025-001",
  poDate: "2025-10-25",
  paymentTerms: "Net 10",
  paymentMethod: "Bank Transfer",
  items: [
    {
      productName: "Custom Setup",
      description: "ERP custom implementation",
      quantity: 10,
      listPrice: 2000,
      discount: 0,
      tax: 240,
    },
    {
      productName: "Module Training",
      description: "ERP module training",
      quantity: 5,
      listPrice: 1500,
      discount: 0,
      tax: 180,
    },
  ],
  subTotal: 27500,
  totalDiscount: 0,
  totalTax: 420,
  adjustment: 0,
  grandTotal: 27920,
  termsAndConditions: "Payment due in 10 days.",
  notes: "Thank you!",
};

const previewDummyQuotation: QuotationData = {
  customerName: "Customer Name",
  subject: "Quotation for Services",
  quotationDate: "2025-11-11",
  validUntil: "2025-11-20",
  poNumber: "PO-001",
  currency: "INR",
  items: [
    {
      productName: "Demo Product",
      description: "Professional software solution",
      quantity: 1,
      listPrice: 50000,
      discount: 0,
      tax: 2500,
    },
  ],
  subTotal: 50000,
  totalDiscount: 0,
  totalTax: 2500,
  adjustment: 0,
  grandTotal: 52500,
  termsAndConditions: "Payment due within 14 days",
  notes: "Thank you for your business!",
};

const previewDummyRFQ: RFQData = {
  vendorName: "Vendor Company",
  date: "2025-11-19",
  subject: "Request for Catering Services",
  items: [
    {
      service: "Buffet Service",
      description: "Full buffet setup for 100 guests",
      quantity: 100,
      pricePerUnit: "$25",
      totalPrice: "$2,500",
    },
    {
      service: "Beverage Package",
      description: "Soft drinks and coffee service",
      quantity: 100,
      pricePerUnit: "$5",
      totalPrice: "$500",
    },
  ],
  totalCost: "$3,000",
};

// --- Types ---
type TemplateCategory = "invoice" | "quotation" | "rfq";
type InvoiceTemplateType = "default" | "template1" | "template2" | "template3";
type QuotationTemplateType =
  | "default"
  | "quotation1"
  | "quotation2"
  | "quotation3";
type RFQTemplateType = "default" | "rfq1" | "rfq2" | "rfq3";

// --- Dynamic mapping ---
const invoiceTemplateComponents: {
  [key in InvoiceTemplateType]: React.FC<{ data: InvoiceData }>;
} = {
  default: InvoiceDefaultTemplate,
  // template1: InvoiceTemplate1,
  template2: InvoiceTemplate2,
  template3: InvoiceTemplate3,
};

const quotationTemplateComponents: {
  [key in QuotationTemplateType]: React.FC<{ data: QuotationData }>;
} = {
  default: QuotationDefaultTemplate,
  quotation1: QuotationTemplate1,
  quotation2: QuotationTemplate2,
  quotation3: QuotationTemplate3,
};

const rfqTemplateComponents: {
  [key in RFQTemplateType]: React.FC<{ data: RFQData }>;
} = {
  default: RFQDefaultTemplate,
  rfq1: RFQTemplate1,
  rfq2: RFQTemplate2,
  rfq3: RFQTemplate3,
};

const Templates: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TemplateCategory | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [selectedInvoiceTemplate, setSelectedInvoiceTemplate] =
    useState<InvoiceTemplateType>("default");
  const [selectedQuotationTemplate, setSelectedQuotationTemplate] =
    useState<QuotationTemplateType>("default");
  const [selectedRFQTemplate, setSelectedRFQTemplate] =
    useState<RFQTemplateType>("default");

  const handleOpenModal = (categoryId: TemplateCategory) => {
    setModalOpen(true);
    setModalType(categoryId);
    setPreviewMode(false);
  };

  const handleOpenPreview = (categoryId: TemplateCategory) => {
    setModalOpen(true);
    setModalType(categoryId);
    setPreviewMode(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    setPreviewMode(false);
  };

  // -- Render Live Template Card for each --
  const renderInvoiceCard = () => {
    const PreviewComponent = invoiceTemplateComponents[selectedInvoiceTemplate];
    return <PreviewComponent data={previewDummyInvoice} />;
  };

  const renderQuotationCard = () => {
    const PreviewComponent =
      quotationTemplateComponents[selectedQuotationTemplate];
    return <PreviewComponent data={previewDummyQuotation} />;
  };

  const renderRFQCard = () => {
    const PreviewComponent = rfqTemplateComponents[selectedRFQTemplate];
    return <PreviewComponent data={previewDummyRFQ} />;
  };

  return (
    <div>
      <div className="flex mt-12 gap-9 justify-center flex-wrap">
        {/* Invoice */}
        <div className="flex flex-col items-center w-[280px] h-[480px] mx-4">
          <div className="text-base font-semibold mb-2 tracking-wide">
            Invoice
          </div>
          <div
            onClick={() => handleOpenPreview("invoice")}
            className="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-blue-400 flex flex-col items-center flex-1 w-full"
          >
            <div className="w-20vh flex justify-center items-start p-3 overflow-hidden flex-1">
              <div className="w-full h-full flex justify-center items-start scale-[0.32] origin-top">
                {renderInvoiceCard()}
              </div>
            </div>
            <div className="text-white text-center w-full py-3 font-semibold text-sm bg-[#748B75]">
              {selectedInvoiceTemplate === "default"
                ? "Current Invoice"
                : `Invoice Template ${selectedInvoiceTemplate.replace(
                    "template",
                    "",
                  )}`}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal("invoice");
            }}
            className="mt-2 mb-3 px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Update
          </button>
        </div>

        {/* Quotation */}
        <div className="flex flex-col items-center w-[280px] h-[480px] mx-4">
          <div className="text-base font-semibold mb-2 tracking-wide">
            Quotation
          </div>
          <div
            onClick={() => handleOpenPreview("quotation")}
            className="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-blue-400 flex flex-col items-center flex-1 w-full"
          >
            <div className="w-20vh flex justify-center items-start p-3 overflow-hidden flex-1">
              <div className="w-full h-full flex justify-center items-start scale-[0.32] origin-top">
                {renderQuotationCard()}
              </div>
            </div>
            <div className="text-white text-center w-full py-3 font-semibold text-sm bg-[#D4B5A0]">
              {selectedQuotationTemplate === "default"
                ? "Current Quotation"
                : `Quotation Template ${selectedQuotationTemplate.replace(
                    "quotation",
                    "",
                  )}`}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal("quotation");
            }}
            className="mt-2 mb-3 px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Update
          </button>
        </div>

        {/* RFQ */}
        <div className="flex flex-col items-center w-[280px] h-[480px] mx-4">
          <div className="text-base font-semibold mb-2 tracking-wide">RFQ</div>
          <div
            onClick={() => handleOpenPreview("rfq")}
            className="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-blue-400 flex flex-col items-center flex-1 w-full"
          >
            <div className="w-20vh flex justify-center items-start p-3 overflow-hidden flex-1">
              <div className="w-full h-full flex justify-center items-start scale-[0.32] origin-top">
                {renderRFQCard()}
              </div>
            </div>
            <div className="text-white text-center w-full py-3 font-semibold text-sm bg-[#B2B1CF]">
              {selectedRFQTemplate === "default"
                ? "Current RFQ"
                : `RFQ Template ${selectedRFQTemplate.replace("rfq", "")}`}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal("rfq");
            }}
            className="mt-2 mb-3 px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>

      {/* Modal components */}
      {modalOpen && modalType === "invoice" && (
        <InvoiceUploadModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          data={previewDummyInvoice}
          selectedTemplateId={selectedInvoiceTemplate}
          setSelectedTemplateId={(id) =>
            setSelectedInvoiceTemplate(id as InvoiceTemplateType)
          }
          previewMode={previewMode}
        />
      )}

      {modalOpen && modalType === "quotation" && (
        <QuotationUploadModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          data={previewDummyQuotation}
          selectedTemplateId={selectedQuotationTemplate}
          setSelectedTemplateId={(id) =>
            setSelectedQuotationTemplate(id as QuotationTemplateType)
          }
          previewMode={previewMode}
        />
      )}

      {modalOpen && modalType === "rfq" && (
        <RFQUploadModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          data={previewDummyRFQ}
          selectedTemplateId={selectedRFQTemplate}
          setSelectedTemplateId={(id) =>
            setSelectedRFQTemplate(id as RFQTemplateType)
          }
          previewMode={previewMode}
        />
      )}
    </div>
  );
};

export default Templates;
