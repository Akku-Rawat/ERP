import React from "react";
import Modal from "../ui/modal/modal";
import { Button } from "../../components/ui/modal/formComponent";
import { DynamicField } from "../DynamicField";
import { useItemForm } from "../../hooks/Useitemform";

// ─── Compact shared primitives ────────────────────────────────────────────────

/** Tiny label text with optional required asterisk */
const FieldLabel: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
    {label}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </span>
);

/** Compact text / number input */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <label className="flex flex-col gap-0.5 w-full">
    <FieldLabel label={label} required={props.required} />
    <input
      ref={ref}
      className={[
        "h-8 rounded-md border border-theme bg-card text-main text-sm px-2.5",
        "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
        "placeholder:text-muted/40",
        props.disabled ? "bg-app text-muted cursor-not-allowed opacity-60" : "",
        className,
      ].join(" ")}
      {...props}
    />
  </label>
));
Input.displayName = "Input";

/**
 * Wraps any DynamicField (or custom search-input component) and forces it to
 * match the compact h-8 design system used everywhere else in this form.
 * Works by targeting the first input/select/textarea child via CSS.
 */
const DynamicFieldWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`dynamic-field-wrap ${className}`}
    style={{
      // Force every input / select rendered by DynamicField to be compact
    }}
  >
    <style>{`
      .dynamic-field-wrap label > span:first-child,
      .dynamic-field-wrap > div > label > span:first-child {
        font-size: 11px !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        color: var(--text-muted, #6b7280) !important;
      }
      .dynamic-field-wrap input,
      .dynamic-field-wrap select,
      .dynamic-field-wrap textarea {
        height: 32px !important;
        min-height: 32px !important;
        max-height: 32px !important;
        font-size: 0.875rem !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        padding-left: 10px !important;
        border-radius: 6px !important;
        box-sizing: border-box !important;
      }
      .dynamic-field-wrap textarea {
        max-height: 64px !important;
        resize: none !important;
      }
    `}</style>
    {children}
  </div>
);

/** Compact native select */
const CompactSelect: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  children: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}> = ({ label, name, value, onChange, children, required, disabled }) => (
  <label className="flex flex-col gap-0.5 w-full">
    <FieldLabel label={label} required={required} />
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={[
        "h-8 rounded-md border border-theme bg-card text-main text-sm px-2.5 pr-7",
        "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
        "appearance-none",
        disabled ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {children}
    </select>
  </label>
);

/**
 * Toggle field rendered as two pill buttons (ON / OFF).
 * Much more visible than a tiny switch. Still sends the correct
 * string value (onValue / offValue) to the payload via hidden input.
 */
const ToggleField: React.FC<{
  label: string;
  name: string;
  value: string | boolean;
  onValue?: string;
  offValue?: string;
  onLabel?: string;
  offLabel?: string;
  onChange: (name: string, value: string) => void;
  required?: boolean;
}> = ({
  label,
  name,
  value,
  onValue = "Y",
  offValue = "N",
  onLabel,
  offLabel,
  onChange,
  required,
}) => {
  const isOn =
    value === onValue ||
    value === true ||
    value === "true" ||
    value === "Taxable";

  return (
    <div className="flex flex-col gap-0.5">
      <FieldLabel label={label} required={required} />
      {/* Pill toggle — same h-8 height as all other inputs */}
      <div className="flex h-8 rounded-md border border-theme overflow-hidden w-fit">
        <button
          type="button"
          onClick={() => !isOn && onChange(name, onValue)}
          className={[
            "px-3 text-xs font-semibold transition-colors select-none",
            isOn
              ? "bg-primary text-white"
              : "bg-card text-muted hover:bg-primary/10 hover:text-primary",
          ].join(" ")}
        >
          {onLabel ?? onValue}
        </button>
        <div className="w-px bg-theme shrink-0" />
        <button
          type="button"
          onClick={() => isOn && onChange(name, offValue)}
          className={[
            "px-3 text-xs font-semibold transition-colors select-none",
            !isOn
              ? "bg-red-500 text-white"
              : "bg-card text-muted hover:bg-red-50 hover:text-red-500",
          ].join(" ")}
        >
          {offLabel ?? offValue}
        </button>
      </div>
      <input type="hidden" name={name} value={isOn ? onValue : offValue} />
    </div>
  );
};

/** Simple checkbox with label */
const CheckboxField: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ id, label, checked, onChange }) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2 cursor-pointer group select-none"
  >
    <div className="relative flex items-center justify-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={[
          "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
          checked
            ? "bg-primary border-primary"
            : "border-theme bg-card group-hover:border-primary/60",
        ].join(" ")}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
    <span className="text-sm font-medium text-main">{label}</span>
  </label>
);

/** Tab button */
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
      "py-2.5 px-1 bg-transparent border-none text-xs font-semibold cursor-pointer transition-all tracking-wide",
      active
        ? "text-primary border-b-2 border-primary"
        : "text-muted border-b-2 border-transparent hover:text-main",
      disabled ? "opacity-40 cursor-not-allowed" : "",
    ].join(" ")}
  >
    {label}
  </button>
);

/** Section heading */
const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-3 mb-3 mt-5 first:mt-0">
    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{title}</span>
    <div className="flex-1 h-px bg-theme" />
  </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────

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
    itemGroups,
    loadingItemGroups,
    suppliers,
    loadingSuppliers,
  } = useItemForm({ isOpen, isEditMode, initialData, onSubmit, onClose });

  if (!isOpen) return null;

  /** Wrapper that bridges ToggleField → handleDynamicFieldChange */
  const handleToggleChange = (name: string, value: string) => {
    handleDynamicFieldChange(name, value);
  };

  /** Wrapper for handleForm-style fields that need direct string injection */
  const handleSelectChange = (name: string, value: string) => {
    const syntheticEvent = {
      target: { name, value },
    } as React.ChangeEvent<HTMLSelectElement>;
    handleForm(syntheticEvent);
  };

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

        {/* ── Tab bar ─────────────────────────────────────────────────── */}
        <div className="bg-app border-b border-theme px-6 shrink-0">
          <div className="flex gap-6">
            <TabButton label="Item Details"       active={activeTab === "details"}          onClick={() => setActiveTab("details")} />
            <TabButton label="Tax Details"        active={activeTab === "taxDetails"}       onClick={() => setActiveTab("taxDetails")} />
            <TabButton
              label="Inventory Details"
              active={activeTab === "inventoryDetails"}
              disabled={isServiceItem}
              onClick={() => !isServiceItem && setActiveTab("inventoryDetails")}
            />
          </div>
        </div>

        {/* ── Tab content ─────────────────────────────────────────────── */}
        <section className="flex-1 overflow-y-auto bg-app">
          <div className="p-5 max-w-full">

            {/* ══════════════ ITEM DETAILS TAB ══════════════ */}
            {activeTab === "details" && (
              <>
                <SectionHeading title="Item Information" />

                {/* 4-col grid for item fields */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-4 items-end">
                  {fieldConfigs.map((fieldConfig) => {

                    /* HSN Code */
                    if (fieldConfig.fieldName === "itemClassCode") {
                      return (
                        <Input
                          key="itemClassCode"
                          label="HSN Code"
                          name="itemClassCode"
                          value={form.itemClassCode || ""}
                          onChange={handleForm}
                          required
                          placeholder="e.g. 84713010"
                          className="w-full"
                        />
                      );
                    }

                    /* Packing Unit + UOM (spans a wider slot) */
                    if (fieldConfig.fieldName === "unitOfMeasureCd") {
                      return (
                        <React.Fragment key="packing-then-uom">
                          {/* Packing: qty × size */}
                          <div className="flex flex-col gap-0.5">
                            <FieldLabel label="Packing Unit" />
                            <div className="flex items-center gap-1 h-8">
                              <input
                                type="number"
                                name="pakingunit"
                                value={form.pakingunit || ""}
                                onChange={handleForm}
                                placeholder="1"
                                min={1}
                                className="w-12 h-8 rounded-md border border-theme bg-card text-main text-center text-sm px-1
                                  focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                              />
                              <span className="text-muted text-xs font-bold select-none">×</span>
                              <input
                                type="number"
                                name="packingsize"
                                value={form.packingsize || ""}
                                onChange={handleForm}
                                placeholder="1"
                                min={1}
                                className="w-12 h-8 rounded-md border border-theme bg-card text-main text-center text-sm px-1
                                  focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                              />
                            </div>
                          </div>

                          {/* UOM — narrow, it's just a code picker */}
                          <DynamicFieldWrapper className="max-w-[130px]">
                            <DynamicField
                              key={fieldConfig.fieldName}
                              config={fieldConfig}
                              value={form[fieldConfig.fieldName]}
                              onChange={handleDynamicFieldChange}
                              filterValue={form.itemTypeCode}
                            />
                          </DynamicFieldWrapper>
                        </React.Fragment>
                      );
                    }

                    /* Service Charge: intercept → ToggleField (Y/N) */
                    if (fieldConfig.fieldName === "svcCharge") {
                      return (
                        <ToggleField
                          key="svcCharge"
                          label="Service Charge"
                          name="svcCharge"
                          value={form.svcCharge || "N"}
                          onValue="Y"
                          offValue="N"
                          onLabel="Yes"
                          offLabel="No"
                          onChange={handleToggleChange}
                        />
                      );
                    }

                    /* Insurance: intercept → ToggleField (Y/N) */
                    if (fieldConfig.fieldName === "ins") {
                      return (
                        <ToggleField
                          key="ins"
                          label="Insurance"
                          name="ins"
                          value={form.ins || "N"}
                          onValue="Y"
                          offValue="N"
                          onLabel="Yes"
                          offLabel="No"
                          onChange={handleToggleChange}
                        />
                      );
                    }

                    /* Item Group */
                    if (fieldConfig.fieldName === "itemGroup") {
                      return (
                        <CompactSelect
                          key="itemGroup"
                          label="Item Category"
                          name="itemGroup"
                          value={form.itemGroup || ""}
                          onChange={handleForm}
                          disabled={loadingItemGroups || !form.itemTypeCode}
                          required
                        >
                          {loadingItemGroups ? (
                            <option>Searching…</option>
                          ) : !form.itemTypeCode ? (
                            <option value="">Select Item Type first</option>
                          ) : (
                            <>
                              <option value="">Select Category</option>
                              {itemGroups.map((group) => (
                                <option key={group.id} value={group.groupName}>
                                  {group.groupName}
                                </option>
                              ))}
                            </>
                          )}
                        </CompactSelect>
                      );
                    }

                    /* Default */
                    return (
                      <DynamicFieldWrapper key={fieldConfig.fieldName}>
                        <DynamicField
                          config={fieldConfig}
                          value={form[fieldConfig.fieldName]}
                          onChange={handleDynamicFieldChange}
                          filterValue={form.itemTypeCode}
                        />
                      </DynamicFieldWrapper>
                    );
                  })}
                </div>

                {/* ── Sales & Purchase ───────────────────────────────── */}
                <SectionHeading title="Sales & Purchase" />

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-4 items-end">
                  
                  <Input
                    label="Selling Price"
                    name="sellingPrice"
                    type="number"
                    value={form.sellingPrice || ""}
                    onChange={handleForm}
                    required
                    placeholder="0.00"
                  />
                     <CompactSelect
  label="Preferred Vendor"
  name="preferredVendor"
  value={form.preferredVendor || ""}
  onChange={handleForm}
  disabled={loadingSuppliers}
  required
>
  {loadingSuppliers ? (
    <option>Loading suppliers...</option>
  ) : (
    <>
      <option value="">Select Supplier</option>
      {suppliers.map((supplier) => (
        <option key={supplier.value} value={supplier.value}>
          {supplier.label}
        </option>
      ))}
    </>
  )}
</CompactSelect>
                  <Input
                    label="Sales Account"
                    name="salesAccount"
                    value={form.salesAccount || ""}
                    onChange={handleForm}
                    required
                    placeholder="e.g. 4000-Sales"
                  />
                  <Input
                    label="Buying Price"
                    name="buyingPrice"
                    type="number"
                    value={form.buyingPrice || ""}
                    onChange={handleForm}
                    required
                    placeholder="0.00"
                  />
                  <Input
                    label="Purchase Account"
                    name="purchaseAccount"
                    value={form.purchaseAccount || ""}
                    onChange={handleForm}
                    required
                    placeholder="e.g. 5000-COGS"
                  />
               

                  {/* Tax Preference toggle — lives in Sales & Purchase grid */}
                  <ToggleField
                    label="Tax Preference"
                    name="taxPreference"
                    value={form.taxPreference || ""}
                    onValue="Taxable"
                    offValue="Non-Taxable"
                    onLabel="Taxable"
                    offLabel="Non-Taxable"
                    onChange={handleToggleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* ══════════════ TAX DETAILS TAB ══════════════ */}
            {activeTab === "taxDetails" && (
              <>
                <SectionHeading title="Tax Category" />

                <div className="max-w-xs mb-4">
                  <CompactSelect
                    label="Tax Category"
                    name="taxCategory"
                    value={form.taxCategory}
                    onChange={handleForm}
                  >
                    <option value="">Select…</option>
                    {Object.keys(taxConfigs).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </CompactSelect>
                  {form.taxCategory && (
                    <p className="mt-1.5 text-xs text-muted">
                      {taxConfigs[form.taxCategory]?.taxDescription}
                    </p>
                  )}
                </div>

                <SectionHeading title={form.taxCategory ? `${form.taxCategory} Tax Details` : "Tax Details"} />

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <Input
                    label="Tax Type"
                    name="taxType"
                    value={form.taxType || ""}
                    onChange={handleForm}
                    placeholder="e.g. VAT"
                    disabled={autoPopulateTax}
                  />
                  <Input
                    label="Tax Code"
                    name="taxCode"
                    value={form.taxCode || ""}
                    onChange={handleForm}
                    placeholder="V001"
                    disabled={autoPopulateTax}
                  />
                  <Input
                    label="Tax Name"
                    name="taxName"
                    value={form.taxName || ""}
                    onChange={handleForm}
                    placeholder="Standard VAT"
                    readOnly={autoPopulateTax}
                  />
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel label="Tax Percentage (%)" />
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        name="taxPerct"
                        value={form.taxPerct || ""}
                        onChange={handleForm}
                        placeholder="12"
                        className={[
                          "h-8 w-full rounded-md border border-theme text-sm px-2.5 pr-7",
                          "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                          autoPopulateTax ? "bg-app text-muted cursor-not-allowed opacity-60" : "bg-card text-main",
                        ].join(" ")}
                        disabled={autoPopulateTax}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted font-semibold">%</span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-3 lg:col-span-2">
                    <Input
                      label="Description"
                      name="taxDescription"
                      value={form.taxDescription || ""}
                      onChange={handleForm}
                      placeholder="12% VAT on Non-Export"
                      disabled={autoPopulateTax}
                    />
                  </div>
                </div>

                {/* Summary card */}
                <div className="mt-4 bg-card border border-theme rounded-lg p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Current Configuration</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                    {[
                      { label: "Category", value: form.taxCategory },
                      { label: "Type",     value: form.taxType     },
                      { label: "Code",     value: form.taxCode     },
                      { label: "Rate",     value: form.taxPerct ? `${form.taxPerct}%` : null },
                    ].map(({ label, value }) => (
                      <span key={label}>
                        <span className="font-semibold text-main">{label}:</span>{" "}
                        <span>{value || "—"}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ══════════════ INVENTORY DETAILS TAB ══════════════ */}
            {activeTab === "inventoryDetails" && (
              <>
                <SectionHeading title="Inventory Details" />

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-4 items-end">
                  <Input
                    label="Brand"
                    name="brand"
                    value={form.brand || ""}
                    onChange={handleForm}
                    disabled={isServiceItem}
                    placeholder="Brand name"
                  />

                  {/* Dimensions */}
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel label="Dimensions (L × W × H)" />
                    <div className="flex items-center gap-1 h-8">
                      {["dimensionLength", "dimensionWidth", "dimensionHeight"].map((dim, i) => (
                        <React.Fragment key={dim}>
                          {i > 0 && <span className="text-muted text-xs font-bold">×</span>}
                          <input
                            type="number"
                            name={dim}
                            value={form[dim] || ""}
                            onChange={handleForm}
                            placeholder={["L", "W", "H"][i]}
                            className="w-10 h-8 rounded-md border border-theme bg-card text-main text-center text-xs px-1
                              focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        </React.Fragment>
                      ))}
                      <select
                        name="dimensionUnit"
                        value={form.dimensionUnit || "cm"}
                        onChange={handleForm}
                        className="h-8 w-12 rounded-md border border-theme bg-card text-main text-xs px-1
                          focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="cm">cm</option>
                        <option value="in">in</option>
                      </select>
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel label="Weight" />
                    <div className="flex items-center gap-1 h-8">
                      <input
                        type="number"
                        name="weight"
                        value={form.weight || ""}
                        onChange={handleForm}
                        placeholder="0"
                        className="flex-1 h-8 rounded-md border border-theme bg-card text-main text-sm px-2.5
                          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                      <select
                        name="weightUnit"
                        value={form.weightUnit || "kg"}
                        onChange={handleForm}
                        className="h-8 w-14 rounded-md border border-theme bg-card text-main text-xs px-1
                          focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="gm">gm</option>
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                        <option value="oz">oz</option>
                      </select>
                    </div>
                  </div>

                  <CompactSelect
                    label="Valuation Method"
                    name="valuationMethod"
                    value={form.valuationMethod || ""}
                    onChange={handleForm}
                  >
                    <option value="">Select…</option>
                    <option value="FIFO">FIFO</option>
                    <option value="WAC">WAC</option>
                  </CompactSelect>
                </div>

                {/* Batch & Expiry */}
                {showBatchExpiry && (
                  <>
                    <SectionHeading title="Batch & Expiry" />
                    <div className="flex flex-wrap gap-5">
                      <CheckboxField
                        id="has_batch_no"
                        label="Has Batch Number"
                        checked={form.has_batch_no || false}
                        onChange={(checked) => setForm((prev) => ({ ...prev, has_batch_no: checked }))}
                      />
                      <CheckboxField
                        id="has_expiry_date"
                        label="Has Expiry Date"
                        checked={form.has_expiry_date || false}
                        onChange={(checked) => setForm((prev) => ({ ...prev, has_expiry_date: checked }))}
                      />
                    </div>
                  </>
                )}

                {/* Track Inventory */}
                <SectionHeading title="Inventory Tracking" />
                <div className="space-y-3">
                  <CheckboxField
                    id="trackInventory"
                    label="Track Inventory"
                    checked={form.trackInventory || false}
                    onChange={(checked) => setForm((prev) => ({ ...prev, trackInventory: checked }))}
                  />

                  {form.trackInventory && (
                    <div className="ml-6 max-w-xs">
                      <CompactSelect
                        label="Tracking Method"
                        name="trackingMethod"
                        value={form.trackingMethod || ""}
                        onChange={handleForm}
                      >
                        <option value="">Select method…</option>
                        <option value="none">Normal (No tracking)</option>
                        <option value="batch">Batch</option>
                        <option value="serial">Serial Number (SR No)</option>
                        <option value="imei">IMEI</option>
                      </CompactSelect>
                    </div>
                  )}
                </div>

                {/* Stock Levels */}
                <SectionHeading title="Stock Level Tracking" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-lg">
                  <Input label="Min Stock Level" name="minStockLevel" value={form.minStockLevel || ""} onChange={handleForm} placeholder="0" />
                  <Input label="Max Stock Level" name="maxStockLevel" value={form.maxStockLevel || ""} onChange={handleForm} placeholder="0" />
                  <Input label="Re-order Level"  name="reorderLevel"  value={form.reorderLevel  || ""} onChange={handleForm} placeholder="0" />
                </div>
              </>
            )}

          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 border-t border-theme px-5 py-3 bg-app shrink-0">
          <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
          <Button variant="danger"    type="button" onClick={reset}>Reset</Button>
          <Button variant="primary"   type="submit"  loading={loading}>
            {activeTab === "inventoryDetails" || (activeTab === "taxDetails" && isServiceItem)
              ? "Submit"
              : "Next →"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ItemModal;