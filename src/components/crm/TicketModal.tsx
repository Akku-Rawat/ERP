// components/modals/TicketModal.tsx
import React, { useEffect, useState } from "react";
import Modal from "../UI/modal/modal";
import { Input, Select, Textarea, Card, Button } from "../UI/modal/formComponent";
import { Ticket as TicketIcon, FileText, Check } from "lucide-react";

export interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: {
    id?: string | number;
    title?: string;
    customer?: string;
    priority?: string;
    status?: string;
    description?: string;
    [key: string]: any;
  } | null;
  onSubmit: (data: {
    title: string;
    customer: string;
    priority: string;
    status: string;
    description: string;
    id?: string | number;
  }) => void;
}

const emptyForm = {
  title: "",
  customer: "",
  priority: "",
  status: "",
  description: "",
};

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, ticket = null, onSubmit }) => {
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    // ensure controlled inputs never get undefined
    setForm(ticket ? { ...emptyForm, ...ticket } : { ...emptyForm });
  }, [ticket, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleReset = () => {
    setForm(ticket ? { ...emptyForm, ...ticket } : { ...emptyForm });
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    // minimal required-field check (optional)
    if (!form.title.trim() || !form.customer.trim() || !form.description.trim()) {
      alert("Please fill Title, Customer and Description.");
      return;
    }
    const payload = { ...form, id: ticket?.id };
    onSubmit(payload);
    // reset local state and close (parent may also close)
    setForm({ ...emptyForm });
    onClose();
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={() => { setForm({ ...emptyForm }); onClose(); }}>
        Cancel
      </Button>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="primary" onClick={handleSave} type="button" icon={<Check className="w-4 h-4" />}>
          {ticket ? "Update Ticket" : "Save Ticket"}
        </Button>
      </div>
    </>
  );

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { setForm({ ...emptyForm }); onClose(); }}
      title={ticket ? "Edit Ticket" : "Add Support Ticket"}
      subtitle={ticket ? "Update ticket details" : "Create a new support ticket"}
      icon={TicketIcon}
      footer={footer}
      maxWidth="4xl"
      height="85vh"
    >
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        <Card
          title="Ticket Details"
          subtitle="Essential ticket information"
          icon={<FileText className="w-5 h-5 text-primary" />}
        >
          <div className="space-y-5">
            <Input
              label="Ticket Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Brief description of the issue"
              icon={<TicketIcon className="w-4 h-4" />}
            />

            <Input
              label="Customer"
              name="customer"
              value={form.customer}
              onChange={handleChange}
              required
              placeholder="Customer name or ID"
              icon={<TicketIcon className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                required
                icon={<FileText className="w-4 h-4" />}
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>

              <Select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                icon={<FileText className="w-4 h-4" />}
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </Select>
            </div>

            <Textarea
              label="Description / Issue Details"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Provide detailed information about the issue..."
              className="h-32"
            />
          </div>
        </Card>
      </form>
    </Modal>
  );
};

export default TicketModal;
