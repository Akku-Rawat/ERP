import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import {
  getAllSalesInvoices,
  getSalesInvoiceById,
  updateInvoiceStatus,
} from "../../api/salesApi";
import type { InvoiceSummary, Invoice } from "../../types/invoice";
import { Trash2 } from "lucide-react";
import InvoiceTemplate1 from "../../components/template/invoice/InvoiceTemplate1";

type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Overdue";

const InvoicesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getAllSalesInvoices(page, pageSize);
      if (!res || res.status_code !== 200) return;

      const mapped: InvoiceSummary[] = res.data.map((inv: any) => ({
        invoiceNumber: inv.invoiceNumber,
        customerName: inv.customerName,
        receiptNumber: inv.receiptNumber,
        currency: inv.currency,
        exchangeRate: inv.exchangeRate,
        dueDate: inv.dueDate,
        dateOfInvoice: new Date(inv.dateOfInvoice),
        Total: Number(inv.Total),
        totalTax: inv.totalTax,
        invoiceStatus: inv.invoiceStatus,
        invoiceTypeParent: inv.invoiceTypeParent,
        invoiceType: inv.invoiceType,
      }));

      setInvoices(mapped);
      setTotalPages(res.pagination?.total_pages || 1);
      setTotalItems(res.pagination?.total || mapped.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, pageSize]);

  const handleViewClick = async (inv: InvoiceSummary) => {
    const res = await getSalesInvoiceById(inv.invoiceNumber);
    if (!res || res.status_code !== 200) return;
    setSelectedInvoice(res.data);
    setViewOpen(true);
  };

  const handleDelete = async (invoiceNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete invoice ${invoiceNumber}?`)) return;
    console.log("Delete invoice:", invoiceNumber);
  };

  const handleRowStatusChange = async (
    invoiceNumber: string,
    status: InvoiceStatus,
  ) => {
    const res = await updateInvoiceStatus(invoiceNumber, status);
    if (!res || res.status_code !== 200) return;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceNumber === invoiceNumber
          ? { ...inv, invoiceStatus: status }
          : inv,
      ),
    );

    if (selectedInvoice?.invoiceNumber === invoiceNumber) {
      setSelectedInvoice({
        ...selectedInvoice,
        invoiceStatus: status,
      });
    }
  };

  const handleDownload = (invoiceNumber: string) => {
    console.log("Download invoice:", invoiceNumber);
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          <p className="mt-2 text-gray-600">Loading invoices...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg bg-white">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Invoice No</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.invoiceNumber}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{inv.invoiceNumber}</td>
                    <td className="px-4 py-2">{inv.invoiceStatus}</td>
                    <td className="px-4 py-2">{inv.invoiceType}</td>
                    <td className="px-4 py-2">{inv.customerName}</td>
                    <td className="px-4 py-2">
                      {inv.dateOfInvoice.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {inv.dueDate
                        ? new Date(inv.dueDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {inv.currency} {inv.Total.toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleViewClick(inv)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </button>

                        <select
                          value={inv.invoiceStatus}
                          onChange={(e) =>
                            handleRowStatusChange(
                              inv.invoiceNumber,
                              e.target.value as InvoiceStatus,
                            )
                          }
                          className="border rounded px-2 py-1 text-xs bg-white"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Overdue">Overdue</option>
                        </select>

                        <button
                          onClick={() => handleDownload(inv.invoiceNumber)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Download
                        </button>

                        <button
                          onClick={(e) =>
                            handleDelete(inv.invoiceNumber, e)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-400 py-6">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
          />
        </>
      )}

      {viewOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white w-[80vw] h-[95vh] rounded-lg shadow-xl overflow-auto">
            <div className="p-6">
              <InvoiceTemplate1 data={selectedInvoice} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesTable;
