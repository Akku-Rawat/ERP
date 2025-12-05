import React, { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import TicketModal from "../../components/crm/TicketModal"; 
import Table from "../../components/Table/Table";                
import StatusBadge from "../../components/Table/StatusBadge";   
import ActionButton, { ActionGroup } from "../../components/Table/ActionButton"; 
import type { Column } from "../../components/Table/Table";


interface Ticket {
  id: string;
  title: string;
  customer: string;
  priority: string;
  status: string;
  created: string;
}

interface TicketsProps {
  tickets: Ticket[];
  onAdd: () => void;
}

const SupportTickets: React.FC<TicketsProps> = ({ tickets, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

  const filteredTickets = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return tickets.filter(
      (t) =>
        t.id.toLowerCase().includes(term) ||
        t.title.toLowerCase().includes(term) ||
        t.customer.toLowerCase().includes(term) ||
        t.priority.toLowerCase().includes(term) ||
        t.status.toLowerCase().includes(term) ||
        t.created.toLowerCase().includes(term),
    );
  }, [tickets, searchTerm]);

  const handleAddClick = () => {
    setSelectedTicket(null);
    setModalOpen(true);
    onAdd();
  };

  const handleEditClick = (ticket: Ticket, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleDeleteClick = (ticket: Ticket, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete ticket "${ticket.title}"?`)) {
      alert("Delete functionality ready — connect to API later");
    }
  };

  const handleCloseModal = () => setModalOpen(false);
  //column defination for  table
  const columns: Column<Ticket>[] = [
  { key: "id", header: "Ticket ID", align: "left" },
  { key: "title", header: "Title", align: "left" },
  { key: "customer", header: "Customer", align: "left" },
  {
    key: "priority",
    header: "Priority",
    align: "left",
    render: (t) => <StatusBadge status={t.priority} />,
  },
  {
    key: "status",
    header: "Status",
    align: "left",
    render: (t) => <StatusBadge status={t.status} />,
  },
  {
    key: "created",
    header: "Created",
    align: "left",
    render: (t) => <span className="text-sm text-gray-600">{t.created}</span>,
  },
  {
    key: "actions",
    header: "Actions",
    align: "center",
    render: (t) => (
      <ActionGroup>
        <ActionButton type="edit" onClick={(e) => handleEditClick(t, e)} />
        <ActionButton type="delete" onClick={(e) => handleDeleteClick(t, e)} variant="danger" />
      </ActionGroup>
    ),
  },
];

  

  return (
    <div >
      <div className="flex items-center justify-between mb-6">
        
        
      </div>

      <Table
  columns={columns}
  data={filteredTickets}
  loading={false}
  showToolbar
  emptyMessage={searchTerm ? "No matches found." : "No tickets yet."}
  hoverable={true}
  zebraStripes={false}
    searchValue={searchTerm}
  onSearch={setSearchTerm}
  enableAdd
  addLabel="Add Ticket"
  onAdd={handleAddClick}
  enableColumnSelector
  onRowClick={(t: Ticket) => {
    setSelectedTicket(t);
    setModalOpen(true);
  }}

  currentPage={page}
  totalPages={totalPages}
  pageSize={pageSize}
  totalItems={totalItems}
  onPageChange={setPage}

/>









      {/* Modal for ticket add/edit */}
      <TicketModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        ticket={selectedTicket}
        onSubmit={(data) => {
          setModalOpen(false);
          // Save or update logic here
        }}
      />
    </div>
  );
};

export default SupportTickets;
