import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { updateItemByItemCode, createItem } from "../../api/itemApi";
import ItemCategorySelect from "../selects/ItemCategorySelect";
import { getItemGroupById } from "../../api/itemCategoryApi";
import ItemGenericSelect from "../selects/ItemGenericSelect";
import ItemTreeSelect from "../selects/ItemTreeSelect";
import {
  getPackagingUnits,
  getCountries,
  getUOMs,
  getItemClasses,
} from "../../api/itemZraApi";
import Select from "../ui/Select";

type FormState = Record<string, any>;

const emptyForm: Record<string, any> = {
  id: "",
  itemName: "",
  itemGroup: "",
  itemClassCode: "",
  itemTypeCode: "",
  originNationCode: "",
  packagingUnitCode: "",
  svcCharge: "Y",
  ins: "Y",
  sellingPrice: 0,
  buyingPrice: 0,
  unitOfMeasureCd: "Nos",
  description: "",
  sku: "",
  taxPreference: "",
  preferredVendor: "",
  salesAccount: "",
  purchaseAccount: "",
  taxCategory: "Non-Export",
  taxType: "",
  taxCode: "",
  taxName: "",
  taxDescription: "",
  taxPerct: "",
  dimensionUnit: "",
  weight: "",
  valuationMethod: "",
  trackingMethod: "",
  reorderLevel: "",
  minStockLevel: "",
  maxStockLevel: "",
  brand: "",
  weightUnit: "",
  dimensionLength: "",
  dimensionWidth: "",
  dimensionHeight: "",
};

const itemTypeCodeOptions = [
  { value: 1, label: "Raw Material" },
  { value: 2, label: "Finished Product" },
  { value: 3, label: "Service" },
] as const;

const ItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  // onSubmit?: (data: Record<string, any>) => void;
  onSubmit?: () => void;
  initialData?: Record<string, any> | null;
  isEditMode?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetchingItem, setFetchingItem] = useState(false);
  const [itemCategoryDetails, setItemCategoryDetails] = useState<any>(null);
  const isServiceItem = Number(form.itemTypeCode) === 3;


  const [activeTab, setActiveTab] = useState<
    "details" | "taxDetails" | "inventoryDetails"
  >("details");

  useEffect(() => {
    if (isOpen) {
      setForm(initialData || emptyForm);
      setActiveTab("details");
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form };

      let response;

      if (isEditMode && initialData?.id) {
        response = await updateItemByItemCode(initialData.id, payload);
      } else {
        response = await createItem(payload);
      }
      onSubmit?.();
    } catch (err: any) {
      let errorMessage = "Something went wrong while saving the item.";

      if (err.response?.data) {
        const data = err.response.data;

        if (data._server_messages) {
          try {
            const msgs = JSON.parse(data._server_messages);
            errorMessage = msgs
              .map((m: string) => {
                try {
                  return JSON.parse(m).message || "";
                } catch {
                  return m;
                }
              })
              .filter(Boolean)
              .join("\n");
          } catch {}
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage, {
        duration: 8000,
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const loadItemCategoryDetailsById = async (id: string) => {
    try {
      const response = await getItemGroupById(id);
      if (!response || response.status_code !== 200) return;
      setForm((p) => ({ ...p, item_group: response.data.name }));
      setItemCategoryDetails(response.data);
    } catch (err) {
      toast.error("Error loading item category details:");
    }
  };

  const handleForm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setForm(emptyForm);
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
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
              <h2 className="text-2xl font-semibold text-blue-700">
                Add Items
              </h2>
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
  disabled={isServiceItem}
  onClick={() => !isServiceItem && setActiveTab("inventoryDetails")}
  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors
    ${
      activeTab === "inventoryDetails" && !isServiceItem
        ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
        : "text-gray-600 hover:text-gray-900"
    }
    ${isServiceItem ? "opacity-50 cursor-not-allowed" : ""}
  `}
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
                        <Select
                          label="Item Type"
                          name="itemTypeCode"
                          value={form.itemTypeCode || ""}
                          onChange={handleForm}
                          options={itemTypeCodeOptions}
                        ></Select>

                        <ItemCategorySelect
                          value={form.itemGroup}
                          onChange={async ({ name, id }) => {
                            setForm((p) => ({ ...p, itemGroup: name }));
                            await loadItemCategoryDetailsById(id);
                          }}
                          className="w-full"
                        />

                        <Input
                          label="Items Name"
                          name="itemName"
                          value={form.itemName || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                          required
                        />
                        <Input
                          label="Description"
                          name="description"
                          value={form.description || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <ItemTreeSelect
                          label="Item Class"
                          value={form.itemClassCode}
                          fetchData={getItemClasses}
                          onChange={({ id }) =>
                            setForm((p) => ({ ...p, itemClassCode: id }))
                          }
                        />
                        <ItemGenericSelect
                          label="Packaging Unit"
                          value={form.packagingUnitCode}
                          fetchData={getPackagingUnits}
                          onChange={({ id }) =>
                            setForm((p) => ({ ...p, packagingUnitCode: id }))
                          }
                        />

                        <ItemGenericSelect
                          label="Country Code"
                          value={form.originNationCode}
                          fetchData={getCountries}
                          onChange={({ id }) =>
                            setForm((p) => ({ ...p, originNationCode: id }))
                          }
                        />

                        <ItemGenericSelect
                          label="Unit of Measurement  "
                          value={form.unitOfMeasureCd}
                          fetchData={getUOMs}
                          onChange={({ id }) =>
                            setForm((p) => ({ ...p, unitOfMeasureCd: id }))
                          }
                        />

                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">
                            Service Charge
                          </span>
                          <select
                            name="svcCharge"
                            value={form.svcCharge || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">
                            INSURANCE
                          </span>
                          <select
                            name="ins"
                            value={form.ins || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        </label>
                        <Input
                          label="SKU"
                          name="sku"
                          value={form.sku || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                      </div>
                    </div>

                    <h3 className="py-6 text-lg font-semibold text-gray-700 underline">
                      Sales & Purchase
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Selling Price"
                          name="sellingPrice"
                          value={form.sellingPrice || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Sales Account"
                          name="salesAccount"
                          value={form.salesAccount || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Buying Price"
                          name="buyingPrice"
                          value={form.buyingPrice || ""}
                          onChange={handleForm}
                          className="w-full"
                        />
                        <Input
                          label="Purchase Account"
                          name="purchaseAccount"
                          value={form.purchaseAccount || ""}
                          onChange={handleForm}
                          className="w-full"
                        />
                        <select
                          name="taxPreference"
                          value={form.taxPreference || ""}
                          onChange={handleForm}
                          className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          required
                        >
                          <option value="Taxable">Taxable</option>
                          <option value="Non-Taxable">Non-Taxable</option>
                        </select>
                        <Input
                          label="Preferred Vendor"
                          name="preferredVendor"
                          value={form.preferredVendor || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "taxDetails" && (
                  <>
                    {/* Tax Category Selector */}
                    <div className="mb-8">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tax Category
                      </label>
                      <select
                        name="taxCategory"
                        value={form.taxCategory || "Non-Export"}
                        onChange={handleForm}
                        className="w-full md:w-96 px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Non-Export">Non-Export</option>
                        <option value="Export">Export</option>
                        <option value="LPO">Local Purchase Order</option>
                      </select>

                      <p className="mt-2 text-sm text-gray-600">
                        {form.taxCategory === "Non-Export" &&
                          "Standard tax rates for domestic sales"}
                        {form.taxCategory === "Export" &&
                          "Zero-rated or exempt tax for international sales"}
                        {form.taxCategory === "LPO" &&
                          "Tax rates applicable to local purchases"}
                      </p>
                    </div>

                    {/* Dynamic Tax Form based on selected category */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                        {form.taxCategory === "Non-Export" &&
                          "Non-Export Tax Details"}
                        {form.taxCategory === "Export" && "Export Tax Details"}
                        {form.taxCategory === "local-purchase" &&
                          "Local Purchase Order Tax Details"}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input
                          label="Tax Type"
                          name="taxType"
                          value={form.taxType || ""}
                          onChange={handleForm}
                          placeholder="e.g. VAT"
                          className="w-full"
                        />
                        <Input
                          label="Tax Code"
                          name="taxCode"
                          value={form.taxCode || ""}
                          onChange={handleForm}
                          placeholder="V001"
                          className="w-full"
                        />
                        <Input
                          label="Tax Name"
                          name="taxName"
                          value={form.taxName || ""}
                          onChange={handleForm}
                          placeholder="Standard VAT"
                          className="w-full"
                        />
                        <div className="md:col-span-2">
                          <Input
                            label="Description"
                            name="taxDescription"
                            value={form.taxDescription || ""}
                            onChange={handleForm}
                            placeholder="12% VAT on Non-Export"
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-gray-600">
                            Tax Percentage (%)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              name="taxPerct"
                              value={form.taxPerct || ""}
                              onChange={handleForm}
                              placeholder="12"
                              className="w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-indigo-900 mb-2">
                        Current Configuration
                      </h4>
                      <div className="text-sm text-indigo-800">
                        <p>
                          <span className="font-medium">Category:</span>{" "}
                          {form.taxCategory === "Non-Export" && "Non-Export"}
                          {form.taxCategory === "Export" && "Export"}
                          {form.taxCategory === "local-purchase" &&
                            "Local Purchase Order"}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "inventoryDetails" && (
                  <>
                    <h3 className=" mb-2 text-lg font-semibold text-gray-700 underline">
                      Inventory Details
                    </h3>
                    <div className="flex flex-col gap-4">
                    
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                        
                          label="Brand"
                          name="brand"
                          value={form.brand}
                          onChange={handleForm}
                          className="w-full"
                          disabled={isServiceItem}
                        />

                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-600 text-sm">
                            Dimensions (L × W × H)
                          </span>
                          <div className="flex items-center gap-1">
                            <Input
                              label=""
                              name="dimensionLength"
                              placeholder="L"
                              value={form.dimensionLength || ""}
                              onChange={handleForm}
                              className="w-full text-center text-xs"
                            />

                            <span className="text-gray-500 font-medium">×</span>

                            <Input
                              label=""
                              name="dimensionWidth"
                              placeholder="W"
                              value={form.dimensionWidth || ""}
                              onChange={handleForm}
                              className="w-full text-center text-xs"
                            />

                            <span className="text-gray-500 font-medium">×</span>

                            <Input
                              label=""
                              name="dimensionHeight"
                              placeholder="H"
                              value={form.dimensionHeight || ""}
                              onChange={handleForm}
                              className="w-full text-center text-xs"
                            />

                            <select
                              name="dimensionUnit"
                              value={form.dimensionUnit || "cm"}
                              onChange={handleForm}
                              className="w-16 px-1 py-1.5 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                              <option value="cm">cm</option>
                              <option value="in">in</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-600 text-sm">
                            Weight
                          </span>
                          <div className="flex gap-2">
                            <Input
                              label=""
                              name="weight"
                              placeholder="0"
                              value={form.weight}
                              onChange={handleForm}
                              className="flex-1"
                            />
                            <select
                              name="weightUnit"
                              value={form.weightUnit}
                              onChange={handleForm}
                              // className="w-28 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              className="w-16 px-1 py-1.5 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                              <option value="gm">gm</option>
                              <option value="kg">kg</option>
                              <option value="lbs">lbs</option>
                              <option value="oz">oz</option>
                            </select>
                          </div>
                        </div>

                        {/* Valuation Method */}
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">
                            Valuation Method
                          </span>
                          <select
                            name="valuationMethod"
                            value={form.valuationMethod}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                          >
                            <option value="">Select...</option>
                            <option value="FIFO">FIFO</option>
                            <option value="WAC">WAC</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className=" mt-6 col-span-full lg:col-span-4 xl:col-span-3 space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="trackInventory"
                          name="trackInventory"
                          checked={form.trackInventory || false}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              trackInventory: e.target.checked,
                            }))
                          }
                          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <label
                          htmlFor="trackInventory"
                          className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                        >
                          Track Inventory
                        </label>
                      </div>

                      {form.trackInventory && (
                        <div className="ml-8 max-w-md">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Tracking Method
                          </label>
                          <select
                            name="trackingMethod"
                            value={form.trackingMethod || ""}
                            onChange={handleForm}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          >
                            <option value="">Select tracking method...</option>
                            <option value="none">Normal (No tracking)</option>
                            <option value="batch">Batch</option>
                            <option value="serial">
                              Serial Number (SR No)
                            </option>
                            <option value="imei">IMEI</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <h3 className=" mt-12 text-lg font-semibold text-gray-700 underline">
                      Stock Level Tracking
                    </h3>
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
                          name="reorderLevel"
                          value={form.reorderLevel}
                          onChange={handleForm}
                          className="w-full"
                        />
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
                  // onClick={submit}
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
