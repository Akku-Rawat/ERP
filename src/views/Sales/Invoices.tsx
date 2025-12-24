import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { getAllSalesInvoices, updateInvoiceStatus } from "../../api/salesApi";
import type { InvoiceSummary, Invoice } from "../../types/invoice";
import { Trash2, MoreVertical } from "lucide-react";
import { generateInvoicePDF } from "../../components/template/invoice/InvoiceTemplate1";
import PdfPreviewModal from "./PdfPreviewModal";

type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Overdue" | "Approved";

const STATUS_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  Draft: ["Pending", "Approved"],
  Pending: ["Paid", "Overdue"],
  Paid: [],
  Overdue: ["Paid"],
  Approved: ["Pending", "Paid", "Overdue"],
};

const CRITICAL_STATUSES: InvoiceStatus[] = ["Paid"];

const InvoicesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  const [openStatusMenuFor, setOpenStatusMenuFor] = useState<string | null>(
    null
  );

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
        total: Number(inv.totalAmount),
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

  const handleViewClick = (inv: InvoiceSummary) => {
    // TEMP until you load full invoice details
    const invoice = inv as unknown as Invoice;

    setSelectedInvoice(invoice);

    const url = generateInvoicePDF(invoice, "bloburl");
    setPdfUrl(url as string);
    setPdfOpen(true);
  };

  const handleDownload = (inv: InvoiceSummary) => {
    const invoice = inv as unknown as Invoice;
    generateInvoicePDF(invoice, "save");
  };

  const handleClosePdf = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setSelectedInvoice(null);
    setPdfOpen(false);
  };

  const handleRowStatusChange = async (
    invoiceNumber: string,
    status: InvoiceStatus
  ) => {
    if (
      CRITICAL_STATUSES.includes(status) &&
      !window.confirm(
        `Mark invoice ${invoiceNumber} as ${status}? This action cannot be undone.`
      )
    ) {
      return;
    }

    const res = await updateInvoiceStatus(invoiceNumber, status);
    if (!res || res.status_code !== 200) return;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceNumber === invoiceNumber
          ? { ...inv, invoiceStatus: status }
          : inv
      )
    );

    setOpenStatusMenuFor(null);
  };

  const handleDelete = async (invoiceNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete invoice ${invoiceNumber}?`)) return;
    console.log("Delete invoice:", invoiceNumber);
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.invoiceNumber}
                    className="border-t hover:bg-gray-50 relative"
                  >
                    <td className="px-4 py-2">{inv.invoiceNumber}</td>
                    <td className="px-4 py-2">{inv.invoiceType}</td>
                    <td className="px-4 py-2">{inv.customerName}</td>
                    <td className="px-4 py-2">
                      {new Date(inv.dateOfInvoice).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {inv.dueDate
                        ? new Date(inv.dueDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {inv.currency} {inv.total}
                    </td>

                    {/* STATUS + MENU (UNCHANGED) */}
                    <td className="px-4 py-2 relative">
                      <div className="flex items-center gap-2">
                        <span>{inv.invoiceStatus}</span>

                        <button
                          aria-haspopup="menu"
                          aria-expanded={
                            openStatusMenuFor === inv.invoiceNumber
                          }
                          onClick={() =>
                            setOpenStatusMenuFor(
                              openStatusMenuFor === inv.invoiceNumber
                                ? null
                                : inv.invoiceNumber
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setOpenStatusMenuFor(inv.invoiceNumber);
                            }
                            if (e.key === "Escape") {
                              setOpenStatusMenuFor(null);
                            }
                          }}
                          className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {openStatusMenuFor === inv.invoiceNumber && (
                        <div
                          role="menu"
                          className="absolute left-0 mt-2 z-50 w-40 bg-white border rounded-md shadow-lg text-sm"
                        >
                          {STATUS_TRANSITIONS[inv.invoiceStatus].map(
                            (status) => (
                              <button
                                key={status}
                                role="menuitem"
                                tabIndex={0}
                                onClick={() =>
                                  handleRowStatusChange(
                                    inv.invoiceNumber,
                                    status
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleRowStatusChange(
                                      inv.invoiceNumber,
                                      status
                                    );
                                  }
                                  if (e.key === "Escape") {
                                    setOpenStatusMenuFor(null);
                                  }
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-100"
                              >
                                Mark as {status}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleViewClick(inv)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(inv)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Download
                        </button>
                        <button
                          onClick={(e) => handleDelete(inv.invoiceNumber, e)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      <PdfPreviewModal
        open={pdfOpen}
        title="Invoice Preview"
        pdfUrl={pdfUrl}
        onClose={handleClosePdf}
        onDownload={() =>
          selectedInvoice && generateInvoicePDF(selectedInvoice, "save")
        }
      />
    </div>
  );
};

export default InvoicesTable;
