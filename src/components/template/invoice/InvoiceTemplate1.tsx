import React, { useRef, useState, forwardRef } from "react";
import { UploadCloud } from "lucide-react";
import type { Invoice } from "../../../types/invoice";

export interface InvoiceTemplate1Props {
  data: Invoice;
  companyLogoUrl?: string;
}

const InvoiceTemplate1 = forwardRef<HTMLDivElement, InvoiceTemplate1Props>(
  ({ data, companyLogoUrl }, ref) => {
    const [logo, setLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [signature, setSignature] = useState<string | null>(null);
    const signatureInputRef = useRef<HTMLInputElement>(null);
    const [signatureText, setSignatureText] = useState<string>("");
    const [signatureMode, setSignatureMode] = useState<"upload" | "type">(
      "upload",
    );

    const getCurrencySymbol = () => {
      switch (data.currencyCode) {
        case "ZMW":
          return "ZK";
        case "INR":
          return "₹";
        case "USD":
          return "$";
        default:
          return "";
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

    const subtotal = data.items.reduce(
      (sum, i) => sum + i.quantity * i.price - (i.discount ?? 0),
      0,
    );

    return (
      <div
        ref={ref}
        className="max-w-[260mm] bg-white p-8"
        style={{ minHeight: "297mm" }}
      >
        <div className="bg-blue-600 text-white px-6 py-4 mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded border-2 border-dashed border-white bg-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-400"
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

            <h1 className="text-2xl font-bold">
              Rolaface Software Pvt Limited
            </h1>
          </div>
        </div>

        <div className="mb-8">
          <p className="font-semibold text-gray-800">
            Rolaface Software Pvt Limited
          </p>
          <p className="text-sm text-gray-600">
            Your Trusted Technology Partner
          </p>
          <p className="text-sm text-gray-600">Business District, Tech Park</p>
          <p className="text-sm text-gray-600">City, State 000000</p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Bill To</h3>
            <p className="font-semibold text-gray-800">{data.customerId}</p>
            <p className="text-sm text-gray-600">
              {data.billingAddress.line1}
            </p>
            <p className="text-sm text-gray-600">
              {data.billingAddress.city}, {data.billingAddress.state}{" "}
              {data.billingAddress.postalCode}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-2">Ship To</h3>
            <p className="font-semibold text-gray-800">{data.customerId}</p>
            <p className="text-sm text-gray-600">
              {data.shippingAddress.line1}
            </p>
            <p className="text-sm text-gray-600">
              {data.shippingAddress.city}, {data.shippingAddress.state}{" "}
              {data.shippingAddress.postalCode}
            </p>
          </div>

          <div className="text-right space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="font-bold text-gray-700">Invoice #</span>
              <span>{data.invoiceNumber}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="font-bold text-gray-700">Invoice Date</span>
              <span>
                {new Date(data.dateOfInvoice).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="font-bold text-gray-700">Due Date</span>
              <span>
                {data.dueDate
                  ? new Date(data.dueDate).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-t border-b border-gray-400">
                <th className="px-4 py-3 text-left text-sm font-bold">QTY</th>
                <th className="px-4 py-3 text-left text-sm font-bold">
                  DESCRIPTION
                </th>
                <th className="px-4 py-3 text-right text-sm font-bold">
                  UNIT PRICE
                </th>
                <th className="px-4 py-3 text-right text-sm font-bold">
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => {
                const amount =
                  item.quantity * item.price - (item.discount ?? 0);

                return (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3 text-right">
                      {item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-80 space-y-2">
            <div className="flex justify-between text-lg font-bold border-t-2 border-gray-400 pt-3">
              <span>TOTAL</span>
              <span>
                {symbol}
                {subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-12">
          <div className="w-80">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              Authorized Signature
            </h3>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setSignatureMode("upload")}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  signatureMode === "upload"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Upload
              </button>

              <button
                onClick={() => setSignatureMode("type")}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  signatureMode === "type"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Type
              </button>
            </div>

            {signatureMode === "upload" && (
              <div
                className="w-full h-24 border-2 border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-400 mb-2"
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
                    <span className="text-gray-500 text-xs">
                      Click to upload
                    </span>
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

            {signatureMode === "type" && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  placeholder="Type your signature..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm"
                />

                {signatureText && (
                  <div className="w-full h-24 border-2 border-gray-300 rounded bg-white flex items-center justify-center">
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

        <div className="border-t border-gray-300 pt-6 space-y-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Terms & Conditions</h3>
            <p className="text-sm text-gray-600">
              {data.terms?.selling?.general ??
                "Payment is due within 15 days"}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800">
              {data.paymentInformation.bankName}
            </p>
            <p className="text-sm text-gray-600">
              Account Number: {data.paymentInformation.accountNumber}
            </p>
            <p className="text-sm text-gray-600">
              Routing Number: {data.paymentInformation.routingNumber}
            </p>
            <p className="text-sm text-gray-600">
              SWIFT: {data.paymentInformation.swiftCode}
            </p>
          </div>
        </div>
      </div>
    );
  },
);

InvoiceTemplate1.displayName = "InvoiceTemplate1";
export default InvoiceTemplate1;
