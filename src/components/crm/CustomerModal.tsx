import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TermsAndCondition from "../TermsAndCondition";
import {
  X,
  Mail,
  Phone,
  Plus,
  Minus
} from "lucide-react";
import toast from "react-hot-toast";

const base_url = import.meta.env.VITE_BASE_URL;
const CUSTOMER_ENDPOINT = `${base_url}.customer.customer.create_customer_api`;
console.log("CUSTOMER_ENDPOINT" + CUSTOMER_ENDPOINT);

interface CustomerFormData {
  customer_name: string;
  customer_type: "Individual" | "Company";
  custom_customer_tpin: string;
  ssn?: string;
  custom_account_number: string;
  customer_email: string;
  mobile_no: string;
  paymentTerms?: string;
  website?: string;
  customer_billing_address_line1?: string;
  customer_billing_address_line2?: string;
  customer_billing_postal_code?: string;
  customer_billing_city?: string;
  customer_billing_state?: string;
  customer_billing_country?: string;
  customer_shipping_address_line1?: string;
  customer_shipping_address_line2?: string;
  customer_shipping_postal_code?: string;
  customer_shipping_city?: string;
  customer_shipping_state?: string;
  customer_shipping_country?: string;
  taxId?: string;
  notes?: string;
  customer_currency: string;
  custom_onboard_balance: string;
  sameAsBilling?: boolean;
}

const emptyForm: CustomerFormData = {
  customer_name: "",
  customer_type: "Individual",
  custom_customer_tpin: "",
  customer_currency: "",
  custom_onboard_balance: "",
  mobile_no: "",
  ssn: "",
  customer_email: "",
  custom_account_number: "",
  paymentTerms: "",
  customer_billing_address_line1: "",
  customer_billing_address_line2: "",
  customer_billing_postal_code: "",
  customer_billing_city: "",
  customer_billing_state: "",
  customer_billing_country: "",
  customer_shipping_address_line1: "",
  customer_shipping_address_line2: "",
  customer_shipping_postal_code: "",
  customer_shipping_city: "",
  customer_shipping_state: "",
  customer_shipping_country: "",
  sameAsBilling: true,
};

const currencyOptions = [
  "ZMW", "USD", "INR"
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
    const [showAdditionalBilling, setShowAdditionalBilling] = useState(false);
    const [activeTab, setActiveTab] = useState<"details" | "terms" | "address">("details");

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
          customer_shipping_address_line1: prev.customer_billing_address_line1 ?? "",
          customer_shipping_address_line2: prev.customer_billing_address_line2 ?? "",
          customer_shipping_postal_code: prev.customer_billing_postal_code ?? "",
          customer_shipping_city: prev.customer_billing_city ?? "",
          customer_shipping_state: prev.customer_billing_state ?? "",
          customer_shipping_country: prev.customer_billing_country ?? "",
        }));
      }
    }, [
      form.sameAsBilling,
      form.customer_billing_address_line1,
      form.customer_billing_address_line2,
      form.customer_billing_postal_code,
      form.customer_billing_city,
      form.customer_billing_state,
      form.customer_billing_country
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
      setLoading(true);
      try {
        const payload = { ...form };
        let response;
        if (isEditMode && initialData?.customer_name) {
          response = await fetch(
            `${CUSTOMER_ENDPOINT}/${initialData.customer_name}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": import.meta.env.VITE_AUTHORIZATION
              },
              body: JSON.stringify(payload),
            }
          );
        } else {
          response = await fetch(CUSTOMER_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": import.meta.env.VITE_AUTHORIZATION
            },
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
            className=" w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
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

              {/* Tabs */}
              <div className="flex border-b bg-gray-50">
                {(["details", "terms", "address"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium text-sm capitalize transition-colors ${activeTab === tab
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    {tab === "details" ? "Details" : tab === "terms" ? "Terms & Conditions" : "Address"}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <section className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === "details" && (
                  <div className="space-y-6">
                    {/* Customer Details */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                        Customer Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">
                            Customer Type *
                          </span>
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
                          label="Customer Name"
                          name="customer_name"
                          value={form.customer_name}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                          required
                        />
                        <Input
                          label="Email"
                          name="customer_email"
                          type="customer_email"
                          value={form.customer_email}
                          onChange={handleChange}
                          icon={<Mail className="w-4 h-4 text-gray-400" />}
                        />
                        <Input
                          label="Mobile No"
                          name="mobile_no"
                          type="tel"
                          value={form.mobile_no}
                          onChange={handleChange}
                          icon={<Phone className="w-4 h-4 text-gray-400" />}
                        />
                        <Input
                          label="Payment Terms"
                          name="paymentTerms"
                          type="number"
                          value={form.paymentTerms}
                          onChange={handleChange}
                        />
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">Currency</span>
                          <select
                            name="customer_currency"
                            value={form.customer_currency ?? ""}
                            onChange={handleChange}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          >
                            <option value="">Select Currency...</option>
                            {currencyOptions.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </label>
                        <Input
                          label="Bank Account"
                          name="custom_account_number"
                          value={form.custom_account_number}
                          onChange={handleChange}
                          placeholder="Bank Account"
                        />
                        <Input
                              label="Onboard Balance"
                              name="custom_onboard_balance"
                              type="custom_onboard_balance"
                              value={form.custom_onboard_balance}
                              onChange={handleChange}
                              placeholder="e.g. 1000"
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
                            <div></div>
                          </>
                        )}
                        {form.customer_type === "Individual" && (
                          <>
                            <Input
                              label="SSN"
                              name="ssn"
                              value={form.ssn ?? ""}
                              onChange={handleChange}
                              placeholder="Social Security Number"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="my-6  bg-gray-300" />
                  </div>
                )}

                {/* === TAB: Terms & Conditions === */}
              {activeTab === "terms" && (
              <div className=" h-full w-full">
              <TermsAndCondition/>
              </div>
              )}

                {activeTab === "address" && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                      {/* ========== BILLING ADDRESS ========== */}
                      <div className="rounded-lg border border-gray-300 bg-white shadow p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-700 underline">
                            Billing Address
                          </h3>
                        </div>

                        {/* Main Address Fields */}
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Line 1"
                            name="customer_billing_address_line1"
                            value={form.customer_billing_address_line1 ?? ""}
                            onChange={handleChange}
                            placeholder="Street, Apartment"
                          />
                          <Input
                            label="Line 2"
                            name="customer_billing_address_line2"
                            value={form.customer_billing_address_line2 ?? ""}
                            onChange={handleChange}
                            placeholder="Landmark, City"
                          />
                          <Input
                            label="Postal Code"
                            name="customer_billing_postal_code"
                            value={form.customer_billing_postal_code ?? ""}
                            onChange={handleChange}
                            placeholder="Postal Code"
                          />
                          <Input
                            label="City"
                            name="customer_billing_city"
                            value={form.customer_billing_city ?? ""}
                            onChange={handleChange}
                            placeholder="City"
                          />
                          <Input
                            label="State"
                            name="customer_billing_state"
                            value={form.customer_billing_state ?? ""}
                            onChange={handleChange}
                            placeholder="State"
                          />
                          <Input
                            label="Country"
                            name="customer_billing_country"
                            value={form.customer_billing_country ?? ""}
                            onChange={handleChange}
                            placeholder="Country"
                          />
                        </div>

                        {/* Add Address Button */}
                        {/* <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalBilling(!showAdditionalBilling)}
                              className="p-1 rounded hover:bg-gray-200 transition"
                            >
                              {showAdditionalBilling ? (
                                <Minus className="w-4 h-4 text-gray-600" />
                              ) : (
                                <Plus className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                            <span className="text-sm font-medium text-gray-700">
                              Add Address
                            </span>
                          </div>
                        </div> */}

                        {/* Additional Address Fields */}
                        {/* {showAdditionalBilling && (
                          <div className="mt-2 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="Line 1"
                                name="customer_billing_address_line1_2"
                                placeholder="Street, Apartment"
                              />
                              <Input
                                label="Line 2"
                                name="customer_billing_address_line2_2"
                                placeholder="Landmark, City"
                              />
                              <Input
                                label="Postal Code"
                                name="customer_billing_postal_code_2"
                                placeholder="Postal Code"
                              />
                              <Input
                                label="City"
                                name="customer_billing_city_2"
                                placeholder="City"
                              />
                              <Input
                                label="State"
                                name="customer_billing_state_2"
                                placeholder="State"
                              />
                              <Input
                                label="Country"
                                name="customer_billing_country_2"
                                placeholder="Country"
                              />
                            </div>
                          </div>
                        )} */}
                      </div>

                      {/* ========== SHIPPING ADDRESS ========== */}
                      <div className="rounded-lg border border-gray-300 bg-white shadow p-6">
                        {/* Header with checkbox */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-700 underline">
                            Shipping Address
                          </h3>

                          {/* Same as Billing Checkbox - RIGHT SIDE */}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="sameAsBilling"
                              checked={form.sameAsBilling || false}
                              onChange={handleChange}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm text-gray-600 font-medium">
                              Same as billing
                            </span>
                          </div>
                        </div>

                        {/* Address Fields - Always Visible */}
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Line 1"
                            name="customer_shipping_address_line1"
                            value={form.customer_shipping_address_line1 ?? ""}
                            onChange={handleChange}
                            placeholder="Street, Apartment"
                            disabled={form.sameAsBilling}
                          />
                          <Input
                            label="Line 2"
                            name="customer_shipping_address_line2"
                            value={form.customer_shipping_address_line2 ?? ""}
                            onChange={handleChange}
                            placeholder="Landmark, City"
                            disabled={form.sameAsBilling}
                          />
                          <Input
                            label="Postal Code"
                            name="customer_shipping_postal_code"
                            value={form.customer_shipping_postal_code ?? ""}
                            onChange={handleChange}
                            placeholder="Postal Code"
                            disabled={form.sameAsBilling}
                          />
                          <Input
                            label="City"
                            name="customer_shipping_city"
                            value={form.customer_shipping_city ?? ""}
                            onChange={handleChange}
                            placeholder="City"
                            disabled={form.sameAsBilling}
                          />
                          <Input
                            label="State"
                            name="customer_shipping_state"
                            value={form.customer_shipping_state ?? ""}
                            onChange={handleChange}
                            placeholder="State"
                            disabled={form.sameAsBilling}
                          />
                          <Input
                            label="Country"
                            name="customer_shipping_country"
                            value={form.customer_shipping_country ?? ""}
                            onChange={handleChange}
                            placeholder="Country"
                            disabled={form.sameAsBilling}
                          />
                        </div>
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
                    {/* {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )} */}
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

// Reusable Input Component
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
          className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${icon ? "pl-10" : ""
            } ${props.disabled ? "bg-gray-50" : ""} ${className}`}
          {...props}
        />
      </div>
    </label>
  )
);
Input.displayName = "Input";

export default CustomerModal;
