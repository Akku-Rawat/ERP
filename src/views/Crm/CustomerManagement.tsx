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

import Table from "../../components/ui/Table/Table";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";

import type { Column } from "../../components/ui/Table/type";

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
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [allCustomers, setAllCustomers] = useState<CustomerSummary[]>([]);


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


  const fetchAllCustomers = async () => {
  try {
    const resp = await getAllCustomers(1, 1000);
    setAllCustomers(resp.data || []);
  } catch (err) {
    console.error("Error loading all customers:", err);
  }
};

const ensureAllCustomers = async () => {
  if (!allCustomers.length) {
    await fetchAllCustomers();
  }
};


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

const handleRowClick = async (customer: CustomerSummary) => {
  try {
    setCustLoading(true);

    //  Ensure sidebar data loaded
    await ensureAllCustomers();

    //  Fetch full customer detail
    const res = await getCustomerByCustomerCode(customer.id);
    const fullCustomer = res.data ?? res;

    setSelectedCustomer(fullCustomer);
    setViewMode("detail");
  } catch (err) {
    console.error("Failed to load customer detail:", err);
    toast.error("Unable to load customer detail");
  } finally {
    setCustLoading(false);
  }
};


  const handleBack = () => {
    setViewMode("table");
    setSelectedCustomer(null);
  };

  // columns definition for Table component
  const columns: Column<CustomerSummary>[] = [
    { key: "id", header: "Customer ID", align: "left" },
    { key: "name", header: "Name", align: "left" },
    {
      key: "type",
      header: "Type",
      align: "left",
      render: (c: CustomerSummary) => <StatusBadge status={c.type} />,
    },
    {
      key: "customerTaxCategory",
      header: "TaxCategory",
      align: "left",
      render: (c: CustomerSummary) => (
        <StatusBadge status={c.customerTaxCategory} />
      ),
    },
    {
      key: "currency",
      header: "Currency",
      align: "left",
      render: (c: CustomerSummary) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          {c.currency}
        </code>
      ),
    },
    {
      key: "onboardingBalance",
      header: "Onboard Balance",
      align: "right",
      render: (c: CustomerSummary) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          {c.onboardingBalance}
        </code>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (c: CustomerSummary) => (
        <ActionGroup>
          <ActionButton
            type="view"
            onClick={() => handleRowClick(c)}
            iconOnly={false}
          />
          <ActionMenu
            onEdit={(e) => handleEditCustomer(c.id, e as any)}
            onDelete={(e) => handleDelete(c.id, e as any)}
          />
        </ActionGroup>
      ),
    },
  ];

  return (
    <div className="p-8">
      {viewMode === "table" ? (
        <>
          {custLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted">Loading customers…</p>
            </div>
          ) : (
            <Table
              columns={columns}
              data={customers}
              showToolbar
              loading={custLoading}
              onPageSizeChange={(size) => setPageSize(size)}
              pageSizeOptions={[10, 25, 50, 100]}
              searchValue={searchTerm}
              onSearch={setSearchTerm}
              enableAdd
              addLabel="Add Customer"
              onAdd={handleAddCustomer}
              enableColumnSelector
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
            />
          )}
        </>
      ) : selectedCustomer ? (
        <CustomerDetailView
          customer={selectedCustomer}
          customers={allCustomers}
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
