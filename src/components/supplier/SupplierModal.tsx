import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  Plus,
  Minus
} from "lucide-react";
 
const base_url = import.meta.env.VITE_BASE_URL;
const Supplier_ENDPOINT = `${base_url}.customer.customer.create_supplier_api`;
const UPDATE_Supplier_ENDPOINT = `${base_url}.customer.customer.update_supplier_by_id`;
console.log("Supplier_ENDPOINT" + Supplier_ENDPOINT);

const emptyForm: Record<string, any> = {
  supplier_name: "",
  supplier_type: "Individual",
  custom_supplier_tpin: "",
  supplier_currency: "",
  supplier_onboarding_balance: 0,
  mobile_no: "",
  ssn: "",
  custom_contact_person: "",
  custom_display_name: "",
  supplier_email: "",
  supplier_account_no: "",
  custom_billing_address_line_1: "",
  custom_billing_address_line_2: "",
  custom_billing_postal_code: "",
  custom_billing_city: "",
  custom_billing_state: "",
  custom_billing_country: "",
  custom_shipping_address_line_1: "",
  custom_shipping_address_line_2: "",
  custom_shipping_postal_code: "",
  custom_shipping_city: "",
  custom_shipping_state: "",
  custom_shipping_country: "",
  sameAsBilling: true,
};

const currencyOptions = [
  "ZMW", "USD", "INR"
];

const SupplierModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Record<string, any>) => void;
  initialData?: Record<string, any> | null;
  isEditMode?: boolean;
}> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
    const [form, setForm] = useState<Record<string, any>>(emptyForm);
    const [loading, setLoading] = useState(false);
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
          custom_shipping_address_line_1: prev.custom_billing_address_line_1 ?? "",
          custom_shipping_address_line_2: prev.custom_billing_address_line_2 ?? "",
          custom_shipping_postal_code: prev.custom_billing_postal_code ?? "",
          custom_shipping_city: prev.custom_billing_city ?? "",
          custom_shipping_state: prev.custom_billing_state ?? "",
          custom_shipping_country: prev.custom_billing_country ?? "",
        }));
      }
    }, [
      form.sameAsBilling,
      form.custom_billing_address_line_1,
      form.custom_billing_address_line_2,
      form.custom_billing_postal_code,
      form.custom_billing_city,
      form.custom_billing_state,
      form.custom_billing_country
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

    if (isEditMode && initialData?.custom_id) {
      payload.id = initialData.custom_id;
      console.log("payload.id " + initialData.custom_id);
      
      const updateUrl = `${UPDATE_Supplier_ENDPOINT}?id=${initialData.custom_id}`;

      response = await fetch(updateUrl, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: import.meta.env.VITE_AUTHORIZATION,
        },
        body: JSON.stringify(payload),
      });
    } else {
      response = await fetch(Supplier_ENDPOINT, {
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
      throw new Error(err.message || "Failed to save supplier");
    }

    const data = await response.json();

    console.log(isEditMode ? "Supplier updated successfully!" : "Customer created successfully!");
    onSubmit?.({} as any);
    
    handleClose();
  } catch (err: any) {
    console.error("Save supplier error:", err);
    console.log(err.message || "Something went wrong");
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
                 {(["details", "terms", "address"] as const).map((tab) => (
                   <button
                     key={tab}
                     type="button"
                     onClick={() => setActiveTab(tab)}
                     className={`px-3 py-3 font-medium text-sm capitalize transition-colors ${activeTab === tab
                       ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                       : "text-gray-600 hover:text-gray-900"
                       }`}
                   >
                     {tab === "details" ? "Details" : tab === "address" ? "Address" : null}
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
                         Supplier Details
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                         <label className="flex flex-col gap-1 text-sm">
                           <span className="font-medium text-gray-600">
                             Supplier Type *
                           </span>
                           <select
                             name="supplier_type"
                             value={form.supplier_type}
                             onChange={handleChange}
                             className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                             required
                           >
                             <option value="Individual">Individual</option>
                             <option value="Company">Company</option>
                           </select>
                         </label>
                         <Input
                           label="Supplier Name"
                           name="supplier_name"
                           value={form.supplier_name}
                           onChange={handleChange}
                           placeholder="Acme Corp"
                           required
                         />
                         <Input
                               label="Contact Person"
                               name="custom_contact_person"
                               type="custom_contact_person"
                               value={form.custom_contact_person}
                               onChange={handleChange}
                               placeholder="e.g. Timothy"
                         />
                         <label className="flex flex-col gap-1 text-sm">
   <span className="font-medium text-gray-600">Display Name *</span>
   <select
     name="custom_display_name"
     value={form.custom_display_name || ""}
     onChange={handleChange}
     className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
     required
   >
     <option value="" disabled>
       Select Name
     </option>
     {form.supplier_name && (
       <option value={form.supplier_name}>
         {form.supplier_name} 
       </option>
     )}
     {form.custom_contact_person && (
       <option value={form.custom_contact_person}>
         {form.custom_contact_person} 
       </option>
     )}
     {!form.supplier_name && !form.custom_contact_person && (
       <option value="" disabled>
          
       </option>
     )}
   </select>
 </label>
                         {form.supplier_type === "Individual" && (
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
                         {form.supplier_type === "Company" && (
                           <>
                             <Input
                               label="Customer TPIN"
                               name="custom_supplier_tpin"
                               value={form.custom_supplier_tpin}
                               onChange={handleChange}
                               placeholder="TP12345678"
                               required
                             />
                           </>
                         )}
                         <label className="flex flex-col gap-1 text-sm">
                           <span className="font-medium text-gray-600">Currency</span>
                           <select
                             name="supplier_currency"
                             value={form.supplier_currency ?? ""}
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
                           name="supplier_account_no"
                           value={form.supplier_account_no}
                           onChange={handleChange}
                           placeholder="Bank Account"
                        />
                        <Input
                              label="Onboard Balance"
                              name="customer_onboarding_balance"
                              type="customer_onboarding_balance"
                              value={form.customer_onboarding_balance}
                              onChange={handleChange}
                              placeholder="e.g. 1000"
                        />
                         <Input
                           label="Email"
                           name="supplier_email"
                           type="supplier_email"
                           value={form.supplier_email}
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
                       </div>
                     </div>
 
                     <div className="my-6  bg-gray-300" />
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
                            name="custom_billing_address_line_1"
                            value={form.custom_billing_address_line_1 ?? ""}
                            onChange={handleChange}
                            placeholder="Street, Apartment"
                          />
                          <Input
                            label="Line 2"
                            name="custom_billing_address_line_2"
                            value={form.custom_billing_address_line_2 ?? ""}
                            onChange={handleChange}
                            placeholder="Landmark, City"
                          />
                          <Input
                            label="Postal Code"
                            name="custom_billing_postal_code"
                            value={form.custom_billing_postal_code ?? ""}
                            onChange={handleChange}
                            placeholder="Postal Code"
                          />
                          <Input
                            label="City"
                            name="custom_billing_city"
                            value={form.custom_billing_city ?? ""}
                            onChange={handleChange}
                            placeholder="City"
                          />
                          <Input
                            label="State"
                            name="custom_billing_state"
                            value={form.custom_billing_state ?? ""}
                            onChange={handleChange}
                            placeholder="State"
                          />
                          <Input
                            label="Country"
                            name="custom_billing_country"
                            value={form.custom_billing_country ?? ""}
                            onChange={handleChange}
                            placeholder="Country"
                          />
                        </div>
                      </div>

                      {/* ========== SHIPPING ADDRESS ========== */}
                      <div className="rounded-lg border border-gray-300 bg-white shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-700 underline">
                            Shipping Address
                          </h3>

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

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Line 1"
                            name="custom_shipping_address_line_1"
                            value={form.custom_shipping_address_line_1 ?? ""}
                            onChange={handleChange}
                            placeholder="Street, Apartment"
                            disabled={form.sameAsBilling}
                          />
                          <Input
                            label="Line 2"
                            name="custom_shipping_address_line_2"
                            value={form.custom_shipping_address_line_2 ?? ""}
                            onChange={handleChange}
                            placeholder="Landmark, City"
                            disabled={form.sameAsBilling}
                          />
                          <Input
                            label="Postal Code"
                            name="custom_shipping_postal_code"
                            value={form.custom_shipping_postal_code ?? ""}
                            onChange={handleChange}
                            placeholder="Postal Code"
                            disabled={form.sameAsBilling}
                          />
                          <Input
                            label="City"
                            name="custom_shipping_city"
                            value={form.custom_shipping_city ?? ""}
                            onChange={handleChange}
                            placeholder="City"
                            disabled={form.sameAsBilling}
                          />
                          <Input
                            label="State"
                            name="custom_shipping_state"
                            value={form.custom_shipping_state ?? ""}
                            onChange={handleChange}
                            placeholder="State"
                            disabled={form.sameAsBilling}
                          />
                          <Input
                            label="Country"
                            name="custom_shipping_country"
                            value={form.custom_shipping_country ?? ""}
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
                     {isEditMode ? "Update" : "Save"} Supplier
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
          value={props.value ?? ""}
        />
      </div>
    </label>
  )
);
Input.displayName = "Input";

export default SupplierModal;