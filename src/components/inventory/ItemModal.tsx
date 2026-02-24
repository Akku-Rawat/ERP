import React from "react";
import Modal from "../ui/modal/modal";
import { Button } from "../../components/ui/modal/formComponent";
import { DynamicField } from "../DynamicField";
import { useItemForm } from "../../hooks/Useitemform";

const ItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (res: any) => void;
  initialData?: Record<string, any> | null;
  isEditMode?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const {
    form,
    setForm,
    autoPopulateTax,
    loading,
    activeTab,
    setActiveTab,
    isServiceItem,
    showBatchExpiry,
    fieldConfigs,
    taxConfigs,
    packagingOptions,
    loadingPackaging,
    handleForm,
    handleDynamicFieldChange,
    handleCategoryChange,
    reset,
    handleClose,
    handleSubmit,
  } = useItemForm({ isOpen, isEditMode, initialData, onSubmit, onClose });

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
      <form onSubmit={handleSubmit} noValidate className="h-full flex flex-col">
        <div className="bg-app border-b border-theme px-8 shrink-0">
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "details"
                  ? "text-primary border-b-[3px] border-primary"
                  : "text-muted border-b-[3px] border-transparent hover:text-main"
              }`}
            >
              Item Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("taxDetails")}
              className={`py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "taxDetails"
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
              className={`py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "inventoryDetails" && !isServiceItem
                  ? "text-primary border-b-[3px] border-primary"
                  : "text-muted border-b-[3px] border-transparent hover:text-main"
              } ${isServiceItem ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Inventory Details
            </button>
          </div>
        </div>

        <section className="flex-1 overflow-y-auto p-4 space-y-6 bg-app">
          <div className="gap-6 max-h-screen overflow-auto p-4">
            {activeTab === "details" && (
              <>
                <h3 className="mb-4 text-lg font-semibold text-main underline">
                  Items Information
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {fieldConfigs.map((fieldConfig) => {
                      if (fieldConfig.fieldName === "packagingUnitCode") {
                        return (
                          <label
                            key="packagingUnitCode"
                            className="flex flex-col gap-1 text-sm"
                          >
                            <span className="font-medium text-muted">
                              Packaging Unit{" "}
                              <span className="text-red-500 ml-1">*</span>
                            </span>
                            <select
                              value={form.packagingUnitCode || ""}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  packagingUnitCode: e.target.value,
                                }))
                              }
                              className="rounded border border-theme bg-card text-main px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                              <option value="">
                                {loadingPackaging ? "Loading..." : "Select..."}
                              </option>
                              {packagingOptions.map((item: any) => (
                                <option key={item.code} value={item.code}>
                                  {item.code} - {item.code_name}
                                </option>
                              ))}
                            </select>
                          </label>
                        );
                      }

                      if (fieldConfig.fieldName === "itemClassCode") {
                        return (
                          <Input
                            key="itemClassCode"
                            label="Item Class Code"
                            name="itemClassCode"
                            value={form.itemClassCode || ""}
                            onChange={handleForm}
                            required
                            className="w-full"
                          />
                        );
                      }

                      return (
                        <DynamicField
                          key={fieldConfig.fieldName}
                          config={fieldConfig}
                          value={form[fieldConfig.fieldName]}
                          onChange={handleDynamicFieldChange}
                          onApiChange={
                            fieldConfig.fieldName === "itemGroup"
                              ? handleCategoryChange
                              : undefined
                          }
                          filterValue={form.itemTypeCode}
                        />
                      );
                    })}
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
                      type="number"
                      value={form.sellingPrice || ""}
                      onChange={handleForm}
                      className="w-full col-span-3"
                      required
                    />
                    <Input
                      label="Sales Account"
                      name="salesAccount"
                      value={form.salesAccount || ""}
                      onChange={handleForm}
                      className="w-full col-span-3"
                      required
                    />
                    <Input
                      label="Buying Price"
                      name="buyingPrice"
                      type="number"
                      value={form.buyingPrice || ""}
                      onChange={handleForm}
                      className="w-full"
                      required
                    />
                    <Input
                      label="Purchase Account"
                      name="purchaseAccount"
                      value={form.purchaseAccount || ""}
                      onChange={handleForm}
                      className="w-full"
                      required
                    />
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium text-muted">
                        Tax Preference <span className="text-red-500">*</span>
                      </span>
                      <select
                        name="taxPreference"
                        value={form.taxPreference || ""}
                        onChange={handleForm}
                        className="rounded border border-theme bg-card text-main px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      >
                        <option value="">Select...</option>
                        <option value="Taxable">Taxable</option>
                        <option value="Non-Taxable">Non-Taxable</option>
                      </select>
                    </label>
                    <Input
                      label="Preferred Vendor"
                      name="preferredVendor"
                      value={form.preferredVendor || ""}
                      onChange={handleForm}
                      className="w-full col-span-3"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "taxDetails" && (
              <>
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-main mb-3">
                    Tax Category
                  </label>
                  <select
                    name="taxCategory"
                    value={form.taxCategory}
                    onChange={handleForm}
                    className="w-full md:w-96 px-4 py-3 text-base border border-theme bg-card text-main rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select...</option>
                    {Object.keys(taxConfigs).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-muted">
                    {form.taxCategory &&
                      taxConfigs[form.taxCategory]?.taxDescription}
                  </p>
                </div>

                <div className="bg-app rounded-lg p-6 border border-theme">
                  <h3 className="text-lg font-semibold text-main mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {form.taxCategory
                      ? `${form.taxCategory} Tax Details`
                      : "Tax Details"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Input
                      label="Tax Type"
                      name="taxType"
                      value={form.taxType || ""}
                      onChange={handleForm}
                      placeholder="e.g. VAT"
                      className="w-full"
                      disabled={autoPopulateTax}
                    />
                    <Input
                      label="Tax Code"
                      name="taxCode"
                      value={form.taxCode || ""}
                      onChange={handleForm}
                      placeholder="V001"
                      className="w-full"
                      disabled={autoPopulateTax}
                    />
                    <Input
                      label="Tax Name"
                      name="taxName"
                      value={form.taxName || ""}
                      onChange={handleForm}
                      placeholder="Standard VAT"
                      className="w-full"
                      readOnly={autoPopulateTax}
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Description"
                        name="taxDescription"
                        value={form.taxDescription || ""}
                        onChange={handleForm}
                        placeholder="12% VAT on Non-Export"
                        className="w-full"
                        disabled={autoPopulateTax}
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
                          className={`w-full px-3 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card ${autoPopulateTax ? "text-muted cursor-not-allowed" : "text-main"}`}
                          disabled={autoPopulateTax}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted font-medium">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-card border border-theme rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-main mb-2">
                    Current Configuration
                  </h4>
                  <div className="text-sm text-muted space-y-1">
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {form.taxCategory || "N/A"}
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
                <h3 className="mb-2 text-lg font-semibold text-main underline">
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
                          className="w-16 px-1 py-1.5 text-xs border border-theme bg-card text-main rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="gm">gm</option>
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                          <option value="oz">oz</option>
                        </select>
                      </div>
                    </div>

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

                {/* ── Batch & Expiry Section ── */}
                {showBatchExpiry && (
                  <div className="mt-6 border border-theme rounded-lg p-4 bg-card space-y-4">
                    <h4 className="text-sm font-semibold text-main">
                      Batch & Expiry Info
                    </h4>

                    {/* Row 1: checkboxes */}
                    <div className="flex flex-wrap gap-6">
                      <CheckboxField
                        id="has_batch_no"
                        label="Has Batch No"
                        checked={form.has_batch_no || false}
                        onChange={(checked) =>
                          setForm((prev) => ({
                            ...prev,
                            has_batch_no: checked,
                            // clear batch fields when unchecked
                            ...(!checked && {
                              batchNumber: "",
                              create_new_batch: false,
                            }),
                          }))
                        }
                      />

                      {/* create_new_batch only shows when has_batch_no is true */}
                      {form.has_batch_no && (
                        <CheckboxField
                          id="create_new_batch"
                          label="Create New Batch"
                          checked={form.create_new_batch || false}
                          onChange={(checked) =>
                            setForm((prev) => ({
                              ...prev,
                              create_new_batch: checked,
                            }))
                          }
                        />
                      )}

                      <CheckboxField
                        id="has_expiry_date"
                        label="Has Expiry Date"
                        checked={form.has_expiry_date || false}
                        onChange={(checked) =>
                          setForm((prev) => ({
                            ...prev,
                            has_expiry_date: checked,
                            // clear date fields when unchecked
                            ...(!checked && {
                              expiryDate: "",
                               manufacturingDate: "",
                            }),
                          }))
                        }
                      />
                    </div>

                    {/* Row 2: Batch Number — only if has_batch_no */}
                    {form.has_batch_no && (
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Batch Number"
                          name="batchNumber"
                          value={form.batchNumber || ""}
                          onChange={handleForm}
                          placeholder="e.g. BATCH-001"
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Row 3: Manufacture & Expiry — only if has_expiry_date */}
                    {form.has_expiry_date && (
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Manufacture Date"
                          name="manufacturingDate"
                          type="date"
                          value={form.manufacturingDate || ""}
                          onChange={handleForm}
                          className="w-full"
                        />
                        <Input
                          label="Expiry Date"
                          name="expiryDate"
                          type="date"
                          value={form.expiryDate || ""}
                          onChange={handleForm}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 col-span-full lg:col-span-4 xl:col-span-3 space-y-4">
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

                <h3 className="mt-12 text-lg font-semibold text-main underline">
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

        <div className="flex justify-end gap-2 border-t border-theme px-6 py-4">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" type="button" onClick={reset}>
            Reset
          </Button>
          <Button variant="primary" loading={loading} type="submit">
            {activeTab === "details" ? "Next" : "Submit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/* ── Reusable Checkbox ── */
const CheckboxField: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ id, label, checked, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 accent-primary cursor-pointer rounded"
    />
    <label htmlFor={id} className="text-sm font-medium text-main cursor-pointer select-none">
      {label}
    </label>
  </div>
);

/* ── Input ── */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <span className="font-medium text-muted">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </span>
    <input
      ref={ref}
      className={`rounded border border-theme px-3 py-2 bg-card text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
        props.disabled ? "bg-app text-muted cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    />
  </label>
));
Input.displayName = "Input";

export default ItemModal;