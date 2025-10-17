import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Legend, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Sector
} from "recharts";
import { FaChartBar, FaFileExport, FaFileCsv } from "react-icons/fa";

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

const COLORS = ["#6366F1", "#4f8efa", "#F59E42", "#65A30D", "#EA580C", "#8B5CF6"];

function exportToCsv(rows: ReportRow[], filename: string) {
  const header = Object.keys(rows[0]).join(",") + "\n";
  const body = rows
    .map(row => Object.values(row).map(s =>
      `"${String(s).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
  const csvContent = header + body;
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const renderPieLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, payload } = props;
  const name = payload?.name;
  const value = payload?.value;
  const RADIAN = Math.PI / 180;
  // Ensure values are numbers
  const cxNum = Number(cx), cyNum = Number(cy), outerNum = Number(outerRadius), angleNum = Number(midAngle);
  const x = cxNum + (outerNum + 16) * Math.cos(-angleNum * RADIAN);
  const y = cyNum + (outerNum + 16) * Math.sin(-angleNum * RADIAN);

  if (percent < 0.02) return null;
  return (
    <text
      x={x}
      y={y}
      fill="#334155"
      fontWeight="bold"
      textAnchor={x > cxNum ? "start" : "end"}
      dominantBaseline="central"
      fontSize={13}
      style={{ pointerEvents: "none" }}
    >
      {`${name}: ${value}`}
    </text>
  );
};

const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, value, percent
  } = props;
  const cxNum = Number(cx), cyNum = Number(cy), innerNum = Number(innerRadius), outerNum = Number(outerRadius);
  return (
    <g>
      <Sector
        cx={cxNum}
        cy={cyNum}
        fill={fill}
        innerRadius={innerNum}
        outerRadius={outerNum + 10}
        startAngle={startAngle}
        endAngle={endAngle}
      />
      <text x={cxNum} y={cyNum - 10} textAnchor="middle" fontWeight="bold" fill="#2d3a55">
        {payload?.name}
      </text>
      <text x={cxNum} y={cyNum + 16} textAnchor="middle" fontSize={14} fill="#6366F1">
        {`Qty: ${value}`}
      </text>
      <text x={cxNum} y={cyNum + 32} textAnchor="middle" fontSize={12} fill="#64748b">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

export default function ReportTable() {
  const [showChart, setShowChart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    itemCategory: "All",
    salesOrder: "All",
  });

  const uniqueCategories = Array.from(new Set(data.map(d => d.itemCategory)));
  const uniqueSalesOrders = Array.from(new Set(data.map(d => d.salesOrder)));

  function dateStringForInput(date: string) {
    const [month, day, yearAndTime] = date.split("/");
    const [year] = yearAndTime.split(" ");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const filteredData = data.filter(row => {
    const term = searchTerm.toLowerCase();
    if (
      term &&
      !(
        row.date.toLowerCase().includes(term) ||
        row.salesOrder.toLowerCase().includes(term) ||
        row.invoiceNumber.toLowerCase().includes(term) ||
        row.sku.toLowerCase().includes(term) ||
        row.item.toLowerCase().includes(term) ||
        row.itemCategory.toLowerCase().includes(term) ||
        row.trademark.toLowerCase().includes(term)
      )
    )
      return false;
    const rowDate = dateStringForInput(row.date);
    if (filters.dateFrom && rowDate < filters.dateFrom) return false;
    if (filters.dateTo && rowDate > filters.dateTo) return false;
    if (filters.itemCategory !== "All" && row.itemCategory !== filters.itemCategory) return false;
    if (filters.salesOrder !== "All" && row.salesOrder !== filters.salesOrder) return false;
    return true;
  });

  const categoryChart = uniqueCategories.map(cat => ({
    name: cat,
    value: filteredData.reduce((acc, curr) => curr.itemCategory === cat ? acc + parseFloat(curr.qty) : acc, 0),
  }));
  const uniqueTrademarks = Array.from(new Set(data.map(d => d.trademark)));
  const trademarkChart = uniqueTrademarks.map(tm => ({
    name: tm,
    value: filteredData.reduce((acc, curr) => curr.trademark === tm ? acc + parseFloat(curr.qty) : acc, 0),
  }));
  const byMonth: { [key: string]: number } = {};
  filteredData.forEach(row => {
    const [d, t] = row.date.split(" ");
    const [month, day, year] = d.split("/");
    const label = `${year}-${month}`;
    byMonth[label] = (byMonth[label] || 0) + parseFloat(row.qty);
  });
  const monthChart = Object.entries(byMonth).map(([month, value]) => ({
    month, value,
  }));

  const handleView = (row: ReportRow) => {
    alert(`Viewing details for invoice: ${row.invoiceNumber}`);
  };
  const handleRowExport = (row: ReportRow) => {
    exportToCsv([row], `invoice_${row.invoiceNumber}.csv`);
  };
  const handleExportAll = () => {
    if (filteredData.length === 0) return;
    exportToCsv(filteredData, "filtered_report.csv");
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 mb-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 justify-between items-center mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:max-w-xs focus:border-blue-400 transition"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            className="border border-gray-300 px-3 py-2 rounded-lg focus:border-blue-400"
            value={filters.dateFrom}
            onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
            title="Start Date"
          />
          <input
            type="date"
            className="border border-gray-300 px-3 py-2 rounded-lg focus:border-blue-400"
            value={filters.dateTo}
            onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
            title="End Date"
          />
          <select
            className="border border-gray-300 px-3 py-2 rounded-lg focus:border-blue-400"
            value={filters.itemCategory}
            onChange={e => setFilters(f => ({ ...f, itemCategory: e.target.value }))}
          >
            <option value="All">All Categories</option>
            {uniqueCategories.map(cat =>
              <option key={cat} value={cat}>{cat}</option>
            )}
          </select>
          <select
            className="border border-gray-300 px-3 py-2 rounded-lg focus:border-blue-400"
            value={filters.salesOrder}
            onChange={e => setFilters(f => ({ ...f, salesOrder: e.target.value }))}
          >
            <option value="All">All Sales Orders</option>
            {uniqueSalesOrders.map(order =>
              <option key={order} value={order}>{order}</option>
            )}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 text-sm"
            onClick={handleExportAll}
          >
            <FaFileCsv className="w-4 h-4" /> Export All
          </button>
          <button
            className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 focus:outline-none"
            aria-label="Toggle Charts"
            title={showChart ? "Show Table" : "Show Charts"}
            onClick={() => setShowChart(v => !v)}
          >
            <FaChartBar className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {showChart ? (
        <div className="bg-gray-50 rounded-xl mb-4 py-6 px-2 flex flex-wrap gap-8 justify-evenly border border-gray-200 shadow-sm">
          <div className="w-80">
            <div className="font-semibold mb-2 text-center">Item Category</div>
            <ResponsiveContainer width="100%" height={240}>
               <PieChart>
                <Pie
     data={categoryChart}
     dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      innerRadius={40}
     outerRadius={80}
    isAnimationActive
    >
     {categoryChart.map((entry, idx) => (
    <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
    ))}
  </Pie>
    <Tooltip
  formatter={(val: any, name: any, props: any) => [`${val}`, `${props.payload.name}`]}
  contentStyle={{
    background: "#fff", borderRadius: 6, boxShadow: "0 1px 8px #0003"
  }}
/>

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-80">
            <div className="font-semibold mb-2 text-center">Trademark</div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
               <Pie
                      data={trademarkChart}
                     dataKey="value"
                     nameKey="name"
                     cx="50%"
                     cy="50%"
                     innerRadius={40}
                   outerRadius={80}
                   isAnimationActive
                    >
                    {trademarkChart.map((entry, idx) => (
             <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                   ))}
                    </Pie>
         <Tooltip
             formatter={(val: any, name: any, props: any) => [`${val}`, `${props.payload.name}`]}
                   contentStyle={{
                   background: "#fff", borderRadius: 6, boxShadow: "0 1px 8px #0003"
           }}
            />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-80">
            <div className="font-semibold mb-2 text-center">Qty by Month</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthChart}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="min-w-full border-collapse">
            <thead className="bg-gradient-to-r from-gray-100 to-blue-50 sticky top-0 z-10">
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
                <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
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
                    <button className="text-blue-600 hover:underline" onClick={() => handleView(row)} title="View Details">View</button>
                    <button className="text-green-600 hover:underline flex items-center gap-1" onClick={() => handleRowExport(row)} title="Export Row">
                      <FaFileExport className="w-4 h-4" /> Export
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
