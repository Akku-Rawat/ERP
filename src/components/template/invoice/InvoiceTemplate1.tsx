import React, { useRef, useState, forwardRef } from "react";
import { UploadCloud } from "lucide-react";

// --- Types ---
export interface InvoiceItem {
  productName: string;
  description: string;
  quantity: number;
  listPrice: number;
  discount: number;
  tax: number;
}

export interface InvoiceData {
  invoiceId?: string;
  CutomerName: string;
  subject?: string;
  dateOfInvoice: string;
  dueDate: string;
  estimateNo?: string;
  customerNumber?: string;
  currency: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  poNumber?: string;
  poDate?: string;
  letterOfCredit?: string;
  modeOfTransportation?: string;
  transportationTerms?: string;
  numberOfPackages?: string;
  declaredValue?: string;
  estimatedWeight?: string;
  carrier?: string;
  paymentTerms?: string;
  paymentMethod?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  items: InvoiceItem[];
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  adjustment: number;
  grandTotal: number;
  termsAndConditions?: string;
  notes?: string;
}

// --- Props Interface ---
export interface InvoiceTemplate1Props {
  data: InvoiceData;
  companyLogoUrl?: string;
}

// --- Component ---
const InvoiceTemplate1 = forwardRef<HTMLDivElement, InvoiceTemplate1Props>(
  ({ data, companyLogoUrl }, ref) => {
    const [logo, setLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [signature, setSignature] = useState<string | null>(null);
    const signatureInputRef = useRef<HTMLInputElement>(null);
    const [signatureText, setSignatureText] = useState<string>("");
    const [signatureMode, setSignatureMode] = useState<"upload" | "type">("upload");

    const getCurrencySymbol = () => {
      switch (data.currency) {
        case "ZMW": return "ZK";
        case "INR": return "₹";
        case "USD": return "$";
        default: return "₹";
      }
    };
    const symbol = getCurrencySymbol();

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => setLogo(ev.target?.result as string);
        reader.readAsDataURL(e.target.files[0]);
      }
    };

    const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => setSignature(ev.target?.result as string);
        reader.readAsDataURL(e.target.files[0]);
      }
    };

    return (
      <div
        ref={ref}
        className="max-w-[800mm] bg-white p-8 shadow-lg"
        style={{ minHeight: "297mm" }}
      >
        {/* Header  */}
        <div className="bg-blue-600 text-white px-6 py-4 mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Logo Upload */}
            <div
              className="w-16 h-16 rounded border-2 border-dashed border-white bg-blue-500 flex items-center justify-center cursor-pointer transition hover:bg-blue-400"
              onClick={() => fileInputRef.current?.click()}
            >
              {logo || companyLogoUrl ? (
                <img  
                  src={logo || companyLogoUrl}
                  alt="Logo"
                  className="w-14 h-14 object-contain rounded"
                />
              ) : (
                <UploadCloud className="w-6 h-6 text-white" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleLogoChange}
              />
            </div>
            <h1 className="text-2xl font-bold">Rolaface Software Pvt Limited</h1>
          </div>
        </div>

        {/* Company Address */}
        <div className="mb-8">
          <p className="font-semibold text-gray-800">Rolaface Software Pvt Limited</p>
          <p className="text-sm text-gray-600">Your Trusted Technology Partner</p>
          <p className="text-sm text-gray-600">Business District, Tech Park</p>
          <p className="text-sm text-gray-600">City, State 000000</p>
        </div>

        {/* Bill To, Ship To, Invoice Details */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Bill To</h3>
            <p className="font-semibold text-gray-800">{data.CutomerName}</p>
            <p className="text-sm text-gray-600">{data.billingAddressLine1}</p>
            <p className="text-sm text-gray-600">
              {data.billingCity}, {data.billingState} {data.billingPostalCode}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-2">Ship To</h3>
            <p className="font-semibold text-gray-800">{data.CutomerName}</p>
            <p className="text-sm text-gray-600">{data.shippingAddressLine1}</p>
            <p className="text-sm text-gray-600">
              {data.shippingCity}, {data.shippingState} {data.shippingPostalCode}
            </p>
          </div>

          <div className="text-right">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between gap-4">
                <span className="font-bold text-gray-700">Invoice #</span>
                <span className="text-gray-800">{data.invoiceId || "IN-001"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-bold text-gray-700">Invoice Date</span>
                <span className="text-gray-800">{data.dateOfInvoice}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-bold text-gray-700">P.O.#</span>
                <span className="text-gray-800">{data.poNumber || "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-bold text-gray-700">Due Date</span>
                <span className="text-gray-800">{data.dueDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-t border-b border-gray-400">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">QTY</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">DESCRIPTION</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">UNIT PRICE</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => {
                const lineTotal = item.quantity * item.listPrice - item.discount;
                return (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="px-4 py-3 text-sm text-gray-800">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-right">
                      {item.listPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-right">
                      {lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80 space-y-2">
            <div className="flex justify-between text-sm border-b border-gray-300 pb-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-800">
                {data.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm border-b border-gray-300 pb-2">
              <span className="text-gray-700">GST {((data.totalTax / data.subTotal) * 100).toFixed(1)}%</span>
              <span className="text-gray-800">
                {data.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-gray-400 pt-3">
              <span className="text-gray-800">TOTAL</span>
              <span className="text-gray-800">
                {symbol}{data.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="flex justify-end mb-12">
          <div className="w-80">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Authorized Signature</h3>

            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setSignatureMode("upload")}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  signatureMode === "upload"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setSignatureMode("type")}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  signatureMode === "type"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Type
              </button>
            </div>

            {/* Upload Mode */}
            {signatureMode === "upload" && (
              <div
                className="w-full h-24 border-2 border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center cursor-pointer transition hover:border-blue-400 mb-2"
                onClick={() => signatureInputRef.current?.click()}
              >
                {signature ? (
                  <img
                    src={signature}
                    alt="Signature"
                    className="h-20 object-contain max-w-full"
                  />
                ) : (
                  <div className="text-center">
                    <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-gray-500 text-xs">Click to upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={signatureInputRef}
                  onChange={handleSignatureChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Type Mode */}
            {signatureMode === "type" && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  placeholder="Type your signature..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
                />
                {signatureText && (
                  <div className="w-full h-24 border-2 border-gray-300 rounded bg-white flex items-center justify-center mb-2">
                    <p
                      className="text-3xl text-gray-800"
                      style={{ fontFamily: "Brush Script MT, cursive" }}
                    >
                      {signatureText}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="text-center text-sm text-gray-600 mt-2">
              <p className="font-semibold">Priya Chopra</p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="border-t border-gray-300 pt-6 space-y-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Terms & Conditions</h3>
            <p className="text-sm text-gray-600">
              {data.termsAndConditions || "Payment is due within 15 days"}
            </p>
          </div>

          {data.bankName && (
            <div>
              <p className="font-semibold text-gray-800">{data.bankName}</p>
              {data.accountNumber && (
                <p className="text-sm text-gray-600">Account Number: {data.accountNumber}</p>
              )}
              {data.routingNumber && (
                <p className="text-sm text-gray-600">Routing Number: {data.routingNumber}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

InvoiceTemplate1.displayName = "InvoiceTemplate1";
export default InvoiceTemplate1;
