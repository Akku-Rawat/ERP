import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import CustomerDetailView from "./CustomerDetailView";
import axios from "axios";
import CustomerModal from "../../components/crm/CustomerModal";
import toast from "react-hot-toast";

import {
  getAllCustomers,
  getCustomerByCustomerCode,
  deleteCustomerById,
} from "../../api/customerApi";

interface Props {
  onAdd: () => void;
}

const CustomerManagement: React.FC<Props> = ({ onAdd }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "detail">("table");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [custLoading, setCustLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<any | null>(null);

  const fetchCustomers = async () => {
    try {
      setCustLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setCustLoading(false);
    }
  };


  const handleDelete = async (custid: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const customerToDelete = customers.find((c) => c.custom_id === custid);
    if (!customerToDelete) return;

    const id = customerToDelete.custom_id;

    if (!window.confirm(`Are you sure you want to delete customer with custid ${id}?`)) return;

    try {
      setCustLoading(true);
      await deleteCustomerById(id);
      setCustomers((prev) => prev.filter((c) => c.custom_id !== id));
      alert("Customer deleted successfully.");
    } catch (err: any) {
      console.error("Error deleting customer:", err);
      const msg = err.response?.data?.message || "Failed to delete customer.";
      alert(msg);
    } finally {
      setCustLoading(false);
    }
  };


  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    setEditCustomer(null);
    setShowModal(true);
  };

  // const handleEditCustomer = async (custom_code: string, e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   try {
  //     const customer = await getCustomerByCustomerCode(custom_code);
  //     console.log("customer: ", customer);
  //     setEditCustomer(customer.data ?? customer);
  //     setShowModal(true);
  //   } catch (err) {
  //     console.error("Failed to fetch customer:", err);
  //     alert("Unable to fetch full customer details.");
  //   }
  // };

   const handleEditCustomer = (customer: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditCustomer(customer);
    console.log("customer" + customer);
    setShowModal(true);
  };

  const handleCustomerSaved = async () => {
    setShowModal(false);
    setEditCustomer(null);

    try {
      await fetchCustomers();
      toast.success(
        editCustomer
          ? "Customer updated successfully!"
          : "Customer created successfully!"
      );
    } catch (err) {
      toast.error("Failed to refresh customer list");
    }
  };

  const filtered = customers.filter((c: any) =>
    [c.custom_id, c.customer_name, c.customer_currency, c.customer_onboarding_balance, c.custom_customer_tpin,
    c.custom_billing_adress_line_1]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (customer: any) => {
    setSelectedCustomer(customer);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("table");
    setSelectedCustomer(null);
  };

  return (
    <div className="p-4">
      {viewMode === "table" ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleAddCustomer}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" /> Add Customer
            </button>
          </div>

          {custLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">Loading customers…</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full">
                  <thead className="bg-gray-100 text-gray-700 text-sm">
                    <tr>
                      <th className="px-4 py-3 text-left">Cust Id</th>
                      <th className="px-4 py-3 text-left">Customer Name</th>
                      <th className="px-4 py-3 text-left">Address</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Currency</th>
                      <th className="px-4 py-3 text-left">Onboard Balance</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((c) => (
                      <tr
                        key={c.custom_id}
                        onClick={() => handleRowClick(c)}
                        className="hover:bg-gray-50 cursor-pointer transition"
                      >
                        <td className="px-4 py-2 font-medium">{c.custom_id}</td>
                        <td className="px-4 py-2 font-semibold">{c.customer_name}</td>
                        <td className="px-4 py-2 font-medium">{c.custom_shipping_address_line_1}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${c.customer_type === "Company"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                              }`}
                          >
                            {c.customer_type}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {c.customer_currency ? (
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {c.customer_currency}
                            </code>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {c.customer_onboarding_balance ? (
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {c.customer_onboarding_balance}
                            </code>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={(e) => handleEditCustomer(c, e)}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(c.custom_id, e)}
                            className="ml-2 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
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
            </>
          )}
        </>
      ) : (
        <CustomerDetailView
          customer={selectedCustomer!}
          customers={customers}
          onBack={handleBack}
          onCustomerSelect={handleRowClick}
          onAdd={onAdd}
          onEdit={handleEditCustomer}
        />
      )}

      <CustomerModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditCustomer(null);
        }}
        // onSubmit={handleSaveCustomer}
        // initialData={editCustomer} 
        onSubmit={handleCustomerSaved}
        initialData={editCustomer}
        isEditMode={!!editCustomer}
      />
    </div>
  );
};

export default CustomerManagement;
