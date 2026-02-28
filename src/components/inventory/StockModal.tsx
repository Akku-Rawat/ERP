
import React, { useState, useEffect, useCallback } from "react";
import {
  showApiError,
  showSuccess,
  showLoading,
  closeSwal,
} from "../../utils/alert";
import { createItemStock } from "../../api/stockApi";
import { getStockById } from "../../api/stockItemApi";
import Modal from "../ui/modal/modal";
import { Button } from "../../components/ui/modal/formComponent";

// ── Your actual shared components ──────────────────────────────────────────────
import Input from "../../components/ui/Input";
import ItemSelect from "../../components/selects/ItemSelect";
import ItemGenericSelect from "../../components/selects/ItemGenericSelect";
import { getUOMs } from "../../api/itemZraApi";

// ─── Types ────────────────────────────────────────────────────────────────────
type FormState = Record<string, any>;

const emptyForm: FormState = {
  id: "",
  itemName: "",
  itemClassCode: "",
  batchNo: "",
  manufacturingDate: "",
  expiryDate: "",
  buyingPrice: "",
  sellingPrice: "",
  packagingQty: "",
  packagingSize: "",
  unitOfMeasureCd: "",
  quantity: "",
  rate: "",
};

// ─── FieldLabel — matches Input.tsx label style exactly ───────────────────────
const FieldLabel: React.FC<{ label: string; required?: boolean }> = ({
  label,
  required,
}) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
    {label}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </span>
);

// ─── CellInput — inline table cell input, uses same CSS tokens ────────────────
/**
 * Invisible by default, gains a subtle ring on focus.
 * Uses the same border-theme / bg-card / text-main tokens as Input.tsx
 */
const CellInput: React.FC<{
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  step?: string;
  readOnly?: boolean;
  className?: string;
}> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
  readOnly,
  className = "",
}) => (
  <input
    type={type}
    min={min}
    step={step}
    value={value}
    readOnly={readOnly}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className={[
      "w-full h-8 rounded-md border border-theme bg-card text-main text-sm px-2.5",
      "placeholder:text-muted/40",
      "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
      readOnly ? "opacity-60 cursor-not-allowed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  />
);

// ─── PackingBoxes — two h-8 inputs separated by × ────────────────────────────
/**
 * Matches the screenshot exactly: [ 1 ] × [ 1 ]
 * Each box uses the same border-theme / bg-card / h-8 as Input.tsx.
 */
const PackingBoxes: React.FC<{
  qty: string | number;
  size: string | number;
  onQtyChange: (v: string) => void;
  onSizeChange: (v: string) => void;
}> = ({ qty, size, onQtyChange, onSizeChange }) => (
  <div className="flex items-center gap-1.5">
    <input
      type="number"
      min={1}
      step={1}
      value={qty}
      onChange={(e) => onQtyChange(e.target.value)}
      placeholder="1"
      className="w-12 h-8 rounded-md border border-theme bg-card text-main text-sm text-center px-1
        focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
    />
    <span className="text-muted text-xs font-bold select-none">×</span>
    <input
      type="number"
      min={1}
      step={1}
      value={size}
      onChange={(e) => onSizeChange(e.target.value)}
      placeholder="1"
      className="w-12 h-8 rounded-md border border-theme bg-card text-main text-sm text-center px-1
        focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
    />
  </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────
const ItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  initialData?: Record<string, any> | null;
  isEditMode?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);

  // ── init on open ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setForm(
      isEditMode && initialData ? { ...emptyForm, ...initialData } : emptyForm,
    );
  }, [isOpen, isEditMode, initialData]);

  // ── auto-fill stock data when item is selected ────────────────────────────
  useEffect(() => {
    if (!form.id) return;
    getStockById(form.id).then((res) => {
      const item = res?.items?.[0];
      if (!item) return;
      setForm((prev) => ({
        ...prev,
        itemClassCode: item.itemCode || prev.itemClassCode,
        quantity: item.quantity || prev.quantity,
        rate: item.rate || prev.rate,
      }));
    });
  }, [form.id]);

  // ── field helpers ─────────────────────────────────────────────────────────
  const setField = useCallback(
    (name: string, value: string | number) =>
      setForm((prev) => ({ ...prev, [name]: value })),
    [],
  );

  const handleForm = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setField(e.target.name, e.target.value),
    [setField],
  );

  // ── submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) {
      showApiError("Please select an item");
      return;
    }
    const qty = parseFloat(form.quantity);
    const price = parseFloat(form.rate);
    if (!qty || qty <= 0) {
      showApiError("Please enter a valid quantity greater than 0");
      return;
    }
    if (!price || price <= 0) {
      showApiError("Please enter a valid price greater than 0");
      return;
    }
    try {
      const payload = {
        items: [
          {
            batch_no: form.batchNo,
            item_code: form.id,
            qty,
            price,
            packaging_qty: form.packagingQty || 1,
            packaging_size: form.packagingSize || 1,
            unit_of_measure: form.unitOfMeasureCd,
            manufacturing_date: form.manufacturingDate,
            expiry_date: form.expiryDate,
            buying_price: parseFloat(form.buyingPrice) || 0,
            selling_price: parseFloat(form.sellingPrice) || 0,
          },
        ],
      };
      showLoading("Creating Stock Entry...");
      const response = await createItemStock(payload);
      closeSwal();
      if (!response || response.status_code !== 200) {
        showApiError(response?.message || "Failed to create stock entry");
        return;
      }
      showSuccess("Stock entry created successfully");
      onSubmit?.();
      handleClose();
    } catch (error: any) {
      closeSwal();
      showApiError(error);
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  // ── derived values ──────────────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];
  const isExpired =
    !!form.expiryDate && new Date(form.expiryDate) < new Date(today);
  const isExpiringSoon =
    !!form.expiryDate &&
    !isExpired &&
    new Date(form.expiryDate) <=
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const qty = parseFloat(form.quantity) || 0;
  const rate = parseFloat(form.rate) || 0;
  const totalValue = qty * rate;
  const buyP = parseFloat(form.buyingPrice) || 0;
  const sellP = parseFloat(form.sellingPrice) || 0;
  const margin =
    buyP > 0 && sellP > 0
      ? (((sellP - buyP) / buyP) * 100).toFixed(2)
      : null;
  const roundingAdj =
    totalValue > 0 ? Math.round(totalValue) - totalValue : 0;
  const roundedTotal = totalValue + roundingAdj;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Stock Entry" : "New Stock Entry"}
      subtitle="Create and manage stock entry details"
      maxWidth="6xl"
      height="90vh"
    >
      <form onSubmit={handleSubmit} className="h-full flex flex-col bg-app">

        {/* ── Tab bar ───────────────────────────────────────────────────────── */}
        <div className="bg-app border-b border-theme px-6 shrink-0">
          <div className="flex">
            <button
              type="button"
              className="py-2.5 px-1 bg-transparent border-none text-xs font-semibold
                text-primary border-b-2 border-primary tracking-wide"
            >
              Details
            </button>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── Top fields row ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-3 mb-5 items-start">

            {/* Item Search — uses ItemSelect (portal dropdown, same border-theme) */}
            <div className="flex flex-col gap-0.5">
              <FieldLabel label="Select Item" required />
              <ItemSelect
                value={form.id}
                onChange={(item) =>
                  setForm((prev) => ({
                    ...prev,
                    id: item.id,
                    itemName: item.itemName,
                    itemClassCode: item.itemCode,
                  }))
                }
              />
            </div>

            {/* Batch No */}
            <Input
              label="Batch No."
              name="batchNo"
              value={form.batchNo || ""}
              onChange={handleForm}
              placeholder="e.g. BT-2024"
            />

            {/* Mfg Date */}
            <Input
              label="Mfg. Date"
              name="manufacturingDate"
              type="date"
              value={form.manufacturingDate || ""}
              onChange={handleForm}
              max={today}
            />

            {/* Expiry Date — with inline warning */}
            <div className="flex flex-col gap-0.5">
              <Input
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={form.expiryDate || ""}
                onChange={handleForm}
                min={today}
                className={
                  isExpired
                    ? "border-red-400 focus:ring-red-300"
                    : isExpiringSoon
                    ? "border-amber-400 focus:ring-amber-300"
                    : ""
                }
              />
              {isExpired && (
                <span className="text-[10px] text-red-500 font-semibold mt-0.5">
                  ⚠ Date has passed
                </span>
              )}
              {isExpiringSoon && (
                <span className="text-[10px] text-amber-500 font-semibold mt-0.5">
                  ⚠ Expiring within 30 days
                </span>
              )}
            </div>
          </div>

          {/* ── Table + Sidebar ─────────────────────────────────────────────── */}
          <div className="flex gap-4 items-start">

            {/* Items table ─────────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0 rounded-xl border border-theme bg-card shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="px-4 py-3 border-b border-theme bg-app/50">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                  Stock Item Details
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead>
                    <tr className="border-b border-theme">
                      {[
                        { label: "#",            w: "w-8"  },
                        { label: "Item Name",    w: ""     },
                        { label: "Item Code",    w: "w-28" },
                        { label: "Packing Unit", w: "w-32" },
                        { label: "UOM",          w: "w-28" },
                        { label: "Qty",          w: "w-20" },
                        { label: "Rate",         w: "w-24" },
                        { label: "Buy Price",    w: "w-24" },
                        { label: "Sell Price",   w: "w-24" },
                        { label: "Amount",       w: "w-24", right: true },
                      ].map((col) => (
                        <th
                          key={col.label}
                          className={[
                            "px-3 py-2.5",
                            "text-[11px] font-semibold uppercase tracking-wide text-muted",
                            col.right ? "text-right" : "text-left",
                            col.w,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Single stock row */}
                    <tr className="border-b border-theme hover:bg-row-hover transition-colors">

                      {/* # */}
                      <td className="px-3 py-3 text-xs text-muted font-medium">1</td>

                      {/* Item Name — read-only, driven by ItemSelect above */}
                      <td className="px-2 py-2">
                        <CellInput
                          value={form.itemName || ""}
                          onChange={() => {}}
                          placeholder="Select item above…"
                          readOnly
                        />
                      </td>

                      {/* Item Code — read-only */}
                      <td className="px-2 py-2">
                        <CellInput
                          value={form.itemClassCode || ""}
                          onChange={() => {}}
                          placeholder="—"
                          readOnly
                        />
                      </td>

                      {/* Packing Unit — [ qty ] × [ size ] */}
                      <td className="px-2 py-2">
                        <PackingBoxes
                          qty={form.packagingQty}
                          size={form.packagingSize}
                          onQtyChange={(v) => setField("packagingQty", v)}
                          onSizeChange={(v) => setField("packagingSize", v)}
                        />
                      </td>

                      {/* UOM — API-driven via ItemGenericSelect */}
                      <td className="px-2 py-2">
                        {/*
                          ItemGenericSelect renders its own label — we hide it
                          with a scoped wrapper and suppress the label span.
                          The input itself matches border-theme / bg-card exactly.
                        */}
                        <div className="uom-cell-wrap">
                          <style>{`
                            .uom-cell-wrap > div { gap: 0 !important; }
                            .uom-cell-wrap span:first-child { display: none !important; }
                            .uom-cell-wrap input {
                              height: 32px !important;
                              font-size: 0.8125rem !important;
                              padding: 0 10px !important;
                              border-radius: 6px !important;
                              border: 1px solid var(--border) !important;
                              background: var(--bg-card) !important;
                              color: var(--text-main) !important;
                              box-sizing: border-box !important;
                              width: 100% !important;
                            }
                            .uom-cell-wrap input:focus {
                              outline: none !important;
                              border-color: var(--primary) !important;
                              box-shadow: 0 0 0 1px var(--primary) !important;
                            }
                          `}</style>
                          <ItemGenericSelect
                            label="UOM"
                            fetchData={getUOMs}
                            value={form.unitOfMeasureCd || ""}
                            onChange={({ id }) => setField("unitOfMeasureCd", id)}
                            placeholder="Select UOM"
                            displayField="name"
                            variant="modal"
                          />
                        </div>
                      </td>

                      {/* Qty */}
                      <td className="px-2 py-2">
                        <CellInput
                          type="number"
                          min={1}
                          step="1"
                          value={form.quantity || ""}
                          onChange={(v) => setField("quantity", v)}
                          placeholder="0"
                        />
                      </td>

                      {/* Rate */}
                      <td className="px-2 py-2">
                        <CellInput
                          type="number"
                          min={0}
                          step="0.01"
                          value={form.rate || ""}
                          onChange={(v) => setField("rate", v)}
                          placeholder="0.00"
                        />
                      </td>

                      {/* Buy Price */}
                      <td className="px-2 py-2">
                        <CellInput
                          type="number"
                          min={0}
                          step="0.01"
                          value={form.buyingPrice || ""}
                          onChange={(v) => setField("buyingPrice", v)}
                          placeholder="0.00"
                        />
                      </td>

                      {/* Sell Price */}
                      <td className="px-2 py-2">
                        <CellInput
                          type="number"
                          min={0}
                          step="0.01"
                          value={form.sellingPrice || ""}
                          onChange={(v) => setField("sellingPrice", v)}
                          placeholder="0.00"
                        />
                      </td>

                      {/* Amount */}
                      <td className="px-3 py-2 text-right">
                        <span className="text-sm font-semibold text-main tabular-nums">
                          ₹ {totalValue.toFixed(2)}
                        </span>
                      </td>
                    </tr>

                    {/* Empty-state hint row */}
                    {!form.id && (
                      <tr>
                        <td
                          colSpan={10}
                          className="py-8 text-center text-xs text-muted"
                        >
                          ↑ Select an item from the dropdown above to begin
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Right Sidebar ──────────────────────────────────────────────── */}
            <div className="w-52 flex-shrink-0 flex flex-col gap-3">

              {/* Item Details card */}
              <div className="rounded-xl border border-theme bg-card shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-theme bg-app/50">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                    Item Details
                  </span>
                </div>
                <div className="px-4 py-3 flex flex-col gap-2.5">
                  {/* box icon + name */}
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-muted mt-0.5 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <span className="text-sm font-medium text-main leading-snug break-all">
                      {form.itemName || "—"}
                    </span>
                  </div>

                  {/* doc icon + code */}
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-muted flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="2" y="3" width="20" height="18" rx="2" />
                      <path d="M7 8h10M7 12h6" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs text-muted">
                      {form.itemClassCode || "—"}
                    </span>
                  </div>

                  {/* Batch badge */}
                  {form.batchNo && (
                    <span className="self-start inline-flex items-center rounded-full
                      bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700
                      ring-1 ring-amber-200">
                      Batch: {form.batchNo}
                    </span>
                  )}

                  {/* Expiry badges */}
                  {isExpired ? (
                    <span className="self-start inline-flex items-center rounded-full
                      bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600
                      ring-1 ring-red-200">
                      ⚠ Expired
                    </span>
                  ) : isExpiringSoon ? (
                    <span className="self-start inline-flex items-center rounded-full
                      bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600
                      ring-1 ring-amber-200">
                      ⚠ Expiring Soon
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Summary card */}
              <div className="rounded-xl border border-theme bg-card shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-theme bg-app/50">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                    Summary
                  </span>
                </div>
                <div className="px-4 py-3 flex flex-col gap-2">
                  {[
                    ["Quantity",    String(qty || 0)],
                    ["Rate",        `₹ ${rate.toFixed(2)}`],
                    [
                      "Pkg.",
                      form.packagingQty || form.packagingSize
                        ? `${form.packagingQty || "—"} × ${form.packagingSize || "—"}`
                        : "— × —",
                    ],
                    ["Grand Total", `₹ ${totalValue.toFixed(2)}`],
                    ["Rounding Adj",`₹ ${roundingAdj.toFixed(2)}`],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="flex justify-between items-center"
                    >
                      <span className="text-xs text-muted">{label}</span>
                      <span className="text-sm font-medium text-main tabular-nums">
                        {val}
                      </span>
                    </div>
                  ))}

                  {/* Rounded Total — primary blue pill */}
                  <div className="mt-1 flex justify-between items-center
                    bg-primary rounded-lg px-3 py-2.5">
                    <span className="text-xs font-semibold text-white">
                      Rounded Total
                    </span>
                    <span className="text-sm font-bold text-white tabular-nums">
                      ₹ {roundedTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Margin — only when both prices filled */}
                  {margin !== null && (
                    <div className="flex justify-between items-center
                      bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                      <span className="text-xs font-semibold text-emerald-700">
                        Margin
                      </span>
                      <span className="text-sm font-bold text-emerald-700 tabular-nums">
                        {margin}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────────── */}
        <div className="flex justify-between items-center
          border-t border-theme bg-app px-6 py-3 shrink-0">
          {/* status text */}
          <span className="text-xs text-muted">
            {form.itemName
              ? `${form.itemName}${form.batchNo ? ` · Batch ${form.batchNo}` : ""}`
              : "No item selected"}
          </span>

          <div className="flex items-center gap-2">
            <Button variant="secondary" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={() => setForm(emptyForm)}
            >
              Reset
            </Button>
            <Button variant="primary" loading={loading} type="submit">
              Save Stock Entry
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ItemModal;