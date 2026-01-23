// components/modals/CustomerModal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../ui/modal/modal";
import {
  Input,
  Select,
  Card,
  Button,
  Checkbox,
} from "../ui/modal/formComponent";
import TermsAndCondition from "../../views/termandcondition";
import type { TermSection } from "../../types/termsAndCondition";
import {
  Mail,
  Phone,
  User,
  Building2,
  CreditCard,
  DollarSign,
  MapPin,
  FileText,
} from "lucide-react";

import {
  createCustomer,
  updateCustomerByCustomerCode,
} from "../../api/customerApi";

import type { CustomerDetail } from "../../types/customer";

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
  customerTaxCategory: "",
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
    selling: {},
  },
  sameAsBilling: false,
};

const currencyOptions = ["ZMW", "USD", "INR"];
const customerTaxCategoryOptions = ["Export", "Non-Export", "LPO"];

const CustomerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CustomerDetail) => void;
  initialData?: CustomerDetail | null;
  isEditMode?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const [form, setForm] = useState<CustomerDetail & { sameAsBilling: boolean }>(
    emptyForm,
  );

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "terms" | "address">(
    "details",
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
    if (!form.displayName) {
      if (form.name) {
        setForm((prev) => ({ ...prev, displayName: form.name }));
      } else if (form.contactPerson) {
        setForm((prev) => ({ ...prev, displayName: form.contactPerson }));
      }
    }
  }, [form.name, form.contactPerson]);

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

  // for next button
  const tabs: Array<"details" | "terms" | "address"> = [
    "details",
    "terms",
    "address",
  ];

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const normalizeTaxCategory = (value: string) => {
    if (value.toLowerCase() === "export") return "Export";
    if (value.toLowerCase() === "non-export") return "Non-Export";
    if (value.toLowerCase() === "lpo") return "LPO";
    return value;
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "onboardingBalance"
          ? Number(value)
          : name === "customerTaxCategory"
            ? normalizeTaxCategory(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CustomerDetail = { ...form };
      delete (payload as any).sameAsBilling;

      let response;
      console.log("payload: ", payload);

      if (isEditMode && initialData?.id) {
        response = await updateCustomerByCustomerCode(initialData.id, payload);
      } else {
        response = await createCustomer(payload);
      }

      alert(
        isEditMode
          ? "Customer updated successfully!"
          : "Customer created successfully!",
      );

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
    setForm(initialData ? { ...initialData, sameAsBilling: false } : emptyForm);
  };

  // Footer content
  const footer = (
    <>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>

        {/* NEXT BUTTON */}
        <Button
          variant="secondary"
          onClick={handleNext}
          disabled={activeTab === "address"}
          type="button"
        >
          Next →
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
          type="submit"
        >
          {isEditMode ? "Update Customer" : "Save Customer"}
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Customer" : "Add New Customer"}
      subtitle={
        isEditMode
          ? "Update customer information"
          : "Fill in the details to create a new customer"
      }
      icon={isEditMode ? Building2 : User}
      footer={footer}
      maxWidth="6xl"
      height="90vh"
    >
      <div className="h-full flex flex-col">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Tabs - Sticky Header */}
          <div className="flex gap-1 -mx-6 -mt-6 px-6 pt-4 bg-app sticky top-0 z-10 shrink-0">
            {(["details", "terms", "address"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 font-semibold text-sm capitalize transition-all duration-200 rounded-t-lg ${
                  activeTab === tab
                    ? "text-primary bg-card shadow-sm"
                    : "text-muted hover:text-main hover:bg-card/50"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {tab === "details" && <User className="w-4 h-4" />}
                  {tab === "terms" && <FileText className="w-4 h-4" />}
                  {tab === "address" && <MapPin className="w-4 h-4" />}
                  {tab === "details"
                    ? "Details"
                    : tab === "terms"
                      ? "Terms"
                      : "Address"}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeCustomerTab"
                    className="absolute inset-0 bg-card rounded-t-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-1 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "details" && (
                  <Card
                    title="Basic Information"
                    subtitle="Essential customer details"
                    icon={<User className="w-5 h-5 text-primary" />}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <Select
                        label="Type"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        options={[
                          { value: "Individual", label: "Individual" },
                          { value: "Company", label: "Company" },
                        ]}
                      />

                      <Input
                        label="Customer Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        icon={<User className="w-4 h-4" />}
                        placeholder="Enter full name"
                      />

                      <Input
                        label="Contact Person"
                        name="contactPerson"
                        value={form.contactPerson}
                        onChange={handleChange}
                        icon={<User className="w-4 h-4" />}
                        placeholder="Primary contact"
                      />

                      <Select
                        label="Display Name"
                        name="displayName"
                        value={form.displayName}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Display Name" },
                          {
                            value: form.name,
                            label: form.name || "Customer Name",
                          },
                          {
                            value: form.contactPerson,
                            label: form.contactPerson || "Contact Person",
                          },
                        ].filter((o) => o.value)} // removes empty invalid options
                      />

                      <Input
                        label="TPIN"
                        name="tpin"
                        value={form.tpin}
                        onChange={handleChange}
                        required
                        icon={<CreditCard className="w-4 h-4" />}
                        placeholder="Tax identification"
                      />

                      <Select
                        label="Tax Category"
                        name="customerTaxCategory"
                        value={form.customerTaxCategory}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Tax Category" },
                          { value: "Export", label: "Export" },
                          { value: "Non-Export", label: "Non-Export" },
                          { value: "LPO", label: "LPO" },
                        ]}
                      />

                      <Select
                        label="Currency"
                        name="currency"
                        value={form.currency}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Currency" },
                          { value: "ZMW", label: "ZMW" },
                          { value: "USD", label: "USD" },
                          { value: "INR", label: "INR" },
                        ]}
                      />

                      <Input
                        label="Bank Account"
                        name="accountNumber"
                        value={form.accountNumber}
                        onChange={handleChange}
                        icon={<CreditCard className="w-4 h-4" />}
                        placeholder="Account number"
                      />

                      <Input
                        label="Onboard Balance"
                        name="onboardingBalance"
                        type="number"
                        value={form.onboardingBalance}
                        onChange={handleChange}
                        icon={<DollarSign className="w-4 h-4" />}
                        placeholder="0.00"
                      />

                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        icon={<Mail className="w-4 h-4" />}
                        placeholder="email@example.com"
                      />

                      <Input
                        label="Mobile"
                        name="mobile"
                        type="tel"
                        value={form.mobile}
                        onChange={handleChange}
                        icon={<Phone className="w-4 h-4" />}
                        placeholder="+1234567890"
                      />
                    </div>
                  </Card>
                )}

                {activeTab === "terms" && (
                  <TermsAndCondition
                    title="Selling Terms & Conditions"
                    terms={form.terms?.selling as TermSection}
                    setTerms={(updated) =>
                      setForm((p) => ({
                        ...p,
                        terms: { ...p.terms, selling: updated },
                      }))
                    }
                  />
                )}

                {activeTab === "address" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Billing Address */}
                    <Card
                      title="Billing Address"
                      subtitle="Invoice and payment details"
                      icon={<MapPin className="w-5 h-5 text-primary" />}
                    >
                      <div className="space-y-4">
                        <Input
                          label="Address Line 1"
                          name="billingAddressLine1"
                          value={form.billingAddressLine1}
                          onChange={handleChange}
                          placeholder="Street address"
                        />
                        <Input
                          label="Address Line 2"
                          name="billingAddressLine2"
                          value={form.billingAddressLine2}
                          onChange={handleChange}
                          placeholder="Apt, suite, etc."
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Postal Code"
                            name="billingPostalCode"
                            value={form.billingPostalCode}
                            onChange={handleChange}
                            placeholder="ZIP"
                          />
                          <Input
                            label="City"
                            name="billingCity"
                            value={form.billingCity}
                            onChange={handleChange}
                            placeholder="City"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="State"
                            name="billingState"
                            value={form.billingState}
                            onChange={handleChange}
                            placeholder="State"
                          />
                          <Input
                            label="Country"
                            name="billingCountry"
                            value={form.billingCountry}
                            onChange={handleChange}
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Shipping Address */}
                    <Card
                      title="Shipping Address"
                      subtitle="Delivery location"
                      icon={<MapPin className="w-5 h-5 text-primary" />}
                      className="relative"
                    >
                      <div className="absolute top-6 right-6">
                        <Checkbox
                          label="Same as billing"
                          name="sameAsBilling"
                          checked={form.sameAsBilling}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-4 mt-8">
                        <Input
                          label="Address Line 1"
                          name="shippingAddressLine1"
                          value={form.shippingAddressLine1}
                          onChange={handleChange}
                          disabled={form.sameAsBilling}
                          placeholder="Street address"
                        />
                        <Input
                          label="Address Line 2"
                          name="shippingAddressLine2"
                          value={form.shippingAddressLine2}
                          onChange={handleChange}
                          disabled={form.sameAsBilling}
                          placeholder="Apt, suite, etc."
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Postal Code"
                            name="shippingPostalCode"
                            value={form.shippingPostalCode}
                            onChange={handleChange}
                            disabled={form.sameAsBilling}
                            placeholder="ZIP"
                          />
                          <Input
                            label="City"
                            name="shippingCity"
                            value={form.shippingCity}
                            onChange={handleChange}
                            disabled={form.sameAsBilling}
                            placeholder="City"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="State"
                            name="shippingState"
                            value={form.shippingState}
                            onChange={handleChange}
                            disabled={form.sameAsBilling}
                            placeholder="State"
                          />
                          <Input
                            label="Country"
                            name="shippingCountry"
                            value={form.shippingCountry}
                            onChange={handleChange}
                            disabled={form.sameAsBilling}
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CustomerModal;
