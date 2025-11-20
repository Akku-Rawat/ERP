import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSubmit: (data: any) => void;
}


export interface LeadFormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;

  title?: string;
  leadSource?: string;
  leadStatus?: string;
  annualRevenue?: number;
  noOfEmployees?: number;

  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  description?: string;
  file?: File | null;
}

const emptyForm: LeadFormData = {
  firstName: "", lastName: "", company: "", email: "", phone: "",
  title: "", leadSource: "", leadStatus: "", annualRevenue: undefined,
  noOfEmployees: undefined, street: "", city: "", state: "", zipCode: "", country: "",
  description: "", file: null,
};

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<LeadFormData>(emptyForm);
  const [openSections, setOpenSections] = useState({
    core: true, details: false, address: false, notes: false,
  });

  const toggleSection = (s: keyof typeof openSections) =>
    setOpenSections(p => ({ ...p, [s]: !p[s] }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value === "" ? undefined : value }));
  };

  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value === "" ? undefined : Number(value) }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, file: e.target.files?.[0] || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    setForm(emptyForm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form onSubmit={handleSubmit} className="flex flex-col h-full">

            {/* Header */}
            <header className="flex items-center justify-between border-b bg-indigo-50 px-6 py-3">
              <h3 className="text-xl font-semibold text-indigo-700">Create Lead</h3>
              <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-gray-200">
                ×
              </button>
            </header>

            {/* Scrollable Content */}
            <section className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* ==== LEAD INFORMATION – 3 COLUMNS ==== */}
              <Section title="Lead Information" open={openSections.core} onToggle={() => toggleSection("core")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input label="First Name *" name="firstName" value={form.firstName} onChange={handleChange} />
                  <Input label="Last Name *" name="lastName" value={form.lastName} onChange={handleChange} />
                  <Input label="Company *" name="company" value={form.company} onChange={handleChange} />
                  <Input label="Email *" type="email" name="email" value={form.email} onChange={handleChange} />
                  <Input label="Phone *" name="phone" value={form.phone} onChange={handleChange} />
                  <Input label="Job Title" name="title" value={form.title || ""} onChange={handleChange} />
                  <Select
                    label="Lead Source"
                    name="leadSource"
                    value={form.leadSource || ""}
                    onChange={handleChange}
                    options={[
                      { value: "", label: "-- None --" },
                      { value: "Web", label: "Web" },
                      { value: "Phone", label: "Phone Inquiry" },
                      { value: "Partner", label: "Partner Referral" },
                      { value: "Purchased List", label: "Purchased List" },
                    ]}
                  />
                  <Select
                    label="Lead Status"
                    name="leadStatus"
                    value={form.leadStatus || ""}
                    onChange={handleChange}
                    options={[
                      { value: "", label: "-- None --" },
                      { value: "New", label: "New" },
                      { value: "Contacted", label: "Contacted" },
                      { value: "Qualified", label: "Qualified" },
                      { value: "Lost", label: "Lost" },
                    ]}
                  />
                </div>
              </Section>

              {/* ==== COMPANY DETAILS – 2 COLUMNS ==== */}
              <Section title="Company Details" open={openSections.details} onToggle={() => toggleSection("details")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Annual Revenue" type="number" name="annualRevenue" value={form.annualRevenue ?? ""} onChange={handleNumber} placeholder="e.g. 500000" />
                  <Input label="No. of Employees" type="number" name="noOfEmployees" value={form.noOfEmployees ?? ""} onChange={handleNumber} />
                </div>
              </Section>

              {/* ==== ADDRESS – 2 COLUMNS ==== */}
              <Section title="Address Information" open={openSections.address} onToggle={() => toggleSection("address")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Street" name="street" value={form.street || ""} onChange={handleChange} />
                  <Input label="City" name="city" value={form.city || ""} onChange={handleChange} />
                  <Input label="State" name="state" value={form.state || ""} onChange={handleChange} />
                  <Input label="Zip Code" name="zipCode" value={form.zipCode || ""} onChange={handleChange} />
                  <Input label="Country" name="country" value={form.country || ""} onChange={handleChange} />
                </div>
              </Section>

              {/* ==== NOTES ==== */}
              <Section title="Description / Notes" open={openSections.notes} onToggle={() => toggleSection("notes")}>
                <textarea
                  className="w-full rounded border p-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  placeholder="Any additional notes about the lead..."
                />
              </Section>

              {/* ==== IMAGE (optional) ==== */}
              <div className="border-t pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Upload Lead Image (optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

            </section>

            {/* Footer */}
            <footer className="flex justify-between border-t bg-gray-50 px-6 py-3">
              <button type="button" onClick={onClose} className="rounded-full bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
                Cancel
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm(emptyForm)} className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400">
                  Reset
                </button>
                <button type="submit" className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  Save Lead
                </button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ---------- Reusable UI ---------- */
const Section: React.FC<{ title: string; open: boolean; onToggle: () => void; children: React.ReactNode }> = ({
  title, open, onToggle, children,
}) => (
  <div className="rounded-lg border bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between cursor-pointer select-none font-medium text-gray-700" onClick={onToggle}>
      <span>{title}</span>
      <span>{open ? "−" : "+"}</span>
    </div>
    {open && <div className="mt-4">{children}</div>}
  </div>
);

const Input: React.FC<{
  label: string; name: string; value: string | number | undefined; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string;
}> = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="font-medium text-gray-600">
      {label}
      {label.includes("*") && <span className="text-red-500 ml-1">*</span>}
    </span>
    <input
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
  </label>
);

const Select: React.FC<{
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}> = ({ label, name, value, onChange, options }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </label>
);

export default LeadModal;