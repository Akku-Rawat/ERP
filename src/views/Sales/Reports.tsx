import React, { useState } from "react";

type ReportRow = {
  date: string;
  salesOrder: string;
  invoiceNumber: string;
  sku: string;
  item: string;
  qty: string;
  uom: string;
  itemCategory: string;
  trademark: string;
};
const data: ReportRow[] = [
  { date: "09/29/2025 17:43", salesOrder: "SO-000002", invoiceNumber: "IN-000002", sku: "0001", item: "Casement window double (150x17C)", qty: "2.00", uom: "pcs", itemCategory: "Aluminum", trademark: "Default trademark" },
  { date: "09/29/2025 17:43", salesOrder: "SO-000002", invoiceNumber: "IN-000002", sku: "0001", item: "Casement window double (150x17C)", qty: "2.00", uom: "pcs", itemCategory: "Aluminum", trademark: "Default trademark" },
  { date: "09/29/2025 17:43", salesOrder: "SO-000002", invoiceNumber: "IN-000002", sku: "0080", item: "Shipping", qty: "1.00", uom: "pcs", itemCategory: "Internal services", trademark: "Default trademark" },
  { date: "10/04/2025 09:48", salesOrder: "SO-000006", invoiceNumber: "IN-000001", sku: "0001", item: "Casement window double (150x17C)", qty: "5.00", uom: "pcs", itemCategory: "Aluminum", trademark: "Default trademark" },
  { date: "10/04/2025 09:48", salesOrder: "SO-000006", invoiceNumber: "IN-000001", sku: "0080", item: "Shipping", qty: "1.00", uom: "pcs", itemCategory: "Internal services", trademark: "Default trademark" },
  { date: "10/04/2025 10:11", salesOrder: "SO-000009", invoiceNumber: "IN-000003", sku: "0130", item: "Window installation servicing on site", qty: "3.25", uom: "h", itemCategory: "Internal services", trademark: "Default trademark" }
];

export default function ReportTable() {
  const [showChart, setShowChart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleView = (row: ReportRow) => {
    alert(`Viewing details for invoice: ${row.invoiceNumber}`);
  };

  const handleExport = (row: ReportRow) => {
    alert(`Exporting data for invoice: ${row.invoiceNumber}`);
  };

  // Filter data based on search term
  const filteredData = data.filter(row => {
    const term = searchTerm.toLowerCase();
    return (
      row.date.toLowerCase().includes(term) ||
      row.salesOrder.toLowerCase().includes(term) ||
      row.invoiceNumber.toLowerCase().includes(term) ||
      row.sku.toLowerCase().includes(term) ||
      row.item.toLowerCase().includes(term) ||
      row.itemCategory.toLowerCase().includes(term) ||
      row.trademark.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-4 py-2 rounded w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowChart(v => !v)}
          >
            {showChart ? "Hide Charts" : "Charts"}
          </button>
        </div>
      </div>
      {showChart && (
        <div className="bg-gray-100 rounded-lg mb-4 p-4 text-center text-gray-800 border">
          <div className="font-semibold mb-2">Charts View</div>
          <svg height="100" width="300">
            <polyline
              fill="none"
              stroke="#6366F1"
              strokeWidth="3"
              points="0,80 60,50 120,75 180,30 240,60 300,40"
            />
          </svg>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Date and Time</th>
              <th className="p-2 text-left">Sales Order</th>
              <th className="p-2 text-left">Invoice Number</th>
              <th className="p-2 text-left">SKU</th>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-right">Qty</th>
              <th className="p-2 text-left">UOM</th>
              <th className="p-2 text-left">Item Category</th>
              <th className="p-2 text-left">Trademark</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr
                key={i}
                className={`hover:bg-blue-50 ${i === 0 ? "bg-blue-100 font-medium" : ""}`}
              >
                <td className="p-2">{row.date}</td>
                <td className="p-2 text-blue-600 underline cursor-pointer">{row.salesOrder}</td>
                <td className="p-2">{row.invoiceNumber}</td>
                <td className="p-2 text-center font-mono">{row.sku}</td>
                <td className="p-2">{row.item}</td>
                <td className="p-2 text-right">{row.qty}</td>
                <td className="p-2">{row.uom}</td>
                <td className="p-2">{row.itemCategory}</td>
                <td className="p-2">{row.trademark}</td>
                <td className="p-2 flex justify-center space-x-2">
                  <button className="text-blue-600 underline cursor-pointer" onClick={() => handleView(row)}>View</button>
                  <button className="text-green-600 underline cursor-pointer" onClick={() => handleExport(row)}>Export</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
