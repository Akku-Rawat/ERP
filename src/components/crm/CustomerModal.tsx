/*  CustomerModal.tsx  */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import url from '../../api/url';
import {
  X,
  Building,
  User,
  Mail,
  Phone, 
  Save,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const CUSTOMER_ENDPOINT = `${url}/resource/Customer`;

interface CustomerFormData {
  customer_name: string;       // mandatory
  customer_type: "Individual" | "Company";
  custom_customer_tpin: string; // mandatory for Company
  // optional fields
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  website?: string;
  billingAddress?: string;
  shippingAddress?: string;
  taxId?: string;
  notes?: string;
}

const emptyForm: CustomerFormData = {
  customer_name: "",
  customer_type: "Individual",
  custom_customer_tpin: "",
};

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CustomerFormData) => void;
  initialData?: CustomerFormData | null;
  isEditMode?: boolean;
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const [form, setForm] = useState<CustomerFormData>(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation for Company
    if (form.customer_type === "Company") {
      if (!form.customer_name?.trim()) {
        toast.error("Customer Name is required for companies");
        return;
      }
      if (!form.custom_customer_tpin?.trim()) {
        toast.error("Customer TPIN is required for companies");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        customer_name: form.customer_name,
        customer_type: form.customer_type,
        custom_customer_tpin: form.custom_customer_tpin,
      };

      let response;
      if (isEditMode && initialData?.customer_name) { 
        response = await fetch(`${CUSTOMER_ENDPOINT}/${initialData.customer_name}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(CUSTOMER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save customer");
      }

      const saved = await response.json();
      toast.success(isEditMode ? "Customer updated!" : "Customer created!");

      onSubmit?.({ ...form });
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-[96vw] max-w-4xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-indigo-50/70 border-b">
              <h2 className="text-2xl font-semibold text-indigo-700">
                {isEditMode ? "Edit Customer" : "Add New Customer"}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </header>

            {/* Scrollable Content */}
            <section className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Customer Type */}
              <Card title="Customer Type">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="customer_type"
                      value="Individual"
                      checked={form.customer_type === "Individual"}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600"
                      required
                    />
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Individual</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="customer_type"
                      value="Company"
                      checked={form.customer_type === "Company"}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600"
                      required
                    />
                    <Building className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Company</span>
                  </label>
                </div>
              </Card>

              {/* Core mandatory fields */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card title="Customer Details">
                  <Input
                    label="Customer Name *"
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                    required
                  />
                  {form.customer_type === "Company" && (
                    <Input
                      label="Customer TPIN *"
                      name="custom_customer_tpin"
                      value={form.custom_customer_tpin}
                      onChange={handleChange}
                      placeholder="TP12345678"
                      required
                    />
                  )}
                </Card>

                <Card title="Contact Person">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={form.firstName ?? ""}
                      onChange={handleChange}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={form.lastName ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email ?? ""}
                    onChange={handleChange}
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={form.phone ?? ""}
                    onChange={handleChange}
                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                  />
                </Card>
              </div>

              {/* Addresses */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card title="Billing Address">
                  <textarea
                    className="w-full rounded border p-3 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    name="billingAddress"
                    value={form.billingAddress ?? ""}
                    onChange={handleChange}
                    placeholder="123 Main St..."
                  />
                </Card>

                <Card title="Shipping Address">
                  <textarea
                    className="w-full rounded border p-3 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    name="shippingAddress"
                    value={form.shippingAddress ?? ""}
                    onChange={handleChange}
                    placeholder="Same as billing or enter different..."
                  />
                  <label className="flex items-center gap-2 mt-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.shippingAddress === form.billingAddress}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          shippingAddress: e.target.checked ? p.billingAddress ?? "" : "",
                        }))
                      }
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-gray-600">Same as billing address</span>
                  </label>
                </Card>
              </div>

              {/* Notes */}
              <Card title="Additional Notes">
                <textarea
                  className="w-full rounded border p-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  name="notes"
                  value={form.notes ?? ""}
                  onChange={handleChange}
                  placeholder="Any special instructions..."
                />
              </Card>
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
                  onClick={() => setForm(initialData ?? emptyForm)}
                  className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isEditMode ? "Update" : "Save"} Customer
                </button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* Reusable Components */
const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-lg border bg-white p-5 shadow-sm">
    <h3 className="mb-4 text-lg font-semibold text-gray-700 flex items-center gap-2">{title}</h3>
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className = "", ...props }, ref) => (
    <label className="flex flex-col gap-1 text-sm">
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
          } ${className}`}
          {...props}
        />
      </div>
    </label>
  )
);
Input.displayName = "Input";

export default CustomerModal;