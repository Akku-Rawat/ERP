import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const base_url = import.meta.env.VITE_BASE_URL;
const CUSTOMER_ENDPOINT = `${base_url}/resource/Customer`;

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

const currencyOptions = ["ZMW", "USD", "INR"];

const SupplierModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Record<string, any>) => void;
  initialData?: Record<string, any> | null;
  isEditMode?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const [form, setForm] = useState<Record<string, any>>(emptyForm);
  const [loading, setLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<
    "supplier" | "contact" | "payment" | "address"
  >("supplier");

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
    setActiveTab("supplier");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      let response;
      if (isEditMode && initialData?.supplierName) {
        response = await fetch(
          `${CUSTOMER_ENDPOINT}/${initialData.supplierName}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: import.meta.env.VITE_AUTHORIZATION,
            },
            body: JSON.stringify(payload),
          },
        );
      } else {
        response = await fetch(CUSTOMER_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_AUTHORIZATION,
          },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save vendor");
      }
      await response.json();
      toast.success(isEditMode ? "Vendor updated!" : "Vendor created!");
      onSubmit?.({ ...form });
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-indigo-50/70 border-b">
              <h2 className="text-2xl font-semibold text-indigo-700">
                {isEditMode ? "Edit Supplier" : "Add New Supplier"}
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
                onClick={() => setActiveTab("supplier")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "supplier"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Supplier Details
              </button>
              {/* <button
                type="button"
                onClick={() => setActiveTab("contact")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "contact"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Contact Details
              </button> */}
              <button
                type="button"
                onClick={() => setActiveTab("payment")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "payment"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Payment & Bank
              </button>
              {/* <button
                type="button"
                onClick={() => setActiveTab("address")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "address"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Address
              </button> */}
            </div>

            {/* Tab Content */}
            <section className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Supplier Details Tab */}
              {activeTab === "supplier" && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 underline">
                      Supplier Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <Input
                        label="Tax Id/ TPIN"
                        name="tpin"
                        value={form.tpin || ""}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Supplier Name"
                        name="supplierName"
                        value={form.supplierName || ""}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Supplier Code"
                        name="supplierCode"
                        value={form.supplierCode || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 underline">
                      Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <Input
                        label="Contact Person Name"
                        name="contactPerson"
                        value={form.contactPerson || ""}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Phone No"
                        name="phoneNo"
                        value={form.phoneNo || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Alternate No"
                        name="alternateNo"
                        value={form.alternateNo || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Email Id"
                        name="emailId"
                        value={form.emailId || ""}
                        onChange={handleChange}
                        icon={<Mail className="w-4 h-4 text-gray-400" />}
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-700 underline">
                      Address Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <Input
                        label="Address Line 1"
                        name="billingAddressLine1"
                        value={form.billingAddressLine1 || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Address Line 2"
                        name="billingAddressLine2"
                        value={form.billingAddressLine2 || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="City"
                        name="billingCity"
                        value={form.billingCity || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="District"
                        name="district"
                        value={form.district || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Province"
                        name="province"
                        value={form.province || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Country"
                        name="billingCountry"
                        value={form.billingCountry || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Postal Code"
                        name="billingPostalCode"
                        value={form.billingPostalCode || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Payment & Bank Details Tab */}
              {activeTab === "payment" && (
                <motion.div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 underline mb-4">
                      Payment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <label className="flex flex-col gap-1 text-sm">
                        <span className="font-medium text-gray-600">
                          Currency
                        </span>
                        <select
                          name="currency"
                          value={form.currency || ""}
                          onChange={handleChange}
                          className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                          <option value="">Select currency...</option>
                          {currencyOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </label>
                      <Input
                        label="Payment Terms (Days)"
                        name="paymentTerms"
                        value={form.paymentTerms || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Date of Addition"
                        name="dateOfAddition"
                        type="date"
                        value={form.dateOfAddition || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Opening Balance"
                        name="openingBalance"
                        value={form.openingBalance || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 underline mb-4">
                      Bank Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <Input
                        label="Account No"
                        name="accountNumber"
                        value={form.accountNumber || ""}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Account Holder Name"
                        name="accountHolder"
                        value={form.accountHolder || ""}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Sort Code"
                        name="sortCode"
                        value={form.sortCode || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="SWIFT Code"
                        name="swiftCode"
                        value={form.swiftCode || ""}
                        onChange={handleChange}
                      />
                      <Input
                        label="Branch Address"
                        name="branchAddress"
                        value={form.branchAddress || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </motion.div>
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
                  {isEditMode ? "Update" : "Save"} Vendor
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

export default SupplierModal;
