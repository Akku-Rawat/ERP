import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "../../ui/modal/formComponent";
import type { TaxRow, PurchaseOrderFormData } from "../../../types/Supply/purchaseOrder";

interface TaxTabProps {
  form: PurchaseOrderFormData;
  taxRows: TaxRow[];
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTaxRowChange: (idx: number, key: keyof TaxRow, value: any) => void;
  onAddTaxRow: () => void;
  onRemoveTaxRow: (idx: number) => void;
}

export const TaxTab: React.FC<TaxTabProps> = ({
  form,
  taxRows,
  onFormChange,
  onTaxRowChange,
  onAddTaxRow,
  onRemoveTaxRow,
}) => {
  return (
    <div className="space-y-6 mt-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
        Taxes and Charges
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Tax Category"
          name="taxCategory"
          value={form.taxCategory}
          onChange={onFormChange}
          placeholder="Enter Tax Category"
        />
        <Input
          label="Shipping Rule"
          name="shippingRule"
          value={form.shippingRule}
          onChange={onFormChange}
          placeholder="Enter Shipping Rule"
        />
        <Input
          label="Incoterm"
          name="incoterm"
          value={form.incoterm}
          onChange={onFormChange}
          placeholder="Enter Incoterm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Purchase Taxes and Charges Template"
          name="taxesChargesTemplate"
          value={form.taxesChargesTemplate}
          onChange={onFormChange}
          placeholder="Enter Template"
        />
      </div>

      <div>
        <span className="font-medium text-gray-700">Purchase Taxes and Charges</span>
        <div className="overflow-x-auto rounded-lg border mt-2">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-2 py-2 text-left">#</th>
                <th className="px-2 py-2 text-left">Type *</th>
                <th className="px-2 py-2 text-left">Account Head *</th>
                <th className="px-2 py-2 text-left">Tax Rate</th>
                <th className="px-2 py-2 text-left">Amount</th>
                <th className="px-2 py-2 text-right">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {taxRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-400">
                    No Data
                  </td>
                </tr>
              ) : (
                taxRows.map((row, i) => {
                  const total = (row.taxRate * row.amount) / 100;
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-center">{i + 1}</td>
                      <td className="px-1 py-1">
                        <input
                          className="w-full rounded border p-1 text-sm"
                          value={row.type}
                          onChange={(e) => onTaxRowChange(i, "type", e.target.value)}
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          className="w-full rounded border p-1 text-sm"
                          value={row.accountHead}
                          onChange={(e) => onTaxRowChange(i, "accountHead", e.target.value)}
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="number"
                          className="w-full rounded border p-1 text-sm"
                          value={row.taxRate}
                          onChange={(e) => onTaxRowChange(i, "taxRate", Number(e.target.value))}
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="number"
                          className="w-full rounded border p-1 text-sm"
                          value={row.amount}
                          onChange={(e) => onTaxRowChange(i, "amount", Number(e.target.value))}
                        />
                      </td>
                      <td className="px-1 py-1 text-right font-medium">
                        {total.toFixed(2)}
                      </td>
                      <td className="px-1 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => onRemoveTaxRow(i)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={onAddTaxRow}
          className="flex items-center gap-1 rounded bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-200 mt-2"
        >
          <Plus className="w-4 h-4" /> Add Row
        </button>
      </div>
    </div>
  );
};