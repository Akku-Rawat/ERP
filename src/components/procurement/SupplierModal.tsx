import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Building2, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/modal/modal";
import { Input, Select, Card, Button } from "../ui/modal/formComponent";

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
  const [activeTab, setActiveTab] = useState<"supplier" | "payment">(
    "supplier",
  );

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

  // Footer
  const footer = (
    <>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const tabs: Array<"supplier" | "payment"> = ["supplier", "payment"];
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex < tabs.length - 1) {
              setActiveTab(tabs[currentIndex + 1]);
            }
          }}
          disabled={activeTab === "payment"}
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
          {isEditMode ? "Update Supplier" : "Save Supplier"}
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Supplier" : "Add New Supplier"}
      subtitle={
        isEditMode
          ? "Update supplier information"
          : "Fill in the details to create a new supplier"
      }
      icon={Building2}
      footer={footer}
      maxWidth="6xl"
      height="90vh"
    >
      <div className="h-full flex flex-col">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Tabs - EXACT CustomerModal */}
          <div className="flex gap-1 -mx-6 -mt-6 px-6 pt-4 bg-app sticky top-0 z-10 shrink-0">
            {(["supplier", "payment"] as const).map((tab) => (
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
                  {tab === "supplier" && <Building2 className="w-4 h-4" />}
                  {tab === "payment" && <DollarSign className="w-4 h-4" />}
                  {tab}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeSupplierTab"
                    className="absolute inset-0 bg-card rounded-t-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-1 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "supplier" && (
                  <Card
                    title="Supplier Information"
                    subtitle="Supplier, contact and address details"
                    icon={<Building2 className="w-5 h-5 text-primary" />}
                  >
                    <div className="space-y-6">
                      {/* ================= SUPPLIER DETAILS ================= */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Supplier Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                          <Input
                            label="Tax Id / TPIN"
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

                      {/* ================= DIVIDER ================= */}
                      <div className="border-t border-gray-200" />

                      {/* ================= CONTACT DETAILS ================= */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">
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
                            icon={<Mail className="w-4 h-4" />}
                          />
                        </div>
                      </div>

                      {/* ================= DIVIDER ================= */}
                      <div className="border-t border-gray-200" />

                      {/* ================= ADDRESS DETAILS ================= */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">
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
                    </div>
                  </Card>
                )}

                {activeTab === "payment" && (
                  <Card
                    title="Payment & Bank Details"
                    subtitle="Payment terms and bank information"
                    icon={<DollarSign className="w-5 h-5 text-primary" />}
                  >
                    {/* ================= PAYMENT DETAILS ================= */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Payment Details
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        {/* Currency */}
                        <Select
                          label="Currency"
                          name="currency"
                          value={form.currency || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select currency...</option>
                          {currencyOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </Select>

                        {/* Payment Terms */}
                        <Input
                          label="Payment Terms (Days)"
                          name="paymentTerms"
                          value={form.paymentTerms || ""}
                          onChange={handleChange}
                        />

                        {/* Date of Addition */}
                        <Input
                          label="Date of Addition"
                          name="dateOfAddition"
                          type="date"
                          value={form.dateOfAddition || ""}
                          onChange={handleChange}
                        />

                        {/* Opening Balance */}
                        <Input
                          label="Opening Balance"
                          name="openingBalance"
                          type="number"
                          value={form.openingBalance || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* ================= DIVIDER ================= */}
                    <div className="my-6 border-t border-gray-200" />

                    {/* ================= BANK DETAILS ================= */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700">
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
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </form>
      </div>
    </Modal>
  );
};

// Input Component (unchanged)
// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   icon?: React.ReactNode;
// }

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ label, icon, className = "", ...props }, ref) => (
//     <label className="flex flex-col gap-1 text-sm w-full">
//       <span className="font-medium text-gray-600">
//         {label}
//         {props.required && <span className="text-red-500 ml-1">*</span>}
//       </span>
//       <div className="relative">
//         {icon && (
//           <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
//             {icon}
//           </div>
//         )}
//         <input
//           ref={ref}
//           className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
//             icon ? "pl-10" : ""
//           } ${props.disabled ? "bg-gray-50" : ""} ${className}`}
//           {...props}
//         />
//       </div>
//     </label>
//   ),
// );
// Input.displayName = "Input";

export default SupplierModal;
