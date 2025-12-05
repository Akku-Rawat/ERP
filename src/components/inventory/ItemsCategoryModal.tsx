import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";

const emptyForm: Record<string, any> = {
  // Supplier Details
  tpin: "",
  supplierName: "",
  supplierCode: "",
  paymentTerms: "",
  currency: "",
  bankAccount: "",

  // Contact Details
  contactPerson: "",
  phoneNo: "",
  alternateNo: "",
  emailId: "",

  // Payment Details
  dateOfAddition: "",
  openingBalance: "",

  // Bank Details
  accountNumber: "",
  accountHolder: "",
  sortCode: "",
  swiftCode: "",
  branchAddress: "",

  // Address
  billingAddressLine1: "",
  billingAddressLine2: "",
  billingCity: "",
  district: "",
  province: "",
  billingCountry: "",
  billingPostalCode: "",
};

const ItemsCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Record<string, any>) => void;
  initialData?: Record<string, any> | null;
  isEditMode?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const [form, setForm] = useState<Record<string, any>>(emptyForm);
  const [loading, setLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"type" | "tax">("type");

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
    setActiveTab("type");
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({ ...p, [name]: checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const reset = () => {
    setForm(initialData ?? emptyForm);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-indigo-50/70 border-b">
              <h2 className="text-2xl font-semibold text-indigo-700">
                {isEditMode ? "Edit Supplier" : "Add New Category"}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </header>

            {/* Tabs */}
            <div className="flex border-b bg-gray-50">
              <button
                type="button"
                onClick={() => setActiveTab("type")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "type"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Supplier Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tax")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "tax"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Payment & Bank
              </button>
            </div>

            {/* Tab Content */}
            <section className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Supplier Details Tab */}
              {activeTab === "type" && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 underline">
                      Category Type
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <Input
                        label="Type"
                        name="tpin"
                        value={form.type || ""}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Category Id"
                        name="categoryId"
                        value={form.categoryId || ""}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Category Description"
                        name="categoryDesc"
                        value={form.categoryDesc || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Unit of Measurement"
                        name="uom"
                        value={form.uom || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 underline">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <Input label="Contact Person Name" name="contactPerson" value={form.contactPerson || ""} onChange={handleChange} required />
                    <Input label="Phone No" name="phoneNo" value={form.phoneNo || ""} onChange={handleChange} />
                    <Input label="Alternate No" name="alternateNo" value={form.alternateNo || ""} onChange={handleChange} />
                    <Input label="Email Id" name="emailId" value={form.emailId || ""} onChange={handleChange} icon={<Mail className="w-4 h-4 text-gray-400" />} />
                  </div>
                </div> */}
                  {/* <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-700 underline">
                    Address Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <Input label="Address Line 1" name="billingAddressLine1" value={form.billingAddressLine1 || ""} onChange={handleChange} />
                    <Input label="Address Line 2" name="billingAddressLine2" value={form.billingAddressLine2 || ""} onChange={handleChange} />
                    <Input label="City" name="billingCity" value={form.billingCity || ""} onChange={handleChange} />
                    <Input label="District" name="district" value={form.district || ""} onChange={handleChange} />
                    <Input label="Province" name="province" value={form.province || ""} onChange={handleChange} />
                    <Input label="Country" name="billingCountry" value={form.billingCountry || ""} onChange={handleChange} />
                    <Input label="Postal Code" name="billingPostalCode" value={form.billingPostalCode || ""} onChange={handleChange} />
                  </div>
                </div> */}
                </>
              )}

              {/* Payment & Bank Details Tab */}
              {activeTab === "tax" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 underline mb-4">
                      Sales and Tax
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <Input
                        label="Selling Price"
                        name="sellingPrice"
                        value={form.sellingPrice || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Sales Account"
                        name="dateOfAddition"
                        value={form.dateOfAddition || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Footer */}
            <footer className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isEditMode ? "Update" : "Save"} Category
                </button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Input Component (unchanged)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className = "", ...props }, ref) => (
    <label className="flex flex-col gap-1 text-sm w-full">
      <span className="font-medium text-gray-600">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            icon ? "pl-10" : ""
          } ${props.disabled ? "bg-gray-50" : ""} ${className}`}
          {...props}
        />
      </div>
    </label>
  ),
);
Input.displayName = "Input";

export default ItemsCategoryModal;
