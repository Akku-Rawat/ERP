import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateItemByItemCode, createItem } from "../../api/itemApi";

import { getItemGroupById } from "../../api/itemCategoryApi";


import Modal from "../ui/modal/modal";
import { Button } from "../../components/ui/modal/formComponent";
import { useCompanySelection } from "../../hooks/useCompanySelection";
import { getItemFieldConfigs } from "../../config/companyConfigResolver";
import { DynamicField } from "../DynamicField";


type FormState = Record<string, any>;

const emptyForm: Record<string, any> = {
  id: "",
  itemName: "",
  itemGroup: "",
  itemClassCode: "",
  itemTypeCode: "",
  originNationCode: "",
  packagingUnitCode: "",
  svcCharge: "",
  ins: "",
  sellingPrice: 0,
  buyingPrice: 0,
  unitOfMeasureCd: "",
  description: "",
  sku: "",
  taxPreference: "",
  preferredVendor: "",
  salesAccount: "",
  purchaseAccount: "",
  taxCategory: " ",
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
  { value: "1", label: "Raw Material" },
  { value: "2", label: "Finished Product" },
  { value: "3", label: "Service" },
];

const TAX_CONFIGS = {
  "Non-Export": {
    taxType: "Standard Rated",
    taxPerct: "16",
    taxCode: "A",
    taxDescription: "Applies to products and services subject to VAT at 16% by default.",
  },
  "LPO": {
    taxType: "Zero-Rated",
    taxPerct: "0",
    taxCode: "C2",
    taxDescription: "Applies to transactions involving customers or projects granted exemption from paying taxes.",
  },
  "Export": {
    taxType: "Export",
    taxPerct: "0",
    taxCode: "C1",
    taxDescription: "Applies to goods or services exported outside the country and exempt from VAT.",
  },
};


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
  const { companyCode } = useCompanySelection();
  const fieldConfigs = getItemFieldConfigs(companyCode);
   console.log('=== ITEM MODAL DEBUG ===');
  console.log('Company Code:', companyCode);
  console.log('Field Configs:', fieldConfigs);
  console.log('First 3 fields:', fieldConfigs.slice(0, 3));
  
  

  const [activeTab, setActiveTab] = useState<
    "details" | "taxDetails" | "inventoryDetails"
  >("details");

useEffect(() => {
  if (!isOpen) return;

  setForm(isEditMode && initialData ? initialData : emptyForm);
  setActiveTab("details");
}, [isOpen]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form, itemTypeCode: Number(form.itemTypeCode) };

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
          } catch { }
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
    >,
  ) => {
    const { name, value } = e.target;
    
    // Auto-populate tax details when tax category changes
    if (name === "taxCategory") {
      const taxConfig = TAX_CONFIGS[value as keyof typeof TAX_CONFIGS];
      if (taxConfig) {
        setForm((prev) => ({
          ...prev,
          [name]: value,
          taxType: taxConfig.taxType,
          taxPerct: taxConfig.taxPerct,
          taxCode: taxConfig.taxCode,
          taxDescription: taxConfig.taxDescription,
        }));
        return;
      }
    }
    
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleDynamicFieldChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = async (data: { name: string; id: string }) => {
    setForm((prev) => ({ ...prev, itemGroup: data.name }));
    await loadItemCategoryDetailsById(data.id);
  };

  const reset = () => {
    setForm(emptyForm);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Item" : "Add Item"}
      subtitle="Create and manage item details"
      maxWidth="6xl"
      height="90vh"
    >
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        {/* Tabs */}
        <div className="bg-app border-b border-theme px-8 shrink-0">
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${activeTab === "details"
                   ? "text-primary border-b-[3px] border-primary"
                  : "text-muted border-b-[3px] border-transparent hover:text-main"
                }`}
            >
              Item Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("taxDetails")}
              className={`py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${activeTab === "taxDetails"
                    ? "text-primary border-b-[3px] border-primary"
                  : "text-muted border-b-[3px] border-transparent hover:text-main"
                }`}
            >
              Tax Details
            </button>
            <button
              type="button"
              disabled={isServiceItem}
              onClick={() => !isServiceItem && setActiveTab("inventoryDetails")}
              className={`py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all flex items-center gap-2
    ${activeTab === "inventoryDetails" && !isServiceItem
                  ? "text-primary border-b-[3px] border-primary"
                  : "text-muted border-b-[3px] border-transparent hover:text-main"
                }
    ${isServiceItem ? "opacity-50 cursor-not-allowed" : ""}
  `}
            >
              Inventory Details
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <section className="flex-1 overflow-y-auto p-4 space-y-6 bg-app">
          <div className="gap-6 max-h-screen overflow-auto p-4">
            {activeTab === "details" && (
              <>
                <h3 className="mb-4 text-lg font-semibold text-main underline">
                  Items Information
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {fieldConfigs.map((fieldConfig) => (
                      <DynamicField
                        key={fieldConfig.fieldName}
                        config={fieldConfig}
                        value={form[fieldConfig.fieldName]}
                        onChange={handleDynamicFieldChange}
                        onApiChange={
                          fieldConfig.fieldName === 'itemGroup' 
                            ? handleCategoryChange 
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </div>

                <h3 className="py-6 text-lg font-semibold text-main underline">
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
                      className="rounded border border-theme bg-card text-main px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                <div className="mb-8 ">
                  <label className="block text-sm font-semibold text-main mb-3">
                    Tax Category
                  </label>
                  <select
                    name="taxCategory"
                    value={form.taxCategory }
                    onChange={handleForm}
                    className="w-full md:w-96 px-4 py-3 text-base border border-theme bg-card text-main rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  > 
                    <option value="">Select...</option>
                    <option value="Non-Export">Non-Export</option>
                    <option value="Export">Export</option>
                    <option value="LPO">Local Purchase Order</option>
                  </select>

                  <p className="mt-2 text-sm text-muted">
                    {form.taxCategory === "Non-Export" &&
                      "Standard tax rates for domestic sales"}
                    {form.taxCategory === "Export" &&
                      "Zero-rated or exempt tax for international sales"}
                    {form.taxCategory === "LPO" &&
                      "Tax rates applicable to local purchases"}
                  </p>
                </div>

                {/* Dynamic Tax Form based on selected category */}
                <div className="bg-app rounded-lg p-6 border border-theme">
                  <h3 className="text-lg font-semibold text-main mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    {form.taxCategory === "Non-Export" &&
                      "Non-Export Tax Details"}
                    {form.taxCategory === "Export" && "Export Tax Details"}
                    {form.taxCategory === "LPO" &&
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
                      disabled
                    />
                    <Input
                      label="Tax Code"
                      name="taxCode"
                      value={form.taxCode || ""}
                      onChange={handleForm}
                      placeholder="V001"
                      className="w-full"
                      disabled
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
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted">
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
                          className="w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-app text-muted cursor-not-allowed"
                          disabled
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted font-medium">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="mt-6 bg-card border border-theme rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-main mb-2">
                    Current Configuration
                  </h4>
                  <div className="text-sm text-muted space-y-1">
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {form.taxCategory === "Non-Export" && "Non-Export"}
                      {form.taxCategory === "Export" && "Export"}
                      {form.taxCategory === "LPO" && "Local Purchase Order"}
                    </p>
                    <p>
                      <span className="font-medium">Tax Type:</span>{" "}
                      {form.taxType || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Tax Code:</span>{" "}
                      {form.taxCode || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Tax Rate:</span>{" "}
                      {form.taxPerct ? `${form.taxPerct}%` : "N/A"}
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeTab === "inventoryDetails" && (
              <>
                <h3 className=" mb-2 text-lg font-semibold text-main underline">
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
                      <span className="font-medium text-muted text-sm">
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

                        <span className="text-muted font-medium">×</span>

                        <Input
                          label=""
                          name="dimensionWidth"
                          placeholder="W"
                          value={form.dimensionWidth || ""}
                          onChange={handleForm}
                          className="w-full text-center text-xs"
                        />

                        <span className="text-muted font-medium">×</span>

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
                          className="w-16 px-1 py-1.5 text-xs border border-theme bg-card text-main rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-muted text-sm">
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
                          // className="w-28 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          className="w-16 px-1 py-1.5 text-xs border border-theme bg-card text-main rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                      <span className="font-medium text-muted">
                        Valuation Method
                      </span>
                      <select
                        name="valuationMethod"
                        value={form.valuationMethod}
                        onChange={handleForm}
                        className="rounded border border-theme bg-card text-main px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full"
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
                      className="w-5 h-5 accent-primary border-theme rounded cursor-pointer"
                    />
                    <label
                      htmlFor="trackInventory"
                      className="text-sm font-medium text-main cursor-pointer select-none"
                    >
                      Track Inventory
                    </label>
                  </div>

                  {form.trackInventory && (
                    <div className="ml-8 max-w-md">
                      <label className="block text-sm font-medium text-muted mb-1">
                        Tracking Method
                      </label>
                      <select
                        name="trackingMethod"
                        value={form.trackingMethod || ""}
                        onChange={handleForm}
                        className="w-full rounded-md border border-theme bg-card text-main px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select tracking method...</option>
                        <option value="none">Normal (No tracking)</option>
                        <option value="batch">Batch</option>
                        <option value="serial">Serial Number (SR No)</option>
                        <option value="imei">IMEI</option>
                      </select>
                    </div>
                  )}
                </div>

                <h3 className=" mt-12 text-lg font-semibold text-main underline">
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
        {/*  FOOTER INSIDE FORM */}
        <div className="flex justify-end gap-2 border-t border-theme px-6 py-4">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="ghost" type="button" onClick={reset}>
            Reset
          </Button>

          <Button variant="primary" loading={loading} type="submit">
            Save Item
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Input component unchanged
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <span className="font-medium text-muted">{label}</span>
    <input
      ref={ref}
      className={`rounded border border-theme px-3 py-2 bg-card text-main 
focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${props.disabled ? "bg-app text-muted cursor-not-allowed" : ""
        } ${className}`}
      {...props}
    />
  </label>
));
Input.displayName = "Input";

export default ItemModal;