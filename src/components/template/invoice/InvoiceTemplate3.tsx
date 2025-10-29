import React, { forwardRef } from "react";

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

interface InvoiceTemplate3Props {
  data: InvoiceData;
  companyLogoUrl?: string;
}

const InvoiceTemplate3 = forwardRef<HTMLDivElement, InvoiceTemplate3Props>(
  ({ data, companyLogoUrl }, ref) => {
    const getCurrencySymbol = () => {
      switch (data.currency) {
        case "ZMW": return "ZK";
        case "INR": return "₹";
        case "USD": return "$";
        default: return "ZK";
      }
    };

    const symbol = getCurrencySymbol();

    return (
      <div
        ref={ref}
        className="w-full max-w-[210mm] mx-auto bg-white p-8"
        style={{ minHeight: "297mm" }}
      >
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {companyLogoUrl ? (
                <img src={companyLogoUrl} alt="Logo" className="w-16 h-16 object-contain bg-white rounded-lg p-2" />
              ) : (
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">RS</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">Rolaface Software Ltd</h1>
                <p className="text-blue-100 text-sm">Software & Technology Solutions</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold">INVOICE</h2>
              <p className="text-blue-100 text-sm mt-1">#{data.invoiceId || "INV-001"}</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Bill To</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold text-gray-800 mb-2">{data.CutomerName}</p>
              <p className="text-sm text-gray-600">{data.billingAddressLine1}</p>
              <p className="text-sm text-gray-600">{data.billingCity}, {data.billingState}</p>
              <p className="text-sm text-gray-600">{data.billingPostalCode}</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 font-semibold">Invoice Date:</span>
              <span className="text-gray-800">{data.dateOfInvoice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-semibold">Due Date:</span>
              <span className="text-gray-800">{data.dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-semibold">Payment Terms:</span>
              <span className="text-gray-800">{data.paymentTerms || "Net 30"}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Qty</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Rate</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => {
                const lineTotal = item.quantity * item.listPrice - item.discount;
                return (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800">{item.productName}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-4 text-right text-gray-700">{symbol}{item.listPrice.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right font-semibold text-gray-800">{symbol}{lineTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-semibold">{symbol}{data.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800 font-semibold">{symbol}{data.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-gray-800 font-semibold">-{symbol}{data.totalDiscount.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-blue-600">{symbol}{data.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-bold text-gray-700 mb-2">Notes</h4>
            <p className="text-sm text-gray-600">{data.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t-2 border-gray-200 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate3.displayName = "InvoiceTemplate3";
export default InvoiceTemplate3;
