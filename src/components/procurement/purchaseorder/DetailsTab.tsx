import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input, Select, Card, Button } from "../../ui/modal/formComponent";
import { SupplierDropdown } from "./SupplierDropdown";
import type { ItemRow, PurchaseOrderFormData } from "../../../types/Supply/purchaseOrder";

interface DetailsTabProps {
  form: PurchaseOrderFormData;
  items: ItemRow[];
  suppliers: { name: string }[];
  suppLoading: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSupplierChange: (s: any) => void;
  onItemChange: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  onAddItem: () => void;
  onRemoveItem: (idx: number) => void;
  getCurrencySymbol: () => string;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({
  form,
  items,
  suppliers,
  suppLoading,
  onFormChange,
  onSupplierChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  getCurrencySymbol,
}) => {
  const symbol = getCurrencySymbol();

  //  Pagination Logic
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(0);

  useEffect(() => {
    const newPage = Math.floor((items.length - 1) / ITEMS_PER_PAGE);
    if (newPage !== page) setPage(newPage);
  }, [items.length]);

  const paginatedItems = items.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="grid grid-cols-3 gap-6 max-h-screen overflow-auto p-4 mt-6 bg-app text-main">
      <div className="col-span-2 bg-card p-4 rounded-lg border border-theme">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Input label="PO Number" name="poNumber" type="text" value={form.poNumber} onChange={onFormChange} />
          <SupplierDropdown value={form.supplier} onChange={onSupplierChange} suppliers={suppliers} suppLoading={suppLoading} />
          <Input label="Date" name="date" type="date" value={form.date} onChange={onFormChange} />
          <Input label="Required By" name="requiredBy" type="date" value={form.requiredBy} onChange={onFormChange} />

          <Select label="Currency" name="currency" value={form.currency} onChange={onFormChange}>
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </Select>

          <div className="col-span-3 grid grid-cols-3 gap-4">
            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={onFormChange}
              options={[
                { value: "Draft", label: "Draft" },
                { value: "Submitted", label: "Submitted" },
                { value: "Approved", label: "Approved" },
                { value: "Cancelled", label: "Cancelled" },
              ]}
            />
            <Input label="Cost Center" name="costCenter" value={form.costCenter} onChange={onFormChange} />
            <Input label="Project" name="project" value={form.project} onChange={onFormChange} />
          </div>
        </div>

        <div className="my-6 h-px border-theme border" />

        <h3 className="mb-4 text-lg font-semibold underline text-main">Order Items</h3>

        {/* Pagination Info */}
        <div className="flex justify-between text-sm text-muted mb-2">
          <span>
            Showing {page * ITEMS_PER_PAGE + 1}–
            {Math.min((page + 1) * ITEMS_PER_PAGE, items.length)} of {items.length}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-1 bg-app border border-theme rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * ITEMS_PER_PAGE >= items.length}
              className="px-2 py-1 bg-app border border-theme rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-theme">
          <table className="w-full text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-2 py-2 text-left">#</th>
                <th className="px-2 py-2 text-left">Item Code</th>
                <th className="px-2 py-2 text-left">Required By</th>
                <th className="px-2 py-2 text-left">Qty</th>
                <th className="px-2 py-2 text-left">UOM</th>
                <th className="px-2 py-2 text-left">Rate</th>
                <th className="px-2 py-2 text-right">Amount</th>
                <th></th>
              </tr>
            </thead>

            <tbody className="divide-y border-theme">
              {paginatedItems.map((it, idx) => {
                const i = page * ITEMS_PER_PAGE + idx;
                const amount = it.quantity * it.rate;

                return (
                  <tr key={i} className="row-hover">
                    <td className="px-3 py-2 text-center">{i + 1}</td>

                    <td className="px-1 py-1">
                      <input
                        className="w-full rounded border border-theme bg-app p-1 text-sm"
                        name="itemCode"
                        value={it.itemCode}
                        onChange={(e) => onItemChange(e, i)}
                      />
                    </td>

                    <td className="px-1 py-1">
                      <input
                        type="date"
                        className="w-full rounded border border-theme bg-app p-1 text-sm"
                        name="requiredBy"
                        value={it.requiredBy}
                        onChange={(e) => onItemChange(e, i)}
                      />
                    </td>

                    <td className="px-1 py-1">
                      <input
                        type="number"
                        className="w-full rounded border border-theme bg-app p-1 text-right text-sm"
                        name="quantity"
                        value={it.quantity}
                        onChange={(e) => onItemChange(e, i)}
                      />
                    </td>

                    <td className="px-1 py-1">
                      <input
                        className="w-full rounded border border-theme bg-app p-1 text-sm"
                        name="uom"
                        value={it.uom}
                        onChange={(e) => onItemChange(e, i)}
                      />
                    </td>

                    <td className="px-1 py-1">
                      <input
                        type="number"
                        className="w-full rounded border border-theme bg-app p-1 text-right text-sm"
                        name="rate"
                        value={it.rate}
                        onChange={(e) => onItemChange(e, i)}
                      />
                    </td>

                    <td className="px-1 py-1 text-right font-medium">
                      {symbol}{amount.toFixed(2)}
                    </td>

                    <td className="px-1 py-1 text-center">
                      <Button variant="ghost" onClick={() => onRemoveItem(i)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Button variant="secondary" className="mt-3" onClick={onAddItem}>
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      {/* Right Sidebar */}
      <div className="col-span-1 sticky top-0 flex flex-col items-center gap-6 px-4 lg:px-6 h-fit">
        <div className="w-full max-w-sm space-y-6">
          <Card title="Supplier Details">
            <div className="space-y-2 text-sm text-main">
              <div className="flex justify-between">
                <span className="font-medium text-muted">Supplier Name</span>
                <span className="font-medium">{form.supplier || "Not Selected"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted">Contact</span>
                <span className="font-medium">+91 9876543210</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base font-semibold">Email Address</span>
                <span className="text-base font-bold text-primary">supplier@example.com</span>
              </div>
            </div>
          </Card>

          <Card title="Order Summary">
            <div className="space-y-2 text-sm text-main">
              <div className="flex justify-between">
                <span className="font-medium text-muted">Total Items</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted">Total Quantity</span>
                <span className="font-medium">{form.totalQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted">Grand Total</span>
                <span className="font-medium">{symbol}{form.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted">Rounding Adj</span>
                <span className="font-medium">{symbol}{form.roundingAdjustment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-theme pt-2 mt-2">
                <span className="text-base font-semibold">Rounded Total</span>
                <span className="text-base font-bold text-primary">{symbol}{form.roundedTotal.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
