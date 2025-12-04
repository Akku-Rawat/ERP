import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TermsAndCondition from "../TermsAndCondition";
import type { TermPhase, PaymentTerms, TermSection } from "../../types/termsAndCondition";
import { X, Mail, Phone, CloudCog } from "lucide-react";

import {
  createCustomer,
  updateCustomerByCustomerCode,
} from "../../api/customerApi";

import type { CustomerDetail, CustomerTerms } from "../../types/customer";

const emptyForm: CustomerDetail & { sameAsBilling: boolean } = {
  id: "",
  name: "",
  type: "Individual",
  tpin: "",
  currency: "",
  onboardingBalance: 0,
  mobile: "",
  contactPerson: "",
  displayName: "",
  email: "",
  accountNumber: "",
  status: "Active",

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

  terms: {
    selling: {}
  },
  sameAsBilling: false,
};

const currencyOptions = ["ZMW", "USD", "INR"];

const CustomerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CustomerDetail) => void;
  initialData?: CustomerDetail | null;
  isEditMode?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const [form, setForm] = useState<CustomerDetail & { sameAsBilling: boolean }>(
    emptyForm
  );

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "terms" | "address">(
    "details"
  );

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        sameAsBilling: false,
      });
    } else {
      setForm(emptyForm);
    }
    setActiveTab("details");
  }, [initialData, isOpen]);

  useEffect(() => {
    if (form.sameAsBilling) {
      setForm((prev) => ({
        ...prev,
        shippingAddressLine1: prev.billingAddressLine1,
        shippingAddressLine2: prev.billingAddressLine2,
        shippingPostalCode: prev.billingPostalCode,
        shippingCity: prev.billingCity,
        shippingState: prev.billingState,
        shippingCountry: prev.billingCountry,
      }));
    }
  }, [
    form.sameAsBilling,
    form.billingAddressLine1,
    form.billingAddressLine2,
    form.billingPostalCode,
    form.billingCity,
    form.billingState,
    form.billingCountry,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CustomerDetail = { ...form };
      delete (payload as any).sameAsBilling;

      let response;
      console.log("payload: ",payload);

      if (isEditMode && initialData?.id) {
        response = await updateCustomerByCustomerCode(initialData.id, payload);
      } else {
        response = await createCustomer(payload);
      }

      alert(isEditMode ? "Customer updated successfully!" : "Customer created successfully!");

      onSubmit?.(payload);
      handleClose();
    } catch (err) {
      console.error("Save customer error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const reset = () => {
    setForm(initialData ? { ...initialData, sameAsBilling: true } : emptyForm);
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
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
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
                  className={`px-6 py-3 font-medium text-sm capitalize ${activeTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {tab === "details"
                    ? "Details"
                    : tab === "terms"
                      ? "Terms & Conditions"
                      : "Address"}
                </button>
              ))}
            </div>

            {/* Content */}
            <section className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* Main info */}
                  <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                    Customer Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {/* TYPE */}
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium text-gray-600">Customer Type *</span>
                      <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="rounded border px-3 py-2 focus:ring-indigo-400"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Company">Company</option>
                      </select>
                    </label>

                    <Input
                      label="Customer Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Contact Person"
                      name="contactPerson"
                      value={form.contactPerson}
                      onChange={handleChange}
                    />

                    {/* DISPLAY NAME */}
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium text-gray-600">Display Name *</span>
                      <select
                        name="displayName"
                        value={form.displayName}
                        onChange={handleChange}
                        className="rounded border px-3 py-2 focus:ring-indigo-400"
                        required
                      >
                        <option value="" disabled>
                          Select Name
                        </option>
                        {form.name && <option value={form.name}>{form.name}</option>}
                        {form.contactPerson && (
                          <option value={form.contactPerson}>{form.contactPerson}</option>
                        )}
                      </select>
                    </label>

                    <Input
                      label="Customer TPIN"
                      name="tpin"
                      value={form.tpin}
                      onChange={handleChange}
                      required
                    />

                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium text-gray-600">Currency</span>
                      <select
                        name="currency"
                        value={form.currency}
                        onChange={handleChange}
                        className="rounded border px-3 py-2 focus:ring-indigo-400"
                      >
                        <option value="">Select Currency...</option>
                        {currencyOptions.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>

                    <Input
                      label="Bank Account"
                      name="accountNumber"
                      value={form.accountNumber}
                      onChange={handleChange}
                    />

                    <Input
                      label="Onboard Balance"
                      name="onboardingBalance"
                      value={form.onboardingBalance}
                      onChange={handleChange}
                    />

                    <Input
                      label="Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      icon={<Mail className="w-4 h-4 text-gray-400" />}
                    />

                    <Input
                      label="Mobile No"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      icon={<Phone className="w-4 h-4 text-gray-400" />}
                    />
                  </div>
                </div>
              )}

              {activeTab === "terms" && (
                <div className="h-full w-full">
                  <TermsAndCondition
                    terms={form.terms?.selling || {} as TermSection}
                    setTerms={(updated) => setForm((p) => ({
                      ...p,
                      terms: { ...p.terms, selling: updated }
                    }))}
                  />
                </div>
              )}

              {activeTab === "address" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Billing */}
                    <div className="rounded-lg border bg-white shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-700 underline mb-4">
                        Billing Address
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Line 1"
                          name="billingAddressLine1"
                          value={form.billingAddressLine1}
                          onChange={handleChange}
                        />
                        <Input
                          label="Line 2"
                          name="billingAddressLine2"
                          value={form.billingAddressLine2}
                          onChange={handleChange}
                        />
                        <Input
                          label="Postal Code"
                          name="billingPostalCode"
                          value={form.billingPostalCode}
                          onChange={handleChange}
                        />
                        <Input
                          label="City"
                          name="billingCity"
                          value={form.billingCity}
                          onChange={handleChange}
                        />
                        <Input
                          label="State"
                          name="billingState"
                          value={form.billingState}
                          onChange={handleChange}
                        />
                        <Input
                          label="Country"
                          name="billingCountry"
                          value={form.billingCountry}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Shipping */}
                    <div className="rounded-lg border bg-white shadow p-6">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 underline">
                          Shipping Address
                        </h3>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            name="sameAsBilling"
                            checked={form.sameAsBilling}
                            onChange={handleChange}
                          />
                          Same as billing
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Line 1"
                          name="shippingAddressLine1"
                          value={form.shippingAddressLine1}
                          onChange={handleChange}
                          disabled={form.sameAsBilling}
                        />
                        <Input
                          label="Line 2"
                          name="shippingAddressLine2"
                          value={form.shippingAddressLine2}
                          onChange={handleChange}
                          disabled={form.sameAsBilling}
                        />
                        <Input
                          label="Postal Code"
                          name="shippingPostalCode"
                          value={form.shippingPostalCode}
                          onChange={handleChange}
                          disabled={form.sameAsBilling}
                        />
                        <Input
                          label="City"
                          name="shippingCity"
                          value={form.shippingCity}
                          onChange={handleChange}
                          disabled={form.sameAsBilling}
                        />
                        <Input
                          label="State"
                          name="shippingState"
                          value={form.shippingState}
                          onChange={handleChange}
                          disabled={form.sameAsBilling}
                        />
                        <Input
                          label="Country"
                          name="shippingCountry"
                          value={form.shippingCountry}
                          onChange={handleChange}
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
                  className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
                >
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
          {...props}
          value={props.value ?? ""}
          className={`w-full rounded border px-3 py-2 focus:ring-2 focus:ring-indigo-400 ${icon ? "pl-10" : ""
            } ${props.disabled ? "bg-gray-50" : ""} ${className}`}
        />
      </div>
    </label>
  )
);
Input.displayName = "Input";

export default CustomerModal;
