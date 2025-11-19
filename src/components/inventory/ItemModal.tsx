import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialData?: any; // Optional initial data (edit mode)
}

// Use a flexible type instead of strict FormData since backend defines full schema
type FormState = Record<string, any>;

const emptyForm: Record<string, any> = {
  // === Basic Info ===
  item_type: "Goods",                     // Important default
  items_name: "",
  description: "",
  item_group: "",
  hsn_sac_unspc: "",
  unit_of_measurement: "Nos",             // Common default
  sku: "",

  // === Sales & Purchase ===
  selling_price: 0,
  sales_account: "",
  purchase_price: 0,
  purchase_account: "",
  tax_preference: "Taxable",              // Important default
  tax_rate: 0,
  preferred_vendor: "",

  // === Inventory ===
  track_inventory: true,                  // Most items are tracked
  opening_stock: 0,
  opening_stock_value: 0,
  min_stock_level: 0,
  max_stock_level: 0,
  reorder_level: 0,
  valuation_method: "FIFO",               // Common default
  tracking_method: "None",                // None, Batch, Serial, IMEI

  // === Physical ===
  weight: 0,
  weight_unit: "kg",
  dimensions: "",
  brand: "",

  // === Status & Flags ===
  is_active: true,
  allow_alternative_unit: false,
  has_batch_or_serial: false,
};

const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState<FormState>(emptyForm);

  // Fixed tab typo & duplicate value
  const [activeTab, setActiveTab] = useState<"details" | "taxDetails" | "inventoryDetails">("details");

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setForm(initialData || emptyForm);
      setActiveTab("details");
    }
  }, [isOpen, initialData]);

  const handleForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setForm(emptyForm);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    reset();
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
          className="w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form onSubmit={submit} className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
              <h2 className="text-2xl font-semibold text-blue-700">Add Items</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </header>

            {/* Tabs */}
            <div className="flex border-b bg-gray-50">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "details"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Item Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("taxDetails")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "taxDetails"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tax Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("inventoryDetails")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "inventoryDetails"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Inventory Details
              </button>
            </div>

            {/* Tab Content */}
            <section className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="gap-6 max-h-screen overflow-auto p-4">
                {activeTab === "details" && (
                  <>
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                      Items Information
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">Item Type *</span>
                          <select
                            name="itemType"
                            value={form.itemType || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                            <option value="Goods">Goods</option>
                            <option value="Service">Service</option>
                          </select>
                        </label>

                        <Input label="Items Name" name="itemsName" value={form.itemsName || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Description" name="description" value={form.description || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Item Group" name="itemsGroup" value={form.itemsGroup || ""} onChange={handleForm} className="w-full" />
                        <Input label="HSN/SAC/UNSPC" name="unspc" value={form.unspc || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Unit of Measurement" name="unitOfMeasurement" value={form.unitOfMeasurement || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="SKU" name="sku" value={form.sku || ""} onChange={handleForm} className="w-full col-span-3" />
                      </div>
                    </div>

                    <h3 className="py-6 text-lg font-semibold text-gray-700 underline">
                      Sales & Purchase
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input label="Selling Price" name="sellingPrice" value={form.sellingPrice || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Sales Account" name="salesAccount" value={form.salesAccount || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Purchase Account" name="purchaseAccount" value={form.purchaseAccount || ""} onChange={handleForm} className="w-full" />
                        <Input label="Tax" name="tax" value={form.tax || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Preferred Vendor" name="prefferedVendor" value={form.prefferedVendor || ""} onChange={handleForm} className="w-full col-span-3" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "taxDetails" && (
                  <>
                  <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                    Tax Details
                  </h3>
                 <div className="flex flex-col justify-center gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        <div className=" grid col-span-1 gap-4">
                          <h4 className=" flex justify-center text-base font-semibold text-black">Export</h4>
                          <div className=" flex justify-between">
                          <div>Tax Category</div>
                          <div>Tax %</div>
                          </div>
                        </div>
                        <div className=" grid col-span-1 gap-4">
                          <h4 className=" flex justify-center text-base font-semibold text-black">Non-Export</h4>
                          <div>Tax Category</div>
                          <div>Tax %</div>
                        </div>
                        <div className=" grid col-span-1 gap-4">
                          <h4 className=" flex justify-center text-base font-semibold text-black">Local Purchase Order</h4>
                          <div>Tax Category</div>
                          <div>Tax %</div>
                        </div>
                      </div>
                  </div>
                  </>
                )}

                {activeTab === "inventoryDetails" && (
                  <>
                    <h3 className=" mb-2 text-lg font-semibold text-gray-700 underline">Inventory Details</h3>
                   <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Brand"
                          name="brand"
                          value={form.brand}
                          onChange={handleForm}
                          className="w-full"
                        /> 
                        <Input
                          label="Dimensions"
                          name="dimensions"
                          value={form.dimensions}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Weight"
                          name="weight"
                          value={form.weight}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">Valuation Method</span>
                          <select
                            name="valutaionMethod"
                            value={form.valutaionMethod || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                            <option value="Goods">FIFO</option>
                            <option value="Service">WAC</option>
                          </select>
                        </label>
                        
                      </div>
                     </div>
                    

                      <h3 className=" py-6 text-lg font-semibold text-gray-700 underline">Stock Level Tracking</h3>
                   <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Min Stock Level"
                          name="minStockLevel"
                          value={form.minStockLevel}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Max Stock Level"
                          name="maxStockLevel"
                          value={form.maxStockLevel}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Re-order Level"
                          name="reOrderLevel"
                          value={form.reOrderLevel}
                          onChange={handleForm}
                          className="w-full"
                        />
                        
                        <Input
                          label="Track Inventory"
                          name="trackInventory"
                          value={form.trackInventory}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                                                
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">
                            Tracking Method
                          </span>
                          <select
                            name="Tracking Method"
                            value={form.itemType}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                            <option value="Individual">Normal</option>
                            <option value="Company">Batch</option>
                            <option value="Company">SR No</option>
                            <option value="Company">IMEI</option>
                          </select>
                        </label>
                      </div>
                     </div> 
                      </>
                )}
              </div>
            </section>

            {/* Footer */}
            <footer className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
              <button
                type="button"
                onClick={onClose}
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
                  className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save Item
                </button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Input component unchanged
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <span className="font-medium text-gray-600">{label}</span>
    <input
      ref={ref}
      className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        props.disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    />
  </label>
));
Input.displayName = "Input";

export default ItemModal;