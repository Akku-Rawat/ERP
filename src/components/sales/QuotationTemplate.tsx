 import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = {
  name: string;
  qty: string;
  price: string;
  tax: string;
  amount: string;
};

export interface Quotation {
  id: string;
  customer: string;
  date: string;
  amount: number;
  opportunityStage: string;
}

interface QuotationTemplateProps {
  open: boolean;
  quotationData: Quotation;
  onClose: () => void;
}
 
const items: Item[] = [
  {
    name: "Apple normal",
    qty: "5 KG",
    price: "Rs. 100.00",
    tax: "Rs. 5.00 (5%)",
    amount: "Rs. 525.00",
  },
  {
    name: "Orange",
    qty: "10 KG",
    price: "Rs. 40.00",
    tax: "Rs. 2.00 (5%)",
    amount: "Rs. 420.00",
  },
  {
    name: "Banana",
    qty: "5 KG",
    price: "Rs. 40",
    tax: "Rs. 2.00 (5%)",
    amount: "Rs. 210.00",
  },
];
 
const QuotationTemplate: React.FC<QuotationTemplateProps> = ({
  open,
  quotationData,
  onClose,
}) => {
  if (!open) return null;

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          // className="relative flex w-[70vw] h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
          className="relative flex aspect-[1/1.414] w-[70vw] max-w-[210mm] max-h-[297mm] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
          style={{ height: "90vh" }}  
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 text-2xl text-gray-600 hover:text-gray-900"
            aria-label="Close"
          >
            ×
          </button>

          {/* ---------- SCROLLABLE CONTENT ---------- */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* ---- Header ---- */}
            <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row">
              <div>
                <h1 className="text-2xl font-extrabold text-[#0b4cff]">
                  Rolaface Software Pvt. Ltd.
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Shri Tower, Opp. JP Badminton Academy
                  <br />
                  Dehradun, Uttarakhand 248007
                  <br />
                  Phone: +91 9981278197
                  <br />
                  GSTIN: 08AALCR2857A1ZD
                </p>
              </div>

              <div className="text-right">
                <h2 className="text-3xl font-light">QUOTATION</h2>
                <div className="mt-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Quotation No:</span> 01
                  </div>
                  <div>
                    <span className="font-medium">Quotation Date:</span> 28 OCT 2025
                  </div>
                </div>
              </div>
            </div>

            {/* ---- To & Ship ---- */}
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              {/* QUOTATION TO */}
              <div>
                <div className="mb-3 inline-block bg-brand px-4 py-2 font-medium text-white">
                  QUOTATION TO
                </div>
                <div className="rounded border p-4 text-sm text-gray-700">
                  <div className="font-semibold">Sampath singh</div>
                  <div className="mt-2 text-xs">
                    04, KK Buildings, Ajmeri Gate, Jodhpur, Rajasthan
                  </div>
                  <div className="mt-2 text-xs">Pin: 304582</div>
                  <div className="mt-2 text-xs">Phone: +91 9981028177</div>
                  <div className="mt-2 text-xs">Place of Supply: Rajasthan</div>
                </div>
              </div>

              {/* SHIP TO */}
              <div>
                <div className="mb-3 inline-block bg-brand px-4 py-2 font-medium text-white">
                  SHIP TO
                </div>
                <div className="rounded border p-4 text-sm text-gray-700">
                  <div className="font-semibold">Sampath singh</div>
                  <div className="mt-2 text-xs">
                    06, BB Buildings, Pali Gate, Udaipur, Rajasthan
                  </div>
                  <div className="mt-2 text-xs">Pin: 305852</div>
                </div>
              </div>
            </div>

            {/* ---- Items Table ---- */}
            <div className="mb-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-brand text-black border-b">
                    <th className="px-4 py-3 text-left">Items</th>
                    <th className="px-4 py-3 text-left">Quantity</th>
                    <th className="px-4 py-3 text-left">Price per Unit</th>
                    <th className="px-4 py-3 text-left">Tax per Unit</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-3">{it.name}</td>
                      <td className="px-4 py-3">{it.qty}</td>
                      <td className="px-4 py-3">{it.price}</td>
                      <td className="px-4 py-3">{it.tax}</td>
                      <td className="px-4 py-3">{it.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ---- Sub‑total row ---- */}
            <div className="mb-6 flex items-center justify-between bg-brand px-4 py-2 text-white">
              <div className="font-medium">Sub Total</div>
              <div className="flex items-center gap-8">
                <div className="min-w-[90px]">20</div>
                <div className="min-w-[100px]">Rs. 55.00</div>
                <div className="min-w-[120px] font-semibold">
                  Rs. 1155.00
                </div>
              </div>
            </div>

            {/* ---- Bank + Totals ---- */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Bank Details */}
              <div>
                <h3 className="mb-2 font-semibold">Bank Details</h3>
                <div className="text-xs text-gray-700">
                  <div>Account holder: Akhilesh Rawat</div>
                  <div>Account number: 38028101723</div>
                  <div>Bank: Stanbic Bank</div>
                  <div>Branch: Lusaka</div>
                  <div>IFSC code: SBIN0002836</div> 

                  <div className="mt-4">
                    <h4 className="font-semibold">Notes</h4>
                    <p className="text-xs">1. No return deal</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold">Terms &amp; Conditions</h4>
                    <ol className="list-inside list-decimal text-xs">
                      <li>Customer will pay the GST</li>
                      <li>Customer will pay the Delivery charges</li>
                      <li>Pay due amount within 15 days</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="rounded border p-4">
                <div className="flex justify-between text-sm">
                  <div>Taxable Amount</div>
                  <div>Rs. 1100.00</div>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <div>CGST @2.5%</div>
                  <div>Rs. 27.50</div>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <div>SGST @2.5%</div>
                  <div>Rs. 27.50</div>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <div>Discount</div>
                  <div className="text-red-600">- Rs. 100.0</div>
                </div>

                <hr className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="font-semibold">Total Amount</div>
                  <div className="text-lg font-bold">Rs. 1055.00</div>
                </div>
              </div>
            </div>
 
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="flex h-32 items-end justify-center border p-8">
                <div className="text-center text-sm">Customer Signature</div>
              </div>
              <div className="flex h-32 items-end justify-center border p-8">
                <div className="text-right text-sm">
                  <div>Authorised Signatory For</div>
                  <div className="font-semibold">Rolaface Softwares Pvt. Ltd.</div>
                </div>
              </div>
            </div>
 
            <div className="mt-6 text-right text-xs text-gray-600">
              Thank You For Your Business !
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuotationTemplate;