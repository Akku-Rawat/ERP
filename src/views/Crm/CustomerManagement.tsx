import React, { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import CustomerModal from "../../components/crm/CustomerModal";

export interface Customer {
  id: string;
  customer_name: string;
  customer_type: "Individual" | "Company";
  custom_customer_tpin?: string;  
  status: "active" | "inactive" | "prospect";
}

interface Props {
  initialCustomers?: Customer[];
}

const CustomerManagement: React.FC<Props> = ({ initialCustomers = [] }) => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return customers.filter(c =>
      c.id.toLowerCase().includes(term) ||
      c.customer_name.toLowerCase().includes(term) ||
      (c.custom_customer_tpin ?? "").toLowerCase().includes(term) ||
      c.status.includes(term)
    );
  }, [customers, searchTerm]);

  const openAdd = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setModalOpen(true);
  };

  const close = () => {
    setModalOpen(false);
    setEditingCustomer(null);
  };

   const handleSave = (data: {
    customer_name: string;
    customer_type: "Individual" | "Company";
    custom_customer_tpin: string;
    [key: string]: any;
  }) => {
    if (editingCustomer) {
      setCustomers(prev =>
        prev.map(c =>
          c.id === editingCustomer.id
            ? {
                ...c,
                customer_name: data.customer_name,
                customer_type: data.customer_type,
                custom_customer_t_tpin: data.customer_type === "Company" ? data.custom_customer_tpin : undefined,
              }
            : c
        )
      );
    } else {
      const newCust: Customer = {
        id: `C${Date.now().toString().slice(-6)}`,
        customer_name: data.customer_name,
        customer_type: data.customer_type,
        custom_customer_tpin: data.customer_type === "Company" ? data.custom_customer_tpin : undefined,
        status: "prospect",
      };
      setCustomers(prev => [...prev, newCust]);
    }
    close();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this customer?")) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" /> Add Customer
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Customer Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">TPIN</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{c.id}</td>
                <td className="px-4 py-2 font-semibold">{c.customer_name}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    c.customer_type === "Company" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                  }`}>
                    {c.customer_type}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {c.custom_customer_tpin ? (
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{c.custom_customer_tpin}</code>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      c.status === "active"
                        ? "bg-green-100 text-green-800"
                        : c.status === "inactive"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button onClick={() => openEdit(c)} className="text-indigo-600" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="ml-2 text-red-600" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No matches." : "No customers yet."}
          </div>
        )}
      </div>

      {/* Modal */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={close}
        onSubmit={handleSave}
        initialData={
          editingCustomer
            ? {
                customer_name: editingCustomer.customer_name,
                customer_type: editingCustomer.customer_type,
                custom_customer_tpin: editingCustomer.custom_customer_tpin || "",
                // Optional fields – modal doesn't require them
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                website: "",
                billingAddress: "",
                shippingAddress: "",
                taxId: "",
                notes: "",
              }
            : undefined
        }
        isEditMode={!!editingCustomer}
      />
    </div>
  );
};

export default CustomerManagement;