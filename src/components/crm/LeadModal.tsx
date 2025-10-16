import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface FormData {
  // Lead Information
  leadOwner: string;
  firstName: string;
  title: string;
  phone: string;
  mobile: string;
  leadSource: string;
  industry: string;
  annualRevenue: number;
  emailOptOut: boolean;
  company: string;
  lastName: string;
  email: string;
  fax: string;
  website: string;
  leadStatus: string;
  noOfEmployees: number;
  rating: string;
  skypeID: string;
  secondaryEmail: string;
  twitter: string;
  // Address Information
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // Description Information
  description: string;
  // Image
  file: File | null;
}

const emptyForm: FormData = {
  leadOwner: "",
  firstName: "",
  title: "",
  phone: "",
  mobile: "",
  leadSource: "",
  industry: "",
  annualRevenue: 0,
  emailOptOut: false,
  company: "",
  lastName: "",
  email: "",
  fax: "",
  website: "",
  leadStatus: "",
  noOfEmployees: 0,
  rating: "",
  skypeID: "",
  secondaryEmail: "",
  twitter: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  description: "",
  file: null,
};

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [openSections, setOpenSections] = useState({
    leadInfo: true,
    addressInfo: true,
    descriptionInfo: true,
    leadImage: true,
  });

  const toggleSection = (name: keyof typeof openSections) =>
    setOpenSections((s) => ({ ...s, [name]: !s[name] }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setForm(emptyForm);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="rounded-lg bg-white w-[96vw] max-w-6xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
        >
          <form className="pb-2 bg-[#fefefe]/10 flex flex-col flex-1 overflow-hidden" onSubmit={handleSubmit}>
            <div className="flex h-12 items-center justify-between border-b px-6 py-3 rounded-t-lg bg-blue-100/30 shrink-0">
              <h3 className="text-2xl w-full font-semibold text-blue-600">
                Create Lead
              </h3>
              <button type="button" className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8" onClick={onClose}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto border-b px-4">
              {/* LEAD IMAGE */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-6 mb-3"
                  onClick={() => toggleSection("leadImage")}
                >
                  <span className="mr-2">LEAD IMAGE</span>
                  <span className="ml-auto">{openSections.leadImage ? "▾" : "▸"}</span>
                </div>
                {openSections.leadImage && (
                  <div className="flex items-center gap-4">
                    <input type="file" accept="image/*" onChange={handleFile} className="block" />
                    {form.file && <span className="text-xs text-green-700">{form.file.name}</span>}
                  </div>
                )}
              </div>

              {/* LEAD INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-6 mb-3"
                  onClick={() => toggleSection("leadInfo")}
                >
                  <span className="mr-2">LEAD INFORMATION</span>
                  <span className="ml-auto">{openSections.leadInfo ? "▾" : "▸"}</span>
                </div>
                {openSections.leadInfo && (
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <input className="col-span-1 border rounded p-2" placeholder="Lead Owner" name="leadOwner" value={form.leadOwner} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Title" name="title" value={form.title} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Lead Source" name="leadSource" value={form.leadSource} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Industry" name="industry" value={form.industry} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="number" placeholder="Annual Revenue" name="annualRevenue" value={form.annualRevenue} onChange={handleChange} />
                    <div className="col-span-1 flex items-center">
                      <input type="checkbox" className="mr-2" name="emailOptOut" checked={form.emailOptOut} onChange={handleChange} />
                      <label>Email Opt Out</label>
                    </div>
                    <input className="col-span-1 border rounded p-2" placeholder="Company" name="company" value={form.company} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Fax" name="fax" value={form.fax} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Website" name="website" value={form.website} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Lead Status" name="leadStatus" value={form.leadStatus} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="number" placeholder="No. of Employees" name="noOfEmployees" value={form.noOfEmployees} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Rating" name="rating" value={form.rating} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Skype ID" name="skypeID" value={form.skypeID} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="email" placeholder="Secondary Email" name="secondaryEmail" value={form.secondaryEmail} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Twitter" name="twitter" value={form.twitter} onChange={handleChange} />
                  </div>
                )}
              </div>

              {/* ADDRESS INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-6 mb-3"
                  onClick={() => toggleSection("addressInfo")}
                >
                  <span className="mr-2">ADDRESS INFORMATION</span>
                  <span className="ml-auto">{openSections.addressInfo ? "▾" : "▸"}</span>
                </div>
                {openSections.addressInfo && (
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    <input className="col-span-1 border rounded p-2" placeholder="Street" name="street" value={form.street} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="City" name="city" value={form.city} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="State" name="state" value={form.state} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Zip Code" name="zipCode" value={form.zipCode} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Country" name="country" value={form.country} onChange={handleChange} />
                  </div>
                )}
              </div>

              {/* DESCRIPTION INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-6 mb-3"
                  onClick={() => toggleSection("descriptionInfo")}
                >
                  <span className="mr-2">DESCRIPTION INFORMATION</span>
                  <span className="ml-auto">{openSections.descriptionInfo ? "▾" : "▸"}</span>
                </div>
                {openSections.descriptionInfo && (
                  <div className="mb-6">
                    <textarea className="border rounded p-2 w-full h-32" placeholder="Description" name="description" value={form.description} onChange={handleChange} />
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <button type="button" className="border rounded p-2 text-sm">Create Form Views</button>
                      <button type="button" className="border rounded p-2 text-sm">Standard View</button>
                      <button type="button" className="border rounded p-2 text-sm">Create a custom form page</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="m-3 flex items-center justify-between gap-x-7 shrink-0">
              <button type="button"
                className="w-24 rounded-3xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
              <div className="flex gap-x-2">
                <button
                  type="submit"
                  className="w-24 rounded-3xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="w-24 rounded-3xl bg-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-500 hover:text-white"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LeadModal;