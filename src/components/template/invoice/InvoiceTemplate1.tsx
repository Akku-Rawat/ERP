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
  subject?: string;
  dateOfInvoice: string;
  dueDate: string;
  estimateNo?: string;
  customerNumber?: string;
  currency: string;
  
  // Billing Address
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  
  // Shipping Address
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  
  // Shipment Information
  poNumber?: string;
  poDate?: string;
  letterOfCredit?: string;
  modeOfTransportation?: string;
  transportationTerms?: string;
  numberOfPackages?: string;
  declaredValue?: string;
  estimatedWeight?: string;
  carrier?: string;
  
  // Payment Information
  paymentTerms?: string;
  paymentMethod?: string;
  bankName?: string;
  accountNumber?: string;
  
  items: InvoiceItem[];
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  adjustment: number;
  grandTotal: number;
  
  termsAndConditions?: string;
  notes?: string;
}

interface InvoiceTemplate1Props {
  data: InvoiceData;
  companyLogoUrl?: string;
}

const InvoiceTemplate1 = forwardRef<HTMLDivElement, InvoiceTemplate1Props>(
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
        className="w-full max-w-[210mm] mx-auto bg-white p-8 shadow-lg"
        style={{ minHeight: "297mm" }}
      >
        {/* Header with Orange Bar */}
        <div className="border-t-8 border-orange-500 mb-6">
          <div className="flex justify-between items-start pt-6 pb-4">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              {companyLogoUrl ? (
                <img src={companyLogoUrl} alt="Logo" className="w-16 h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  LOGO
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-800">Rolaface Software Ltd</h1>
                <p className="text-sm text-gray-600">Your Trusted Technology Partner</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="text-right space-y-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-gray-600 font-semibold">PAGE</span>
                <span className="text-gray-800">1</span>
                <span className="text-gray-600 font-semibold">DATE</span>
                <span className="text-gray-800">{data.dateOfInvoice}</span>
                <span className="text-gray-600 font-semibold">DATE OF EXPIRY</span>
                <span className="text-gray-800">{data.dueDate}</span>
                <span className="text-gray-600 font-semibold">ESTIMATE NO.</span>
                <span className="text-gray-800">{data.estimateNo || "—"}</span>
                <span className="text-gray-600 font-semibold">CUSTOMER #</span>
                <span className="text-gray-800">{data.customerNumber || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase">Bill To</h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{data.CutomerName}</p>
              <p className="text-gray-600">{data.billingAddressLine1}</p>
              <p className="text-gray-600">{data.billingCity}, {data.billingState}</p>
              <p className="text-gray-600">{data.billingPostalCode}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase">Ship To</h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{data.CutomerName}</p>
              <p className="text-gray-600">{data.shippingAddressLine1}</p>
              <p className="text-gray-600">{data.shippingCity}, {data.shippingState}</p>
              <p className="text-gray-600">{data.shippingPostalCode}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">ITEM PART #</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">DESCRIPTION</th>
                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold">QTY</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold">UNIT PRICE</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => {
                const lineTotal = item.quantity * item.listPrice - item.discount;
                return (
                  <tr key={index} className="border-b">
                    <td className="border border-gray-300 px-3 py-2">{item.productName}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.description}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{symbol}{item.listPrice.toFixed(2)}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-semibold">{symbol}{lineTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-1/3 space-y-2 text-sm">
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-700 font-semibold">SUBTOTAL:</span>
              <span>{symbol}{data.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-700 font-semibold">TAX:</span>
              <span>{symbol}{data.totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-gray-800 pt-2 font-bold">
              <span>TOTAL:</span>
              <span>{symbol}{data.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-b-8 border-orange-500 mt-8"></div>
      </div>
    );
  }
);

InvoiceTemplate1.displayName = "InvoiceTemplate1";
export default InvoiceTemplate1;
