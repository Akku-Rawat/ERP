import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  Save,
  Loader2,
  Plus,
  Minus
} from "lucide-react";
import toast from "react-hot-toast";

const base_url = import.meta.env.VITE_BASE_URL;
const CUSTOMER_ENDPOINT = `${base_url}/resource/Customer`;

interface CustomerFormData {
  customer_name: string;
  customer_type: "Individual" | "Company";
  custom_customer_tpin: string;
  ssn?: string;
  bankAccount?: string;
  email?: string;
  phone?: string;
  paymentTerms?: string;
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
  paymentTerms: "",
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
    const [selectedTemplate, setSelectedTemplate] = useState("General Service Terms");

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
                        <Input
                          label="Payment Terms"
                          name="paymentTerms"
                          type="number"
                          value={form.paymentTerms ?? ""}
                          onChange={handleChange}
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
                    </div>

                    <div className="my-6  bg-gray-300" />
                  </div>
                )}

                {activeTab === "terms" && (
              <>
              <div className=" items-center mb-4">
  <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
    Terms and Conditions
  </h3>
 
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Select a template</label>
          <select
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option>General Service Terms</option>
            <option>Payment Terms</option>
            <option>Service Delivery Terms</option>
            <option>Cancellation / Refund Policy</option>
            <option>Confidentiality & Data Protection</option>
            <option>Liability</option>
          </select>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex space-x-1 mb-3 p-1 bg-gray-100 rounded-md">
        <button className="p-2 hover:bg-gray-200 rounded" title="Bold">
          <strong>B</strong>
        </button>
        <button className="p-2 hover:bg-gray-200 rounded" title="Italic">
          <em>I</em>
        </button>
        <button className="p-2 hover:bg-gray-200 rounded" title="Underline">
          <u>U</u>
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button className="p-2 hover:bg-gray-200 rounded" title="Unordered List">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-200 rounded" title="Ordered List">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
<textarea
  className="w-full h-64 p-4 border border-gray-300 rounded-md text-sm text-gray-700 font-mono bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={
    selectedTemplate === "General Service Terms"
      ? `1.This Quotation is subject to the following terms and conditions. By accepting this quotation, {{CustomerName}} agrees to be bound by these terms. This quotation, identified by number {{QuotationNumber}}, was issued on {{QuotationDate}} and is valid until {{ValidUntil}}.\n\n 2.The services to be provided are: {{ServiceName}}. The total amount payable for these services is {{TotalAmount}}.\n\n 3.Payment is due upon receipt of the invoice. Any disputes must be raised within 14 days of the invoice date.`
      : selectedTemplate === "Payment Terms"
      ? `1.Payment Stages\t20% Advance, 30% after Phase 1, 50% on completion\nDue Dates\tPayment due within 30 days from invoice\nLate Payment Charges\t12% p.a. on overdue payments\nTaxes / Additional Charges\tTax applicable @ 18%\nSpecial Notes / Conditions\tAdvance payment is non-refundable`
      : selectedTemplate === "Service Delivery Terms"
      ? `1.Estimated Delivery Timelines\tPhase 1: 2 weeks; Phase 2: 3 weeks; Final Delivery: 5 weeks total\nClient Responsibilities\tClient must provide content, approvals, and access to systems on time`
      : selectedTemplate === "Cancellation / Refund Policy"
      ? `1.Cancellation Conditions\tClient may cancel anytime with written notice\nRefund Rules\tAdvance payment is non-refundable; milestone payments refundable only for uninitiated work`
      : selectedTemplate === "Confidentiality & Data Protection"
      ? `1.All client data shared for the service will remain confidential.`
      : selectedTemplate === "Liability"
      ? `1.Company not liable for delays caused by client.\n• Client responsible for providing accurate info/resources.`
      : ""
  }
/>

{/* Action Buttons */}
<div className="mt-4 flex justify-end space-x-3">
  <button
    onClick={() => {
       alert("Terms saved!");
    }}
    className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
  >
    Save
  </button>

  <button
    onClick={() => {
       alert("Preview opened!");
    }}
    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    Preview
  </button>
</div>
</>

)}
                {activeTab === "address" && (
                  <div className="space-y-6">
                    {/* Billing and Shipping - Side by Side with Alignment Top */}
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

                        {/* Add Address Button */}
                        <div className="mt-6 flex items-center justify-between">
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
                        </div>

                        {/* Additional Address Fields */}
                        {showAdditionalBilling && (
                          <div className="mt-2 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="Line 1"
                                name="billingAddressLine1_2"
                                placeholder="Street, Apartment"
                              />
                              <Input
                                label="Line 2"
                                name="billingAddressLine2_2"
                                placeholder="Landmark, City"
                              />
                              <Input
                                label="Postal Code"
                                name="billingPostalCode_2"
                                placeholder="Postal Code"
                              />
                              <Input
                                label="City"
                                name="billingCity_2"
                                placeholder="City"
                              />
                              <Input
                                label="State"
                                name="billingState_2"
                                placeholder="State"
                              />
                              <Input
                                label="Country"
                                name="billingCountry_2"
                                placeholder="Country"
                              />
                            </div>
                          </div>
                        )}
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
