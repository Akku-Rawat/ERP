import React, { useState } from "react";
import InvoiceTemplate1 from "../../components/template/invoice/InvoiceTemplate1";
import InvoiceTemplate2 from "../../components/template/invoice/InvoiceTemplate2";
import InvoiceTemplate3 from "../../components/template/invoice/InvoiceTemplate3";


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


const previewDummyInvoice = {
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
    { productName: "Preview Product", description: "Demo item", quantity: 1, listPrice: 30000, discount: 2000, tax: 1500 },
    { productName: "Preview Service", description: "Demo service", quantity: 1, listPrice: 5000, discount: 0, tax: 300 },
  ],
  paymentTerms: "Net 10",
  notes: "This is a preview invoice.",
};

const Templates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);

  const renderTemplate = (templateId: TemplateType) => {
    switch (templateId) {
      case "template1":
        return <InvoiceTemplate1 data={previewDummyInvoice} />;
      case "template2":
        return <InvoiceTemplate2 data={previewDummyInvoice} />;
      case "template3":
        return <InvoiceTemplate3 data={previewDummyInvoice} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Invoice Templates</h2>

      {!selectedTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-items-center">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-blue-400 flex flex-col items-center w-[20vw] min-w-[280px] h-[65vh] max-h-[510px]`}
            >
              <div className="w-[45vw] max-w-[900px] flex justify-center items-start p-2 overflow-hidden h-[60vh] max-h-[450px]">
                <div className="w-[41vw] h-[105vh] flex justify-center items-start scale-[0.45] origin-top">
                  {renderTemplate(template.id)}
                </div>
              </div>
              <div className={`text-white text-center w-full py-2 font-semibold text-sm ${template.color}`}>
                {template.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTemplate && (
        <div>
          <button
            onClick={() => setSelectedTemplate(null)}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Templates
          </button>
          <div>
            {renderTemplate(selectedTemplate)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
