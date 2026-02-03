import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaChartBar, FaFileExport, FaFileCsv } from "react-icons/fa";

/* ===== TYPES & DATA (UNCHANGED) ===== */

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
  {
    date: "09/29/2025 17:43",
    salesOrder: "SO-000002",
    invoiceNumber: "IN-000002",
    sku: "0001",
    item: "Casement window double (150x17C)",
    qty: "2.00",
    uom: "pcs",
    itemCategory: "Aluminum",
    trademark: "Default trademark",
  },
  {
    date: "09/29/2025 17:43",
    salesOrder: "SO-000002",
    invoiceNumber: "IN-000002",
    sku: "0001",
    item: "Casement window double (150x17C)",
    qty: "2.00",
    uom: "pcs",
    itemCategory: "Aluminum",
    trademark: "Default trademark",
  },
  {
    date: "09/29/2025 17:43",
    salesOrder: "SO-000002",
    invoiceNumber: "IN-000002",
    sku: "0080",
    item: "Shipping",
    qty: "1.00",
    uom: "pcs",
    itemCategory: "Internal services",
    trademark: "Default trademark",
  },
  {
    date: "10/04/2025 09:48",
    salesOrder: "SO-000006",
    invoiceNumber: "IN-000001",
    sku: "0001",
    item: "Casement window double (150x17C)",
    qty: "5.00",
    uom: "pcs",
    itemCategory: "Aluminum",
    trademark: "Default trademark",
  },
  {
    date: "10/04/2025 09:48",
    salesOrder: "SO-000006",
    invoiceNumber: "IN-000001",
    sku: "0080",
    item: "Shipping",
    qty: "1.00",
    uom: "pcs",
    itemCategory: "Internal services",
    trademark: "Default trademark",
  },
  {
    date: "10/04/2025 10:11",
    salesOrder: "SO-000009",
    invoiceNumber: "IN-000003",
    sku: "0130",
    item: "Window installation servicing on site",
    qty: "3.25",
    uom: "h",
    itemCategory: "Internal services",
    trademark: "Default trademark",
  },
];

const COLORS = [
  "#6366F1",
  "#4f8efa",
  "#F59E42",
  "#65A30D",
  "#EA580C",
  "#8B5CF6",
];

/* ===== CSV EXPORT (UNCHANGED) ===== */

function exportToCsv(rows: ReportRow[], filename: string) {
  const header = Object.keys(rows[0]).join(",") + "\n";
  const body = rows
    .map((row) =>
      Object.values(row)
        .map((s) => `"${String(s).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([header + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportTable() {
  const [showChart, setShowChart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    itemCategory: "All",
    salesOrder: "All",
  });

  const uniqueCategories = Array.from(new Set(data.map((d) => d.itemCategory)));
  const uniqueSalesOrders = Array.from(new Set(data.map((d) => d.salesOrder)));

  function dateStringForInput(date: string) {
    const [month, day, yearAndTime] = date.split("/");
    const [year] = yearAndTime.split(" ");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const filteredData = data.filter((row) => {
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
    if (
      filters.itemCategory !== "All" &&
      row.itemCategory !== filters.itemCategory
    )
      return false;
    if (filters.salesOrder !== "All" && row.salesOrder !== filters.salesOrder)
      return false;

    return true;
  });

  const categoryChart = uniqueCategories.map((cat) => ({
    name: cat,
    value: filteredData.reduce(
      (acc, curr) =>
        curr.itemCategory === cat ? acc + parseFloat(curr.qty) : acc,
      0,
    ),
  }));

  const byMonth: Record<string, number> = {};
  filteredData.forEach((row) => {
    const [d] = row.date.split(" ");
    const [month, , year] = d.split("/");
    const key = `${year}-${month}`;
    byMonth[key] = (byMonth[key] || 0) + parseFloat(row.qty);
  });

  const monthChart = Object.entries(byMonth).map(([month, value]) => ({
    month,
    value,
  }));

  return (
    <div className="mx-auto mt-8 mb-12 p-6 bg-card rounded-2xl border border-theme">
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4">
        <div className="flex flex-wrap gap-3 items-center w-full">
          <input
            className="filter-input-refined sm:max-w-xs"
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="date"
            className="filter-input-refined"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters((f) => ({ ...f, dateFrom: e.target.value }))
            }
          />

          <input
            type="date"
            className="filter-input-refined"
            value={filters.dateTo}
            onChange={(e) =>
              setFilters((f) => ({ ...f, dateTo: e.target.value }))
            }
          />

          <select
            className="filter-input-refined"
            value={filters.itemCategory}
            onChange={(e) =>
              setFilters((f) => ({ ...f, itemCategory: e.target.value }))
            }
          >
            <option value="All">All Categories</option>
            {uniqueCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            className="filter-input-refined"
            value={filters.salesOrder}
            onChange={(e) =>
              setFilters((f) => ({ ...f, salesOrder: e.target.value }))
            }
          >
            <option value="All">All Sales Orders</option>
            {uniqueSalesOrders.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              filteredData.length &&
              exportToCsv(filteredData, "filtered_report.csv")
            }
            className="bg-success text-success px-3 py-2 rounded-lg text-sm flex items-center gap-1"
          >
            <FaFileCsv /> Export
          </button>

          <button
            onClick={() => setShowChart((v) => !v)}
            className="bg-primary p-2 rounded-lg"
          >
            <FaChartBar className="text-white" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {showChart ? (
        <div className="bg-app border border-theme rounded-xl p-4 flex flex-wrap gap-6 justify-evenly">
          <div className="w-80">
            <div className="font-semibold text-center mb-2 text-main">
              Item Category
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categoryChart} dataKey="value" nameKey="name">
                  {categoryChart.map((e, i) => (
                    <Cell key={e.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-80">
            <div className="font-semibold text-center mb-2 text-main">
              Qty by Month
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthChart}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-theme rounded-xl">
          <table className="min-w-full">
            <thead className="table-head sticky top-0">
              <tr>
                {[
                  "Date",
                  "Sales Order",
                  "Invoice",
                  "SKU",
                  "Item",
                  "Qty",
                  "UOM",
                  "Category",
                  "Trademark",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="p-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
                <tr key={i} className="row-hover">
                  <td className="p-2">{row.date}</td>
                  <td className="p-2 text-primary">{row.salesOrder}</td>
                  <td className="p-2">{row.invoiceNumber}</td>
                  <td className="p-2 font-mono">{row.sku}</td>
                  <td className="p-2">{row.item}</td>
                  <td className="p-2 text-right">{row.qty}</td>
                  <td className="p-2">{row.uom}</td>
                  <td className="p-2">{row.itemCategory}</td>
                  <td className="p-2">{row.trademark}</td>
                  <td className="p-2 text-center">
                    <button
                      className="text-primary text-sm"
                      onClick={() =>
                        exportToCsv([row], `invoice_${row.invoiceNumber}.csv`)
                      }
                    >
                      <FaFileExport />
                    </button>
                  </td>
                </tr>
              ))}
              {!filteredData.length && (
                <tr>
                  <td
                    colSpan={10}
                    className="py-8 text-center text-muted"
                  >
                    No records found
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
