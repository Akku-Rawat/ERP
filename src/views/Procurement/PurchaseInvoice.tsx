import React, { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import PurchaseInvoiceModal from "../../components/procurement/PurchaseInvoiceModal";

interface PurchaseInvoice {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  status: string;
  deliveryDate: string;
}

interface PurchaseInvoiceTableProps {
  onAdd?: () => void;
}

const initialOrders: PurchaseInvoice[] = [
  {
    id: "PO-001",
    supplier: "TechSupply Co",
    date: "2025-01-15",
    amount: 48000,
    status: "Approved",
    deliveryDate: "2025-02-01",
  },
  {
    id: "PO-002",
    supplier: "Office Solutions",
    date: "2025-01-16",
    amount: 23000,
    status: "Pending",
    deliveryDate: "2025-02-05",
  },
  {
    id: "PO-003",
    supplier: "Equipment Plus",
    date: "2025-01-17",
    amount: 72000,
    status: "Draft",
    deliveryDate: "2025-02-10",
  },
];

const PurchaseInvoiceTable: React.FC<PurchaseInvoiceTableProps> = ({
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<PurchaseInvoice | null>(null);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return initialOrders.filter(
      (po) =>
        po.id.toLowerCase().includes(term) ||
        po.supplier.toLowerCase().includes(term) ||
        po.status.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const handleAddClick = () => {
    setSelectedInvoice(null); // Clear selection for add
    setModalOpen(true);
    if (onAdd) onAdd();
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleEdit = (invoice: PurchaseInvoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInvoice(invoice); // Set selected invoice for edit
    setModalOpen(true);
  };

  const handleDelete = (invoice: PurchaseInvoice, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete Purchase Invoice "${invoice.id}"?`)) {
      // In a real app, remove from state or API
      alert("Delete functionality ready — connect to API later");
    }
  };

  return (
    <div className="p-6 bg-app">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search Orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add Invoice
          </button>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
            Export
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-4 text-left">PO ID</th>
              <th className="px-6 py-4 text-left">Supplier</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Delivery Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((invoice) => (
              <tr
                key={invoice.id}
                className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
              >
                <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                  {invoice.id}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {invoice.supplier}
                </td>
                <td className="px-6 py-4">{invoice.date}</td>
                <td className="px-6 py-4">
                  ${invoice.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      invoice.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : invoice.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4">{invoice.deliveryDate}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => handleEdit(invoice, e)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(invoice, e)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            {searchTerm
              ? "No Purchase Invoices match your search."
              : "No Purchase Invoices added yet."}
          </div>
        )}
      </div>
      {/* Pass selected invoice for add/edit */}
      <PurchaseInvoiceModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default PurchaseInvoiceTable;
