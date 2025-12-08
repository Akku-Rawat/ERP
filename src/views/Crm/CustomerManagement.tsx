import React, { useState, useEffect } from "react";
import CustomerDetailView from "./CustomerDetailView";
import toast from "react-hot-toast";

import {
  getAllCustomers,
  deleteCustomerById,
  getCustomerByCustomerCode,
} from "../../api/customerApi";

import CustomerModal from "../../components/crm/CustomerModal";

import type { CustomerSummary, CustomerDetail } from "../../types/customer";

import Table from "../../components/UI/Table/Table";                
import StatusBadge from "../../components/UI/Table/StatusBadge";  
import ActionButton, { ActionGroup } from "../../components/UI/Table/ActionButton"; 

import type { Column } from "../../components/UI/Table/Table";



interface Props {
  onAdd: () => void;
}

const CustomerManagement: React.FC<Props> = ({ onAdd }) => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "detail">("table");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetail | null>(null);
  const [custLoading, setCustLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<CustomerDetail | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchCustomers = async () => {
    try {
      setCustLoading(true);
      const response = await getAllCustomers(page, pageSize);
      setCustomers(response.data);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalItems(response.pagination?.total || 1);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setCustLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize]);

  const handleDelete = async (customerId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!window.confirm(`Delete customer ${customerId}?`)) return;

    try {
      setCustLoading(true);
      await deleteCustomerById(customerId);
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      toast.success("Customer deleted successfully.");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete customer.");
    } finally {
      setCustLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setEditCustomer(null);
    setShowModal(true);
  };

  const handleEditCustomer = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const customer = await getCustomerByCustomerCode(id);
      console.log("customer: ", customer);
      setEditCustomer(customer.data ?? customer);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch customer:", err);
      alert("Unable to fetch full customer details.");
    }
  };

  const handleCustomerSaved = async () => {
    setShowModal(false);
    setEditCustomer(null);
    await fetchCustomers();
    toast.success(editCustomer ? "Customer updated!" : "Customer created!");
  };

  const filtered = customers.filter((c) =>
    [
      c.id,
      c.name,
      c.type,
      c.currency,
      c.onboardingBalance,
      c.tpin,
      c.displayName,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleRowClick = (customer: CustomerDetail) => {
    console.log("setSelectedCustomer", customer);
    setSelectedCustomer(customer);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("table");
    setSelectedCustomer(null);
  };

//columns definition for Table component can be added here 
const columns: Column<CustomerSummary>[] = [
  { key: "id", header: "Customer ID", align: "left" },
  { key: "name", header: "Name", align: "left" },
  {
    key: "type",
    header: "Type",
    align: "left",
    render: (c) => (
      <StatusBadge status={c.type} />
    ),
  },
  {
    key: "currency",
    header: "Currency",
    align: "left",
    render: (c) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{c.currency}</code>,
  },
  {
    key: "onboardingBalance",
    header: "Onboard Balance",
    align: "right",
    render: (c) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{c.onboardingBalance}</code>,
  },
  {
    key: "actions",
    header: "Actions",
    align: "center",
    render: (c) => (
      <ActionGroup>
        <ActionButton type="view" onClick={() => handleRowClick(c as any)} />
        <ActionButton type="edit" onClick={(e: any) => handleEditCustomer(c.id, e)} />
        <ActionButton type="delete" onClick={(e: any) => handleDelete(c.id, e)} variant="danger" />
      </ActionGroup>
    ),
  },
];




  return (
    <div className="p-4">
      {viewMode === "table" ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {/* <div className="relative w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div> */}

            {/* <button
              onClick={handleAddCustomer}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" /> Add Customer
            </button> */}
          </div>

          {custLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">Loading customers…</p>
            </div>
          ) : (
            <>
              {/* Table */}
  <Table
  columns={columns}
  data={filtered}
  showToolbar
  searchValue={searchTerm}
  onSearch={setSearchTerm}
  enableAdd
  addLabel="Add Customer"
  onAdd={handleAddCustomer}
  enableColumnSelector

  // pagination forwarded into Table (Table will render Pagination inside card)
  currentPage={page}
  totalPages={totalPages}
  pageSize={pageSize}
  totalItems={totalItems}
  onPageChange={setPage}

/>



             
            </>
          )}
        </>
      ) : selectedCustomer ? (
        <CustomerDetailView
          customer={selectedCustomer}
          customers={customers}
          onBack={handleBack}
          onCustomerSelect={handleRowClick}
          onAdd={onAdd}
          onEdit={handleEditCustomer}
        />
      ) : null}

      <CustomerModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditCustomer(null);
        }}
        onSubmit={handleCustomerSaved}
        initialData={editCustomer}
        isEditMode={!!editCustomer}
      />
    </div>
  );
};

export default CustomerManagement;
