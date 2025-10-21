import React, { useState } from "react";

interface ReceiptItem {
  product: string;
  qtyOrdered: number;
  qtyReceived: number;
  uom: string;
  remarks?: string;
}

interface GoodsReceiptRow {
  id: string;
  poId: string;
  supplier: string;
  date: string;
  items: ReceiptItem[];
  status: "Draft" | "Received" | "Partially Received" | "Rejected";
  receivedBy: string;
  docUrl?: string;
}

interface GoodsReceiptProps {
  onAdd: () => void;
}

const initialReceipts: GoodsReceiptRow[] = [
  {
    id: "GR-1001",
    poId: "PO-001",
    supplier: "TechSupply Co",
    date: "2025-02-02",
    items: [
      { product: "Steel Bolts", qtyOrdered: 100, qtyReceived: 100, uom: "pcs" },
      { product: "Gaskets", qtyOrdered: 50, qtyReceived: 50, uom: "pcs" }
    ],
    status: "Received",
    receivedBy: "Priya Verma",
    docUrl: "",
  },
  {
    id: "GR-1002",
    poId: "PO-002",
    supplier: "Office Solutions",
    date: "2025-02-06",
    items: [
      { product: "Printer Paper", qtyOrdered: 500, qtyReceived: 300, uom: "sheets", remarks: "Partial, backorder" }
    ],
    status: "Partially Received",
    receivedBy: "Amit Shah",
    docUrl: "",
  },
];

const GoodsReceipt: React.FC<GoodsReceiptProps> = ({ onAdd }) => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = initialReceipts.filter(
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
          placeholder="Search Receipts..."
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
              <th className="px-4 py-2 text-left">Receipt ID</th>
              <th className="px-4 py-2 text-left">PO</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Items</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Received By</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <React.Fragment key={r.id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{r.id}</td>
                  <td className="px-4 py-2">{r.poId}</td>
                  <td className="px-4 py-2">{r.supplier}</td>
                  <td className="px-4 py-2">{r.date}</td>
                  <td className="px-4 py-2">
                    {r.items.length > 1 ? (
                      <button
                        onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                        className="text-blue-600 underline cursor-pointer"
                        title="Show/Hide Item Details"
                      >
                        {r.items.length} items
                      </button>
                    ) : (
                      <span>{r.items[0].product}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${r.status === "Received"
                        ? "bg-green-100 text-green-700"
                        : r.status === "Partially Received"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-600"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{r.receivedBy}</td>
                  <td className="px-4 py-2 text-center">
                    <button className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
                {/* Expand row for item-level detail */}
                {expanded === r.id && (
                  <tr>
                    <td colSpan={8} className="bg-blue-50">
                      <table className="w-full text-xs mt-2 mb-2">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Qty Ordered</th>
                            <th>Qty Received</th>
                            <th>UOM</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.items.map((it, i) => (
                            <tr key={i} className="border-t">
                              <td>{it.product}</td>
                              <td>{it.qtyOrdered}</td>
                              <td>{it.qtyReceived}</td>
                              <td>{it.uom}</td>
                              <td>{it.remarks || ""}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default GoodsReceipt;
