import React, { useState, useMemo } from "react";
import LeadModal from "../../components/crm/LeadModal";

import Table from "../../components/ui/Table/Table";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
} from "../../components/ui/Table/ActionButton";
import type { Column } from "../../components/ui/Table/type";

interface Lead {
  id: string;
  name: string;
  contact: string;
  status: string;
  value: number;
  source: string;
}

interface LeadsProps {
  leads: Lead[];
  onAdd: () => void;
}

const Leads: React.FC<LeadsProps> = ({ leads, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const filteredLeads = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.id.toLowerCase().includes(term) ||
        lead.name.toLowerCase().includes(term) ||
        lead.contact.toLowerCase().includes(term) ||
        lead.status.toLowerCase().includes(term) ||
        lead.source.toLowerCase().includes(term) ||
        lead.value.toString().includes(term),
    );
  }, [leads, searchTerm]);

  // Add handler (opens modal in add mode)
  const handleAddClick = () => {
    setSelectedLead(null);
    setModalOpen(true);
    onAdd();
  };

  // Edit handler (opens modal in edit mode)
  const handleEditClick = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setModalOpen(true);
  };

  // Delete handler (add actual delete logic as needed)
  const handleDeleteClick = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete lead "${lead.name}"?`)) {
      alert("Delete functionality ready — connect to API later");
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  //columns definition can added
  const columns: Column<Lead>[] = [
    { key: "id", header: "Lead ID", align: "left" },
    { key: "name", header: "Company Name", align: "left" },
    { key: "contact", header: "Contact", align: "left" },
    {
      key: "status",
      header: "Status",
      align: "left",
      render: (l) => <StatusBadge status={l.status} />,
    },
    {
      key: "value",
      header: "Value",
      align: "right",
      render: (l) => (
        <span className="font-semibold">${l.value.toLocaleString()}</span>
      ),
    },
    {
      key: "source",
      header: "Source",
      align: "left",
      render: (l) => (
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {l.source}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (l) => (
        <ActionGroup>
          <ActionButton
            type="edit"
            onClick={(e: any) => handleEditClick(l, e)}
          />
          <ActionButton
            type="delete"
            onClick={(e: any) => handleDeleteClick(l, e)}
            variant="danger"
          />
        </ActionGroup>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {/* <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Lead
        </button> */}
      </div>

      <Table
        columns={columns}
        data={filteredLeads}
        showToolbar
        loading={false}
        emptyMessage={searchTerm ? "No matches found." : "No leads yet."}
        hoverable={true}
        zebraStripes={false}
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        enableAdd
        onAdd={handleAddClick}
        addLabel="Add Lead"
        enableColumnSelector
        // pagination forwarded into Table (Table will render Pagination inside card)
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      {/* Lead modal for add/edit */}
      <LeadModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        lead={selectedLead}
        onSubmit={(data) => {
          setModalOpen(false);
          // Save or update logic here (API/local state)
        }}
      />
    </div>
  );
};

export default Leads;
