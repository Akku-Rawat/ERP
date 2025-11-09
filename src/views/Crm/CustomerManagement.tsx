import React, { useState, useEffect} from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import CustomerDetailView from "./CustomerDetailView";
import axios from "axios"; 
import CustomerModal from "../../components/crm/CustomerModal";

const base_url = import.meta.env.VITE_BASE_URL;
const GET_CUSTOMER_ENDPOINT = `${base_url}.customer.customer.get_all_customers_api`;
const DELETE_CUSTOMER_ENDPOINT = `${base_url}.customer.customer.delete_customer_by_id`;
const UPDATE_CUSTOMER_ENDPOINT = `${base_url}.customer.customer.update_customer_by_id`;

interface Props {
  onAdd: () => void;  
}

const CustomerManagement: React.FC<Props> = ({onAdd}) => {
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
      const response = await fetch(GET_CUSTOMER_ENDPOINT, {
        headers: { Authorization: import.meta.env.VITE_AUTHORIZATION },
      });
      if (!response.ok) throw new Error("Failed to load customers");
      const result = await response.json();
      setCustomers(result.data || []);
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
  console.log("cust id " + custid);
  if (!custid) {
    alert("Cannot delete — custid not found for this customer.");
    return;
  }

  if (!window.confirm(`Are you sure you want to delete customer with custid ${id}?`)) return;

  try {
    setCustLoading(true);

    await axios.delete(`${DELETE_CUSTOMER_ENDPOINT}?id=${id}`, {
      headers: { Authorization: import.meta.env.VITE_AUTHORIZATION },
    });

    setCustomers((prev) => prev.filter((c) => c.custom_id !== id));
    alert("Customer deleted successfully.");
  } catch (err: any) {
    console.error("Error deleting customer:", err);
    const errorMsg = err.response?.data?.message || "Failed to delete customer.";
    alert(errorMsg);
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

  const handleEditCustomer = (customer: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditCustomer(customer);
    console.log("customer" + customer);
    setShowModal(true);
  };

  const handleCustomerSaved = (savedCustomer: any) => {
    if (editCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.custom_id === savedCustomer.custom_id ? savedCustomer : c
        )
      );
      console.log("Customer updated!");
    } else {
      setCustomers((prev) => [...prev, savedCustomer]);
      console.log("Customer created!");
    }

    setShowModal(false);
    setEditCustomer(null);
  };

// const handleSaveCustomer = async (data: any) => {
//     console.log("data " + data);
//   try {
//     setCustLoading(true);
//     console.log("data " + data);
//     if (editCustomer) {
//       const custid = editCustomer.custom_id;
//       if (!custid) {
//         alert("Cannot update — TPIN not found for this customer.");
//         return;
//       }
//       const response = await axios.put(
//         `${UPDATE_CUSTOMER_ENDPOINT}?id=${custid}`,
//         data,
//         {
//           headers: {
//             Authorization: import.meta.env.VITE_AUTHORIZATION,
//           },
//         }
//       );
//       const updatedCustomer = response.data?.data || { ...editCustomer, ...data };
//       setCustomers((prev) =>
//         prev.map((c) =>
//           c.custom_id === editCustomer.custom_id ? updatedCustomer : c
//         )
//       );
//       console.log("updatedCustomer " + updatedCustomer);
//       alert("Customer updated successfully!");
//     }
//   } catch (err: any) {
//     console.error("Error saving customer:", err);
//     const errorMsg = err.response?.data?.message || "Failed to save customer.";
//     alert(errorMsg);
//   } finally {
//     setCustLoading(false);
//     setShowModal(false);
//     setEditCustomer(null);
//   }
// };

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
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              c.customer_type === "Company"
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
