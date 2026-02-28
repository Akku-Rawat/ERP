import React, { useState, useEffect } from "react";
import { Plus, Trash2, User, Mail, Phone } from "lucide-react";
import type {
  ItemRow,
  PurchaseInvoiceFormData,
} from "../../../types/Supply/purchaseInvoice";
import { currencyOptions } from "../../../types/Supply/supplier";
import SupplierSelect from "../../selects/procurement/SupplierSelect";
import POItemSelect from "../../selects/procurement/POItemSelect";
import { ModalInput, ModalSelect } from "../../ui/modal/modalComponent";



interface DetailsTabProps {
  form: PurchaseInvoiceFormData;
  items: ItemRow[];
  onItemSelect: (item: any, idx: number) => void;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSupplierChange: (s: any) => void;
  onItemChange: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  onAddItem: () => void;
  onRemoveItem: (idx: number) => void;
  getCurrencySymbol: () => string;
  poList: any[];
  onPOSelect: (po: any) => void;
}

export const DetailsTab = ({
  form,
  items,
  onFormChange,
  onSupplierChange,
  onItemChange,
  onItemSelect,
  onAddItem,
  onRemoveItem,
  getCurrencySymbol,
  poList,
  onPOSelect
}: DetailsTabProps) => {
  const symbol = getCurrencySymbol();

  // Pagination Logic
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(0);

  // Helper function to get VAT description
  const getVatDescription = (vatCd: string): string => {
    const descriptions: Record<string, string> = {
      A: "Standard Rate",
    };

    return descriptions[vatCd] || "Standard";
  };

  useEffect(() => {
    const newPage = Math.floor((items.length - 1) / ITEMS_PER_PAGE);
    if (newPage !== page) setPage(newPage);
  }, [items.length]);

  const paginatedItems = items.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  const currencySelectOptions = [
    ...currencyOptions.map((c) => ({
      value: c,
      label: c,
    })),
  ];

  return (
    <div className="flex flex-col gap-4 max-h-screen overflow-auto p-4 bg-app text-main">
      <div className="bg-app">
        <div className="grid grid-cols-[280px_150px_180px_120px_120px_140px_140px] gap-x-2 justify-start items-end">
          {/* Supplier */}
          <div className="w-[280px]">
            <SupplierSelect
              selectedId={form.supplierId}
              onChange={onSupplierChange}
            />
          </div>

          <div className="w-[150px]">
            <ModalSelect
              label="PO Number"
              name="poNumber"
              value={form.poNumber}
              placeholder="Select PO"
              options={(poList || []).map(po => ({
                label: po.poId,
                value: po.poId
              }))}
            onChange={(e) => {
  const selected = poList.find(
    p => p.poId === e.target.value
  );

  if (selected) {
    onPOSelect(selected);
  }
}}
            />
          </div>

          <div className="w-[180px]">
            <ModalInput
              label="Supplier Invoice No"
              name="supplierInvoiceNumber"
              value={form.supplierInvoiceNumber}
              onChange={onFormChange}
            />
          </div>


          {/* Date */}
          <div className="w-[100px]">
            <ModalInput
              label="Date"
              type="date"
              name="date"
              value={form.date}
              onChange={onFormChange}
              required
            />
          </div>



          {/* Status */}
          <div className="w-[110px]">
            <ModalSelect
              label="Status"
              name="status"
              value={form.status}
              onChange={onFormChange}
              options={[
                { value: "Draft", label: "Draft" },
                { value: "Return", label: "Return" },
                { value: "Submitted", label: "Submitted" },
                { value: "Paid", label: "Paid" },
                { value: "Cancelled", label: "Cancelled" },
                { value: "Internal Transfer", label: "Internal Transfer" },
                { value: "Debit Note Issued", label: "Debit Note Issued" },
                { value: "Party Paid", label: "Party Paid" },
              ]}
            />
          </div>
          <div className="w-[130px]">
            <ModalSelect
              label="Cost Center"
              name="costCenter"
              value={form.costCenter}
              onChange={onFormChange}
              options={[
                { value: "UD-001 - Udvil - RI", label: "UD-001 - Udvil - RI" },

              ]}
            />
          </div>

          <div className="w-[140px]">
            <ModalInput
              label="Project"
              name="project"
              value={form.project}
              onChange={onFormChange}
            />
          </div>


          <div className="grid grid-cols-[170px_170px] gap-x-3 mt-2">
            <div className="w-[140px]">
              <ModalSelect
                label="Transaction Progress"
                name="transactionProgress"
                value={form.transactionProgress}
                onChange={onFormChange}
                options={[
                  { value: "APPROVED", label: "Approved" },
                  { value: "REFUNDED", label: "Refunded" },
                  { value: "TRANSFERRED", label: "Transferred" },
                  { value: "REJECTED", label: "Rejected" },
                ]}
              />
            </div>

            <div className="w-[140px]">
              <ModalSelect
                label="Payment Type"
                name="paymentType"
                value={form.paymentType}
                onChange={onFormChange}
                options={[
                  { value: "CASH", label: "CASH" },
                  { value: "CREDIT", label: "CREDIT" },
                  { value: "Bank transfer", label: "Bank transfer" },
                  { value: "CASH/CREDIT", label: "CASH/CREDIT" },
                  { value: "BANK CHECK", label: "BANK CHECK" },
                  {
                    value: "MOBILE MONEY",
                    label: "Any Transaction Using Mobile Money System",
                  },
                  { value: "DEBIT & CREDIT CARD", label: "PAYMENT USING CARD" },
                  { value: "OTHER", label: "Other Payment Methods" },
                ]}
              />
            </div>

          </div>

        </div>
      </div>

      {/* Main Body - Table LEFT + Sidebar RIGHT */}
      <div className="grid grid-cols-[4fr_1fr] gap-4">
        {/* LEFT: Order Items Table */}
        <div className="bg-card rounded-lg p-2 shadow-sm flex-1">
          {/* Simple Table Title */}
          <div className="flex items-center gap-1 mb-2">
            <h3 className="text-sm font-semibold text-main">Order Items</h3>
          </div>

          <div>
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-theme">
                  <th className="px-2 py-1 w-[25px]">#</th>
                  <th className="px-2 py-1 w-[130px]">Item</th>
                  <th className="px-2 py-1 w-[140px]">Description</th>
                  <th className="px-2 py-1 w-[130px]">Packing</th>
                  <th className="px-2 py-1 w-[130px]">Batch No</th>
                  <th className="px-2 py-1 w-[50px]">Qty</th>
                  <th className="px-2 py-1 w-[90px]">Mfg Date</th>
                  <th className="px-2 py-1 w-[90px]">Expiry Date</th>
                  <th className="px-2 py-1 w-[70px]">Unit Price</th>
                  <th className="px-2 py-1 w-[60px]">Dis (%)</th>
                  <th className="px-2 py-1 w-[70px]">Tax</th>
                  <th className="px-2 py-1 w-[60px]">Tax Code</th>
                  <th className="px-2 py-1 w-[80px] text-right">Amount</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {paginatedItems.map((it, idx) => {
                  const i = page * ITEMS_PER_PAGE + idx;
                  const discountAmount =
                    it.quantity * it.rate * (Number(it.discount || 0) / 100);

                  const totalInclusive =
                    it.quantity * it.rate - discountAmount;

                  const exclusive =
                    totalInclusive / (1 + Number(it.vatRate || 0) / 100);

                  const tax = totalInclusive - exclusive;

                  const amount = totalInclusive;
                  return (
                    <tr key={i} className="border-b border-theme bg-card row-hover">
                      <td className="px-2 py-1">{i + 1}</td>

                      {/* ITEM */}
                      <td className="px-0.5 py-1 min-w-[135px]">
                        <POItemSelect
                          value={it.itemName}
                          selectedId={it.itemCode}
                          onChange={(item) => onItemSelect(item.id, idx)}
                        />
                      </td>

                      {/* DESCRIPTION */}
                      <td className="px-0.5 py-1">
                        <input
                          name="description"
                          value={it.description || ""}
                          onChange={(e) => onItemChange(e, i)}
                          className="w-full py-1 px-2 border border-theme rounded text-[10px] bg-card"
                        />
                      </td>

                      {/* PACKING */}
                      <td className="px-0.5 py-1">
                        <input
                          name="packing"
                          value={it.packing || ""}
                          onChange={(e) => onItemChange(e, i)}
                          className="w-full py-1 px-2 border border-theme rounded text-[10px]"
                        />
                      </td>

                      {/* BATCH */}
                      <td className="px-0.5 py-1">
                        <input
                          name="batchNo"
                          value={it.batchNo || ""}
                          onChange={(e) => onItemChange(e, i)}
                          className="w-full py-1 px-2 border border-theme rounded text-[10px]"
                        />
                      </td>

                      {/* QTY */}
                      <td className="px-0.5 py-1">
                        <input
                          type="number"
                          name="quantity"
                          value={it.quantity}
                          onChange={(e) => onItemChange(e, i)}
                          className="w-[65px] py-1 px-2 border border-theme rounded text-[11px]"
                        />
                      </td>

                      {/* MFG */}
                      <td className="px-0.5 py-1">
                        <input
                          type="date"
                          name="mfgDate"
                          value={it.mfgDate || ""}
                          onChange={(e) => onItemChange(e, i)}
                          className="w-[95px] py-1 px-2 border border-theme rounded text-[10px]"
                        />
                      </td>

                      {/* EXP */}
                      <td className="px-0.5 py-1">
                        <input
                          type="date"
                          name="expDate"
                          value={it.expDate || ""}
                          onChange={(e) => onItemChange(e, i)}
                          className="w-[95px] py-1 px-2 border border-theme rounded text-[10px]"
                        />
                      </td>

                      {/* RATE */}
                      <td className="px-0.5 py-1">
                        <input
                          type="number"
                          name="rate"
                          value={it.rate}
                          onChange={(e) => onItemChange(e, i)}
                          className="w-[70px] py-1 px-2 border border-theme rounded text-[11px]"
                        />
                      </td>

                      {/* DISCOUNT */}
                      <td className="px-0.5 py-1">
                        <input
                          type="number"
                          name="discount"
                          value={it.discount || 0}
                          onChange={(e) => onItemChange(e, i)}
                          className="w-[60px] py-1 px-2 border border-theme rounded text-[11px]"
                        />
                      </td>

                      {/* TAX */}
                      <td className="px-0.5 py-1">
                        <input
                          type="number"
                          name="vatRate"
                          value={it.vatRate}
                          onChange={(e) => onItemChange(e, i)}
                          className="w-[60px] py-1 px-2 border border-theme rounded text-[11px]"
                        />
                      </td>

                      {/* TAX CODE */}
                      <td className="px-0.5 py-1">
                        <input
                          name="vatCd"
                          value={it.vatCd || ""}
                          onChange={(e) => onItemChange(e, i)}
                          className="w-[60px] py-1 px-2 border border-theme rounded text-[11px]"
                        />
                      </td>

                      {/* AMOUNT */}
                      <td className="px-1 text-right text-[10px]">
                        {symbol} {amount.toFixed(2)}
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(i)}
                          className="p-0.5 rounded bg-danger/10 text-danger"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex justify-between items-center gap-3">
            {/* Add Item Button */}
            <button
              type="button"
              onClick={onAddItem}
              className="px-4 py-1.5 bg-primary hover:bg-[var(--primary-600)] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus size={14} />
              Add Item
            </button>

            {(items.length > 5 || page > 0) && (
              <div className="flex items-center gap-3 py-1 px-2 bg-app rounded">
                <div className="text-[11px] text-muted whitespace-nowrap">
                  Showing {page * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min((page + 1) * ITEMS_PER_PAGE, items.length)} of{" "}
                  {items.length} items
                </div>

                <div className="flex gap-1.5 items-center">
                  <button
                    type="button"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-2.5 py-1 bg-card text-main border border-theme rounded text-[11px]"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage(page + 1)}
                    disabled={(page + 1) * ITEMS_PER_PAGE >= items.length}
                    className="px-2.5 py-1 bg-card text-main border border-theme rounded text-[11px]"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Supplier Details + Summary */}
        <div className="flex flex-col gap-2">
          {/* Supplier Details */}
          <div className="bg-card rounded-lg p-2 w-[220px]">
            <h3 className="text-[12px] font-semibold text-main mb-2">
              Supplier Details
            </h3>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs text-main">
                <span className="flex items-center gap-2">
                  <User size={16} className="text-muted" />
                  <span className="text-xs text-main">
                    {form.supplier || "Supplier Name"}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted">
                <Mail size={14} className="text-muted" />
                <span>{form.supplierEmail || "supplier@example.com"}</span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted">
                <Phone size={14} className="text-muted" />
                <span>{form.supplierPhone || "-"}</span>
              </div>

              {/* Tax Category Info */}
              {form.taxCategory && (
                <div className="bg-card rounded-lg mt-1">
                  <h3 className="text-[11px] font-semibold text-main mb-1">
                    Order Information
                  </h3>

                  <div className="flex flex-col gap-1">
                    {/* Tax Category */}
                    <div className="flex items-center gap-15 text-xs">
                      <span className="text-muted">Tax Category</span>
                      <span className="font-medium text-main">
                        {form.taxCategory}
                      </span>
                    </div>

                    {/* Currency  */}
                    <div className="flex items-center gap-21 text-xs">
                      <span className="text-muted">Currency</span>
                      <span className="font-medium text-main">
                        {form.currency || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-card rounded-lg p-3 w-[220px]">
            <h3 className="text-[13px] font-semibold text-main mb-2">
              Summary
            </h3>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Total Items</span>
                <span className="font-medium text-main">{items.length}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Total Quantity</span>
                <span className="font-medium text-main">
                  {form.totalQuantity}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Grand Total</span>
                <span className="font-medium text-main">
                  {symbol} {form.grandTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Rounding Adj</span>
                <span className="font-medium text-main">
                  {symbol} {form.roundingAdjustment.toFixed(2)}
                </span>
              </div>

              {/* Grand Total Highlight */}
              <div className="mt-2 p-2 bg-primary rounded-lg w-full">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">
                    Rounded Total
                  </span>
                  <span className="text-sm font-bold text-white">
                    {symbol} {form.roundedTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
