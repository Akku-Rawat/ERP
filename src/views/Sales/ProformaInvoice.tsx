import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { getSalesInvoiceById, updateInvoiceStatus } from "../../api/salesApi";
import {
  getAllProformaInvoices,
  updateProformaInvoiceStatus,
  getProformaInvoiceById,
} from "../../api/proformaInvoiceApi";
import type {
  ProformaInvoice,
  ProformaInvoiceSummary,
} from "../../types/proformaInvoice";
import { Trash2 } from "lucide-react";
import InvoiceTemplate1 from "../../components/template/invoice/InvoiceTemplate1";

type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Overdue";

const ProformaInvoicesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [proformaInvoices, setProformaInvoices] = useState<
    ProformaInvoiceSummary[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedProformaInvoice, setSelectedProformaInvoice] =
    useState<ProformaInvoice | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const fetchProformaInvoices = async () => {
    try {
      setLoading(true);
      const res = await getAllProformaInvoices(page, pageSize);
      if (!res || res.status_code !== 200) return;

      const mapped: ProformaInvoiceSummary[] = res.data.map((proInv: any) => ({
        proformaId: proInv.proformaId,
        customerName: proInv.customerName,
        currency: proInv.currency,
        exchangeRate: proInv.exchangeRate,
        dueDate: proInv.dueDate,
        totalAmount: Number(proInv.totalAmount),
        status: proInv.status,
        createdAt: new Date(proInv.createdAt.replace(" ", "T")),
      }));

      setProformaInvoices(mapped);
      setTotalPages(res.pagination?.total_pages || 1);
      setTotalItems(res.pagination?.total || mapped.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProformaInvoices();
  }, [page, pageSize]);

  const handleViewClick = async (proInv: ProformaInvoiceSummary) => {
    const res = await getProformaInvoiceById(proInv.proformaId);
    if (!res || res.status_code !== 200) return;
    setSelectedProformaInvoice(res.data);
    setViewOpen(true);
  };

  const handleDelete = async (proformaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete invoice ${proformaId}?`)) return;
    console.log("Delete invoice:", proformaId);
  };

  const handleRowStatusChange = async (
    proformaId: string,
    status: InvoiceStatus
  ) => {
    const res = await updateInvoiceStatus(proformaId, status);
    if (!res || res.status_code !== 200) return;

    setProformaInvoices((prev) =>
      prev.map((proInv) =>
        proInv.proformaId === proformaId ? { ...proInv, invoiceStatus: status } : proInv
      )
    );

    if (selectedProformaInvoice?.proformaId === proformaId) {
      setSelectedProformaInvoice({
        ...selectedProformaInvoice,
        invoiceStatus: status,
      });
    }
  };

  const handleDownload = (proformaId: string) => {
    console.log("Download proforma invoice:", proformaId);
  };

  const filteredInvoices = proformaInvoices.filter(
    (proInv) =>
      proInv.proformaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proInv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search proformaInvoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          <p className="mt-2 text-gray-600">Loading proformaInvoices...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg bg-white">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Invoice No</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((proInv) => (
                  <tr
                    key={proInv.proformaId}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{proInv.proformaId}</td>
                    <td className="px-4 py-2">{proInv.status}</td>
                    <td className="px-4 py-2">{proInv.customerName}</td>
                    <td className="px-4 py-2">
                      {proInv.createdAt.toLocaleString()}
                    </td>

                    <td className="px-4 py-2">
                      {proInv.dueDate
                        ? new Date(proInv.dueDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {proInv.currency} {proInv.totalAmount}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleViewClick(proInv)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </button>

                        <select
                          value={proInv.status}
                          onChange={(e) =>
                            handleRowStatusChange(
                              proInv.proformaId,
                              e.target.value as InvoiceStatus
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
                          onClick={() => handleDownload(proInv.proformaId)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Download
                        </button>

                        <button
                          onClick={(e) => handleDelete(proInv.proformaId, e)}
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
                      No proformaInvoices found
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

      {viewOpen && selectedProformaInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white w-[80vw] h-[95vh] rounded-lg shadow-xl overflow-auto">
            <div className="p-6">
              <InvoiceTemplate1 data={selectedProformaInvoice} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProformaInvoicesTable;
