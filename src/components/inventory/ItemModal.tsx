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

        {/* ── Tab bar ─────────────────────────────────────────────────────── */}
        <div className="bg-app border-b border-theme px-8 shrink-0">
          <div className="flex gap-8">
            <TabButton
              label="Item Details"
              active={activeTab === "details"}
              onClick={() => setActiveTab("details")}
            />
            <TabButton
              label="Tax Details"
              active={activeTab === "taxDetails"}
              onClick={() => setActiveTab("taxDetails")}
            />
            <TabButton
              label="Inventory Details"
              active={activeTab === "inventoryDetails"}
              disabled={isServiceItem}
              onClick={() => !isServiceItem && setActiveTab("inventoryDetails")}
            />
          </div>
        </div>

        {/* ── Tab content ─────────────────────────────────────────────────── */}
        <section className="flex-1 overflow-y-auto p-4 space-y-6 bg-app">
          <div className="gap-6 max-h-screen overflow-auto p-4">

            {/* ── Item Details tab ──────────────────────────────────────── */}
            {activeTab === "details" && (
              <>
                <h3 className="mb-4 text-lg font-semibold text-main underline">
                  Items Information
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {fieldConfigs.map((fieldConfig) => {

                      // ── Special render: HSN Code ───────────────────────
                      if (fieldConfig.fieldName === "itemClassCode") {
                        return (
                          <Input
                            key="itemClassCode"
                            label="HSN Code"
                            name="itemClassCode"
                            value={form.itemClassCode || ""}
                            onChange={handleForm}
                            required
                            className="w-full"
                          />
                        );
                      }

                      if (fieldConfig.fieldName === "unitOfMeasureCd") {
                        return (
                          <React.Fragment key="packing-then-uom">
                            {/* Packing: pakingunit × packingsize */}
                            <label className="flex flex-col gap-1 text-sm">
                              <FieldLabel label="Packing Unit" />
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  name="pakingunit"
                                  value={form.pakingunit || ""}
                                  onChange={handleForm}
                                  placeholder="1"
                                  min={1}
                                  className="w-14 rounded border border-theme bg-card text-main text-center px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <span className="text-muted font-bold select-none">×</span>
                                <input
                                  type="number"
                                  name="packingsize"
                                  value={form.packingsize || ""}
                                  onChange={handleForm}
                                  placeholder="1"
                                  min={1}
                                  className="w-14 rounded border border-theme bg-card text-main text-center px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                
                              </div>
                            </label>

                            {/* Unit of Measurement — rendered immediately after */}
                            <DynamicField
                              key={fieldConfig.fieldName}
                              config={fieldConfig}
                              value={form[fieldConfig.fieldName]}
                              onChange={handleDynamicFieldChange}
                              filterValue={form.itemTypeCode}
                            />
                          </React.Fragment>
                        );
                      }

                      // ── Default: delegate to DynamicField ─────────────
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

                {/* Sales & Purchase */}
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
                      <FieldLabel label="Tax Preference" required />
                      <select
                        name="taxPreference"
                        value={form.taxPreference || ""}
                        onChange={handleForm}
                        className="rounded border border-theme bg-card text-main px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      >
                        <option value="">Select…</option>
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

            {/* ── Tax Details tab ───────────────────────────────────────── */}
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
                    <option value="">Select…</option>
                    {Object.keys(taxConfigs).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  {form.taxCategory && (
                    <p className="mt-2 text-sm text-muted">
                      {taxConfigs[form.taxCategory]?.taxDescription}
                    </p>
                  )}
                </div>

                <div className="bg-app rounded-lg p-6 border border-theme">
                  <h3 className="text-lg font-semibold text-main mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {form.taxCategory ? `${form.taxCategory} Tax Details` : "Tax Details"}
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
                          className={`w-full px-3 py-2 pr-10 rounded border border-theme focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card ${
                            autoPopulateTax ? "text-muted cursor-not-allowed" : "text-main"
                          }`}
                          disabled={autoPopulateTax}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted font-medium">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current config summary */}
                <div className="mt-6 bg-card border border-theme rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-main mb-2">Current Configuration</h4>
                  <div className="text-sm text-muted space-y-1">
                    {[
                      { label: "Category", value: form.taxCategory },
                      { label: "Tax Type", value: form.taxType },
                      { label: "Tax Code", value: form.taxCode },
                      { label: "Tax Rate", value: form.taxPerct ? `${form.taxPerct}%` : null },
                    ].map(({ label, value }) => (
                      <p key={label}>
                        <span className="font-medium">{label}:</span>{" "}
                        {value || "N/A"}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Inventory Details tab ─────────────────────────────────── */}
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

                    {/* Dimensions */}
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-muted text-sm">Dimensions (L × W × H)</span>
                      <div className="flex items-center gap-1">
                        <Input label="" name="dimensionLength" placeholder="L" value={form.dimensionLength || ""} onChange={handleForm} className="w-full text-center text-xs" />
                        <span className="text-muted font-medium">×</span>
                        <Input label="" name="dimensionWidth"  placeholder="W" value={form.dimensionWidth  || ""} onChange={handleForm} className="w-full text-center text-xs" />
                        <span className="text-muted font-medium">×</span>
                        <Input label="" name="dimensionHeight" placeholder="H" value={form.dimensionHeight || ""} onChange={handleForm} className="w-full text-center text-xs" />
                        <select
                          name="dimensionUnit"
                          value={form.dimensionUnit || "cm"}
                          onChange={handleForm}
                          className="w-16 px-1 py-1.5 text-xs border border-theme bg-card text-main rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-muted text-sm">Weight</span>
                      <div className="flex gap-2">
                        <Input label="" name="weight" placeholder="0" value={form.weight} onChange={handleForm} className="flex-1" />
                        <select
                          name="weightUnit"
                          value={form.weightUnit}
                          onChange={handleForm}
                          className="w-16 px-1 py-1.5 text-xs border border-theme bg-card text-main rounded focus:outline-none focus:ring-2 focus:ring-primary"
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
                      <span className="font-medium text-muted">Valuation Method</span>
                      <select
                        name="valuationMethod"
                        value={form.valuationMethod}
                        onChange={handleForm}
                        className="rounded border border-theme bg-card text-main px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full"
                      >
                        <option value="">Select…</option>
                        <option value="FIFO">FIFO</option>
                        <option value="WAC">WAC</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Batch & Expiry — physical items only */}
                {showBatchExpiry && (
                  <div className="mt-6 border border-theme rounded-lg p-4 bg-card space-y-4">
                    <h4 className="text-sm font-semibold text-main">Batch & Expiry Info</h4>

                    <div className="flex flex-wrap gap-6">
                      <CheckboxField
                        id="has_batch_no"
                        label="Has Batch No"
                        checked={form.has_batch_no || false}
                        onChange={(checked) =>
                          setForm((prev) => ({
                            ...prev,
                            has_batch_no: checked,
                          
                          }))
                        }
                      />
                      <CheckboxField
                        id="has_expiry_date"
                        label="Has Expiry Date"
                        checked={form.has_expiry_date || false}
                        onChange={(checked) =>
                          setForm((prev) => ({
                            ...prev,
                            has_expiry_date: checked,
                           
                          }))
                        }
                      />
                    </div>

                    {/* {form.has_batch_no && (
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Batch Number"
                          name="batchNo"
                          value={form.batchNo || ""}
                          onChange={handleForm}
                          placeholder="e.g. BATCH-001"
                          className="w-full"
                        />
                      </div>
                    )} */}

                    {/* {form.has_expiry_date && (
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
                    )} */}
                  </div>
                )}

                {/* Track Inventory */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="trackInventory"
                      checked={form.trackInventory || false}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, trackInventory: e.target.checked }))
                      }
                      className="w-5 h-5 accent-primary border-theme rounded cursor-pointer"
                    />
                    <label htmlFor="trackInventory" className="text-sm font-medium text-main cursor-pointer select-none">
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
                        <option value="">Select tracking method…</option>
                        <option value="none">Normal (No tracking)</option>
                        <option value="batch">Batch</option>
                        <option value="serial">Serial Number (SR No)</option>
                        <option value="imei">IMEI</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Stock Level Tracking */}
                <h3 className="mt-12 text-lg font-semibold text-main underline">
                  Stock Level Tracking
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Input label="Min Stock Level" name="minStockLevel" value={form.minStockLevel} onChange={handleForm} className="w-full col-span-3" />
                    <Input label="Max Stock Level" name="maxStockLevel" value={form.maxStockLevel} onChange={handleForm} className="w-full col-span-3" />
                    <Input label="Re-order Level"  name="reorderLevel"  value={form.reorderLevel}  onChange={handleForm} className="w-full" />
                  </div>
                </div>
              </>
            )}

          </div>
        </section>

        {/* ── Footer actions ───────────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 border-t border-theme px-6 py-4">
          <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
          <Button variant="danger"    type="button" onClick={reset}>Reset</Button>
          <Button variant="primary"   type="submit"  loading={loading}>
            {activeTab === "inventoryDetails" || (activeTab === "taxDetails" && isServiceItem)
              ? "Submit"
              : "Next"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Local sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Tab button with active / disabled states. */
const TabButton: React.FC<{
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = ({ label, active, disabled = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={[
      "py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all",
      active
        ? "text-primary border-b-[3px] border-primary"
        : "text-muted border-b-[3px] border-transparent hover:text-main",
      disabled ? "opacity-50 cursor-not-allowed" : "",
    ].join(" ")}
  >
    {label}
  </button>
);

/** Inline label text with optional required asterisk. */
const FieldLabel: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <span className="font-medium text-muted">
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </span>
);

/** Reusable checkbox + label pair. */
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

/** Text input with floating label. Forwards ref for external focus management. */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <FieldLabel label={label} required={props.required} />
    <input
      ref={ref}
      className={[
        "rounded border border-theme px-3 py-2 bg-card text-main",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        props.disabled ? "bg-app text-muted cursor-not-allowed" : "",
        className,
      ].join(" ")}
      {...props}
    />
  </label>
));
Input.displayName = "Input";

export default ItemModal;