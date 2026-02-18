// components/modals/CustomerModal.tsx
import React, { useState, useEffect } from "react";
import Modal from "../ui/modal/modal";
import { showApiError, showSuccess, closeSwal, showLoading } from "../alert";
import { getCompanyById } from "../../api/companySetupApi";
const companyId = import.meta.env.VITE_COMPANY_ID;
import {
  Card,
  Button,
} from "../ui/modal/formComponent";
import TermsAndCondition from "../TermsAndCondition";
import type { TermSection } from "../../types/termsAndCondition";
import {
  User,
  Building2,
  MapPin,
  FileText,
} from "lucide-react";

import {
  createCustomer,
  updateCustomerByCustomerCode,
} from "../../api/customerApi";
import AddressBlock from "../ui/modal/AddressBlock";
import type { CustomerDetail } from "../../types/customer";
import { ModalInput, ModalSelect } from "../ui/modal/modalComponent";


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
    selling: { payment: { phases: [] } },
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
  const [errors, setErrors] = useState<{ mobile?: string; }>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "terms" | "address">(
    "details",
  );

  useEffect(() => {
    if (!isOpen || !companyId || isEditMode) return;

    const loadCompanyTerms = async () => {
      try {
        const res = await getCompanyById(companyId);

        const sellingTerms = res?.data?.terms?.selling;

        if (!sellingTerms) {
          console.warn("Company selling terms not found");
          return;
        }

        setForm((prev) => ({
          ...prev,
          terms: {
            ...prev.terms,
            selling: sellingTerms,
          },
        }));
      } catch (err) {
        console.error("Failed to load company terms", err);
      }
    };

    loadCompanyTerms();
  }, [companyId, isOpen, isEditMode]);

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
    setLoading(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "onboardingBalance" ? Number(value) : value,
    }));

    // 🔹 Mobile validation
    if (name === "mobile") {
      if (!/^\d*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          mobile: "Only numbers allowed",
        }));
      } else if (value.length > 0 && value.length < 10) {
        setErrors((prev) => ({
          ...prev,
          mobile: "Mobile number must be 10 digits",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          mobile: "",
        }));
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // prevent double submit

    setLoading(true);

    const payload: CustomerDetail = { ...form };
    delete (payload as any).sameAsBilling;

    try {
      //  Loading
      showLoading(
        isEditMode
          ? "Updating Customer..."
          : "Creating Customer..."
      );

      if (isEditMode && initialData?.id) {
        await updateCustomerByCustomerCode(
          initialData.id,
          payload
        );
      } else {
        await createCustomer(payload);
      }

      //  Success
      closeSwal();

      showSuccess(
        isEditMode
          ? "Customer updated successfully!"
          : "Customer created successfully!"
      );

      onSubmit?.(payload);
      handleClose();

    } catch (error) {
      console.error("Customer save error:", error);

      closeSwal();
      showApiError(error);

    } finally {
      setLoading(false);
    }
  };



  const handleClose = () => {
    if (loading) return;

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
          loading={loading}
          type="submit"
          form="customerForm"
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
      height="75vh"
    >
      <form id="customerForm" onSubmit={handleSubmit} className="h-full flex flex-col">
        {/* Tabs - Sticky Header */}
        <div className="bg-app border-b border-theme px-8 shrink-0">
          <div className="flex gap-8">
            {(["details", "terms", "address"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all flex items-center gap-2
          ${activeTab === tab
                    ? "text-primary border-b-[3px] border-primary"
                    : "text-muted border-b-[3px] border-transparent hover:text-main"
                  }`}
              >
                {/* ICONS KEPT FROM LOGIC 1 */}
                {tab === "details" && <User className="w-4 h-4" />}
                {tab === "terms" && <FileText className="w-4 h-4" />}
                {tab === "address" && <MapPin className="w-4 h-4" />}

                {/* LABELS */}
                {tab === "details"
                  ? "Details"
                  : tab === "terms"
                    ? "Terms"
                    : "Address"}
              </button>
            ))}
          </div>
        </div>


        {/* Scrollable Content Area */}
        <div className=" px-4 py-2 bg-app mt-5">
          {activeTab === "details" && (
            <Card
              title="Basic Information"
              subtitle="Essential customer details"
              icon={<User className="w-5 h-5 text-primary" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <ModalSelect
                  label="Type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  options={[
                    { value: "Individual", label: "Individual" },
                    { value: "Company", label: "Company" },
                  ]}
                />

                <ModalInput
                  label="Customer Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />

                <ModalInput
                  label="Contact Person Name"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  placeholder="Primary contact"
                />

                <ModalSelect
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

                <ModalInput
                  label="TPIN"
                  name="tpin"
                  value={form.tpin}
                  onChange={handleChange}
                  required
                  placeholder="Tax identification"
                />

                <ModalSelect
                  label="Tax Category"
                  name="customerTaxCategory"
                  value={form.customerTaxCategory}
                  onChange={handleChange}
                  options={[
                    { value: "Export", label: "Export" },
                    { value: "Non-Export", label: "Non-Export" },
                    { value: "LPO", label: "LPO" },
                  ]}
                />

                <ModalSelect
                  label="Currency"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  options={[
                    { value: "ZMW", label: "ZMW" },
                    { value: "USD", label: "USD" },
                    { value: "INR", label: "INR" },
                  ]}
                />

                <ModalInput
                  label="Bank Account"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  placeholder="Account number"
                />

                <ModalInput
                  label="Onboard Balance"
                  name="onboardingBalance"
                  type="number"
                  value={form.onboardingBalance}
                  onChange={handleChange}
                  placeholder="0.00"
                />

                <ModalInput
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />

                <ModalInput
                  label="Mobile"
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  error={errors.mobile}
                />

              </div>
            </Card>
          )}

          {activeTab === "terms" && (
            <TermsAndCondition
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
              <AddressBlock
                type="billing"
                title="Billing Address"
                subtitle="Invoice and payment details"
                data={{
                  line1: form.billingAddressLine1 ?? "",
                  line2: form.billingAddressLine2 ?? "",
                  postalCode: form.billingPostalCode ?? "",
                  city: form.billingCity ?? "",
                  state: form.billingState ?? "",
                  country: form.billingCountry ?? "",
                }}
                onChange={(e) => {
                  const { name, value } = e.target;

                  const map: Record<string, keyof typeof form> = {
                    line1: "billingAddressLine1",
                    line2: "billingAddressLine2",
                    postalCode: "billingPostalCode",
                    city: "billingCity",
                    state: "billingState",
                    country: "billingCountry",
                  };

                  setForm((prev) => ({
                    ...prev,
                    [map[name]]: value,
                  }));
                }}
              />


              {/* Shipping Address */}
              <AddressBlock
                type="shipping"
                title="Shipping Address"
                subtitle="Delivery location"
                data={{
                  line1: form.shippingAddressLine1 ?? "",
                  line2: form.shippingAddressLine2 ?? "",
                  postalCode: form.shippingPostalCode ?? "",
                  city: form.shippingCity ?? "",
                  state: form.shippingState ?? "",
                  country: form.shippingCountry ?? "",
                }}
                sameAsBilling={form.sameAsBilling}
                onSameAsBillingChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    sameAsBilling: checked,
                  }))
                }
                onChange={(e) => {
                  const { name, value } = e.target;

                  const map: Record<string, keyof typeof form> = {
                    line1: "shippingAddressLine1",
                    line2: "shippingAddressLine2",
                    postalCode: "shippingPostalCode",
                    city: "shippingCity",
                    state: "shippingState",
                    country: "shippingCountry",
                  };

                  setForm((prev) => ({
                    ...prev,
                    [map[name]]: value,
                  }));
                }}
              />


            </div>
          )}

        </div>
      </form>
    </Modal>
  );
};

export default CustomerModal;
