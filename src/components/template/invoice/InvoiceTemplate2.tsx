import React, { forwardRef } from "react";

interface InvoiceItem {
  productName: string;
  description: string;
  hsCode?: string;
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
  dueDate?: string;
  orderId?: string;
  trackingNumber?: string;
  forwardingAgent?: string;
  paidBy?: string;
  currency: string;
  
  billingCompanyName?: string;
  billingAddressLine1?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  billingPhone?: string;
  billingEmail?: string;
  
  items: InvoiceItem[];
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  shippingCharges?: number;
  insurance?: number;
  adjustment: number;
  grandTotal: number;
  
  reasonForExport?: string;
  incoterms?: string;
  notes?: string;
}

interface InvoiceTemplate2Props {
  data: InvoiceData;
  companyLogoUrl?: string;
}

const InvoiceTemplate2 = forwardRef<HTMLDivElement, InvoiceTemplate2Props>(
  ({ data, companyLogoUrl }, ref) => {
    const getCurrencySymbol = () => {
      switch (data.currency) {
        case "ZMW": return "ZK";
        case "INR": return "₹";
        case "USD": return "$";
        case "EUR": return "€";
        case "GBP": return "£";
        default: return "$";
      }
    };

    const symbol = getCurrencySymbol();

    return (
      <div
        ref={ref}
        className="w-full max-w-[210mm] mx-auto bg-white p-8"
        style={{ minHeight: "297mm" }}
      >
        {/* Header with Decorative Arc */}
        <div className="relative mb-8">
          <div className="absolute top-0 right-0 w-64 h-32 border-4 border-gray-300 rounded-bl-full"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-4">
              {companyLogoUrl ? (
                <img src={companyLogoUrl} alt="Logo" className="w-16 h-16 object-contain" />
              ) : (
                <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-600 rounded-full"></div>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Rolaface Software Ltd</h1>
                <p className="text-sm text-gray-500 mt-1">Innovation & Excellence</p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">COMMERCIAL<br/>INVOICE</h2>
              <p className="text-xs text-gray-500">Professional Services</p>
            </div>
          </div>
        </div>

        {/* Invoice Info Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 font-semibold text-xs uppercase">Date</p>
              <p className="text-gray-800">{data.dateOfInvoice}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 font-semibold text-xs uppercase">Invoice Number</p>
              <p className="text-gray-800 bg-pink-100 px-2 py-1 inline-block rounded">
                {data.invoiceNumber || data.invoiceId || "INV-001"}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 font-semibold text-xs uppercase">Order ID</p>
              <p className="text-gray-800">{data.orderId || "—"}</p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Bill To</h3>
          <div className="space-y-1 text-sm">
            <p className="font-bold text-gray-800">{data.billingCompanyName || data.CutomerName}</p>
            <p className="text-gray-600">{data.billingAddressLine1}</p>
            <p className="text-gray-600">{data.billingCity}, {data.billingState} {data.billingPostalCode}</p>
            <p className="text-gray-600">{data.billingCountry}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#D4B5A0] text-white">
                <th className="px-3 py-3 text-left text-xs font-bold uppercase">Product</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase">Units</th>
                <th className="px-3 py-3 text-right text-xs font-bold uppercase">Unit Price</th>
                <th className="px-3 py-3 text-right text-xs font-bold uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.items.map((item, index) => {
                const lineTotal = item.quantity * item.listPrice - item.discount;
                return (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-gray-800">{item.productName}</p>
                      {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
                    </td>
                    <td className="px-3 py-3 text-center text-gray-800 font-semibold">{item.quantity}</td>
                    <td className="px-3 py-3 text-right text-gray-800">{symbol}{item.listPrice.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right text-gray-800 font-semibold">{symbol}{lineTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-1/3 space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Sub Total:</span>
              <span className="font-semibold">{symbol}{data.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Sales Tax (VAT):</span>
              <span className="font-semibold">{symbol}{data.totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-800 mt-2">
              <span className="font-bold text-base">Total:</span>
              <span className="font-bold text-base">{symbol}{data.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Decorative */}
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#A67C66] rounded-tr-full opacity-30"></div>
      </div>
    );
  }
);

InvoiceTemplate2.displayName = "InvoiceTemplate2";
export default InvoiceTemplate2;
