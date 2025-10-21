import React, { useState } from "react";

interface InvoiceItem {
  product: string;
  quantity: number;
  uom: string;
  price: number;
}

interface InvoiceRow {
  id: string;
  poId: string;
  grId: string; // Related Goods Receipt
  supplier: string;
  invoiceDate: string;
  amount: number;
  invoiceItems: InvoiceItem[];
  amountPO: number;
  amountReceived: number;
  matchStatus: "Matched" | "Pending" | "Mismatch";
  remarks?: string;
}

interface InvoiceMatchingProps {
  onAdd: () => void;
}

const invoiceData: InvoiceRow[] = [
  {
    id: "INV-1001",
    poId: "PO-001",
    grId: "GR-1001",
    supplier: "TechSupply Co",
    invoiceDate: "2025-02-04",
    amount: 48000,
    invoiceItems: [
      { product: "Steel Bolts", quantity: 100, uom: "pcs", price: 300 },
      { product: "Gaskets", quantity: 50, uom: "pcs", price: 200 },
    ],
    amountPO: 48000,
    amountReceived: 48000,
    matchStatus: "Matched",
    remarks: "",
  },
  {
    id: "INV-1002",
    poId: "PO-002",
    grId: "GR-1002",
    supplier: "Office Solutions",
    invoiceDate: "2025-02-08",
    amount: 24000,
    invoiceItems: [
      { product: "Printer Paper", quantity: 500, uom: "sheets", price: 48 }
    ],
    amountPO: 23000,
    amountReceived: 13800,
    matchStatus: "Mismatch",
    remarks: "Invoice > Amount Received (Partial Delivery)",
  }
];

const InvoiceMatching: React.FC<InvoiceMatchingProps> = ({ onAdd }) => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = invoiceData.filter(
    r =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.poId.toLowerCase().includes(search.toLowerCase()) ||
      r.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search Invoices..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Add
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Invoice</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Matched PO</th>
              <th className="px-4 py-2 text-left">Goods Receipt</th>
              <th className="px-4 py-2 text-right">PO Amount</th>
              <th className="px-4 py-2 text-right">Received Value</th>
              <th className="px-4 py-2 text-right">Invoiced</th>
              <th className="px-4 py-2 text-center">Match Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <React.Fragment key={inv.id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{inv.id}</td>
                  <td className="px-4 py-2">{inv.supplier}</td>
                  <td className="px-4 py-2">{inv.invoiceDate}</td>
                  <td className="px-4 py-2">{inv.poId}</td>
                  <td className="px-4 py-2">{inv.grId}</td>
                  <td className="px-4 py-2 text-right">${inv.amountPO.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">${inv.amountReceived.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${inv.matchStatus === "Matched"
                        ? "bg-green-100 text-green-700"
                        : inv.matchStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"}`}>
                      {inv.matchStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="text-blue-700 hover:underline"
                      onClick={() => setExpanded(expanded === inv.id ? null : inv.id)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
                {expanded === inv.id && (
                  <tr>
                    <td colSpan={10} className="bg-blue-50">
                      <div className="my-2">
                        <div className="font-bold mb-2">Invoice Items</div>
                        <table className="w-full bg-white mb-4 shadow rounded">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Qty</th>
                              <th>UOM</th>
                              <th>Unit Price</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inv.invoiceItems.map((item, idx) => (
                              <tr key={idx} className="border-t">
                                <td>{item.product}</td>
                                <td>{item.quantity}</td>
                                <td>{item.uom}</td>
                                <td>${item.price.toLocaleString()}</td>
                                <td>${(item.price * item.quantity).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {inv.remarks && (
                          <div className="text-red-600 font-semibold">
                            {inv.remarks}
                          </div>
                        )}
                        <button className="mt-2 px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white">
                          {inv.matchStatus === "Mismatch" ? "Investigate" : "Match Confirmed"}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InvoiceMatching;
