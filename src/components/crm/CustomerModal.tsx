import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import url from "../../api/url";
import {
  X,
  Mail,
  Phone,
  Save,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const CUSTOMER_ENDPOINT = `${url}/resource/Customer`;

interface CustomerFormData {
  customer_name: string;
  customer_type: "Individual" | "Company";
  custom_customer_tpin: string;
  ssn?: string;
  bankAccount?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  website?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingPostalCode?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingPostalCode?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  taxId?: string;
  notes?: string;
  currency?: string;
  validUntil?: string;
  onboardBalance?: string;
  sameAsBilling?: boolean;
}

const emptyForm: CustomerFormData = {
  customer_name: "",
  customer_type: "Individual",
  custom_customer_tpin: "",
  currency: "",
  validUntil: "",
  onboardBalance: "",
  ssn: "",
  bankAccount: "",
  billingAddressLine1: "",
  billingAddressLine2: "",
  billingPostalCode: "",
  billingCity: "",
  billingState: "",
  billingCountry: "",
  shippingAddressLine1: "",
  shippingAddressLine2: "",
  shippingPostalCode: "",
  shippingCity: "",
  shippingState: "",
  shippingCountry: "",
  sameAsBilling: true,
};

const tabItems = [
  { key: "details", label: "Details" },
  { key: "address", label: "Address" },
];

const currencyOptions = [
  "ZMW", "USD", "INR", "EUR", "GBP", "CNY", "JPY",
];

const CustomerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CustomerFormData) => void;
  initialData?: CustomerFormData | null;
  isEditMode?: boolean;
}> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const [form, setForm] = useState<CustomerFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "address">("details");

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
    setActiveTab("details");
  }, [initialData, isOpen]);

  useEffect(() => {
    if (form.sameAsBilling) {
      setForm((prev) => ({
        ...prev,
        shippingAddressLine1: prev.billingAddressLine1 ?? "",
        shippingAddressLine2: prev.billingAddressLine2 ?? "",
        shippingPostalCode: prev.billingPostalCode ?? "",
        shippingCity: prev.billingCity ?? "",
        shippingState: prev.billingState ?? "",
        shippingCountry: prev.billingCountry ?? "",
      }));
    }
  }, [
    form.sameAsBilling,
    form.billingAddressLine1,
    form.billingAddressLine2,
    form.billingPostalCode,
    form.billingCity,
    form.billingState,
    form.billingCountry
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    if (!form.customer_name?.trim()) {
      toast.error("Customer Name is required");
      return;
    }
    if (
      form.customer_type === "Company" &&
      !form.custom_customer_tpin?.trim()
    ) {
      toast.error("Customer TPIN is required for companies");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form };
      let response;
      if (isEditMode && initialData?.customer_name) {
        response = await fetch(
          `${CUSTOMER_ENDPOINT}/${initialData.customer_name}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
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
      await response.json();
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

  const renderDetailsTab = (
    <div className="flex flex-col gap-6">
      <Card title="Customer Details">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-600">Customer Type *</span>
            <select
              name="customer_type"
              value={form.customer_type}
              onChange={handleChange}
              className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="Individual">Individual</option>
              <option value="Company">Company</option>
            </select>
          </label>
          <Input
            label="Customer Name "
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            placeholder="Acme Corp"
            required
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-600">Currency</span>
            <select
              name="currency"
              value={form.currency ?? ""}
              onChange={handleChange}
              className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select currency...</option>
              {currencyOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <Input
            label="Valid Until"
            name="validUntil"
            type="date"
            value={form.validUntil ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Bank Account"
            name="bankAccount"
            value={form.bankAccount ?? ""}
            onChange={handleChange}
            placeholder="Bank Account"
          />
          {form.customer_type === "Company" && (
            <>
              <Input
                label="Customer TPIN"
                name="custom_customer_tpin"
                value={form.custom_customer_tpin}
                onChange={handleChange}
                placeholder="TP12345678"
                required
              />
              <Input
                label="Onboard Balance"
                name="onboardBalance"
                type="number"
                value={form.onboardBalance ?? ""}
                onChange={handleChange}
                placeholder="e.g. 1000"
              />
              <div></div>
            </>
          )}
          {form.customer_type === "Individual" && (
            <>
              <Input
                label="Onboard Balance"
                name="onboardBalance"
                type="number"
                value={form.onboardBalance ?? ""}
                onChange={handleChange}
                placeholder="e.g. 1000"
              />
              <Input
                label="SSN"
                name="ssn"
                value={form.ssn ?? ""}
                onChange={handleChange}
                placeholder="Social Security Number"
              />
              <div></div>
            </>
          )}
        </div>
      </Card>
      <Card title="Contact Person">
        <div className="grid gap-4 md:grid-cols-4">
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
        </div>
      </Card>
    </div>
  );

  const renderAddressTab = (
  <div className="flex flex-col gap-6">
    <Card title="Billing Address">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Input
          label="Line 1"
          name="billingAddressLine1"
          value={form.billingAddressLine1 ?? ""}
          onChange={handleChange}
          placeholder="Street, Apartment"
        />
        <Input
          label="Line 2"
          name="billingAddressLine2"
          value={form.billingAddressLine2 ?? ""}
          onChange={handleChange}
          placeholder="Landmark, City"
        />
        <Input
          label="Postal Code"
          name="billingPostalCode"
          value={form.billingPostalCode ?? ""}
          onChange={handleChange}
          placeholder="Postal Code"
        />
        <Input
          label="City"
          name="billingCity"
          value={form.billingCity ?? ""}
          onChange={handleChange}
          placeholder="City"
        />
        <Input
          label="State"
          name="billingState"
          value={form.billingState ?? ""}
          onChange={handleChange}
          placeholder="State"
        />
        <Input
          label="Country"
          name="billingCountry"
          value={form.billingCountry ?? ""}
          onChange={handleChange}
          placeholder="Country"
        />
      </div>
    </Card>
    <Card title="Shipping Address">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Input
          label="Line 1"
          name="shippingAddressLine1"
          value={form.shippingAddressLine1 ?? ""}
          onChange={handleChange}
          placeholder="Street, Apartment"
          disabled={form.sameAsBilling}
        />
        <Input
          label="Line 2"
          name="shippingAddressLine2"
          value={form.shippingAddressLine2 ?? ""}
          onChange={handleChange}
          placeholder="Landmark, City"
          disabled={form.sameAsBilling}
        />
        <Input
          label="Postal Code"
          name="shippingPostalCode"
          value={form.shippingPostalCode ?? ""}
          onChange={handleChange}
          placeholder="Postal Code"
          disabled={form.sameAsBilling}
        />
        <Input
          label="City"
          name="shippingCity"
          value={form.shippingCity ?? ""}
          onChange={handleChange}
          placeholder="City"
          disabled={form.sameAsBilling}
        />
        <Input
          label="State"
          name="shippingState"
          value={form.shippingState ?? ""}
          onChange={handleChange}
          placeholder="State"
          disabled={form.sameAsBilling}
        />
        <Input
          label="Country"
          name="shippingCountry"
          value={form.shippingCountry ?? ""}
          onChange={handleChange}
          placeholder="Country"
          disabled={form.sameAsBilling}
        />
        <div className="col-span-3 flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="sameAsBilling"
            checked={form.sameAsBilling || false}
            onChange={handleChange}
            className="w-4 h-4 text-indigo-600"
          />
          <span className="text-gray-600">Same as billing address</span>
        </div>
      </div>
    </Card>
    <Card title="Terms and Conditions">
      <textarea
        className="w-full rounded border p-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        name="notes"
        value={form.notes ?? ""}
        onChange={handleChange}
        placeholder="Any special instructions..."
      />
    </Card>
  </div>
);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-[99vw] max-w-6xl max-h-[92vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-indigo-50/70 border-b">
              <h2 className="text-2xl font-semibold text-indigo-700">
                                Add New Customer
               </h2>
 
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </header>

            {/* Tabs at the top */}
            <section className="px-6 pt-5 pb-1 bg-white flex gap-2 border-b">
              {tabItems.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`px-6 py-2 rounded-t font-medium text-base transition ${
                    activeTab === tab.key
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  onClick={() =>
                    setActiveTab(tab.key as "details" | "address")
                  }
                >
                  {tab.label}
                </button>
              ))}
            </section>

            {/* Tab Content */}
            <section className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === "details" ? renderDetailsTab : renderAddressTab}
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
  {loading ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    <Save className="w-4 h-4" />
  )}
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

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="rounded-lg border bg-white p-5 shadow-sm mb-2">
    <h3 className="mb-4 text-lg font-semibold text-gray-700 flex items-center gap-2">
      {title}
    </h3>
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
