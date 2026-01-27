import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "../../ui/modal/formComponent";
import type { PaymentRow } from "../../../types/Supply/rfq";

interface TermsTabProps {
  paymentRows: PaymentRow[];
  termsAndConditions: string;
  onPaymentRowChange: (idx: number, field: keyof PaymentRow, value: any) => void;
  onAddPaymentRow: () => void;
  onRemovePaymentRow: (idx: number) => void;
  onTermsChange: (value: string) => void;
}

export const TermsTab: React.FC<TermsTabProps> = ({
  paymentRows,
  termsAndConditions,
  onPaymentRowChange,
  onAddPaymentRow,
  onRemovePaymentRow,
  onTermsChange,
}) => {
  return (
    <Card title="Terms & Conditions">
      <div className="space-y-8 mx-auto bg-white rounded-lg p-6">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">Payment Terms</h3>
          <div className="mt-4">
            <span className="font-medium text-gray-700">Payment Schedule</span>
            <div className="overflow-x-auto rounded-lg border mt-2">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-2 py-2">No.</th>
                    <th className="px-2 py-2">Payment Term</th>
                    <th className="px-2 py-2">Description</th>
                    <th className="px-2 py-2">Due Date</th>
                    <th className="px-2 py-2">Invoice Portion</th>
                    <th className="px-2 py-2">Payment Amount</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paymentRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-6 text-gray-400">
                        No Data
                      </td>
                    </tr>
                  ) : (
                    paymentRows.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-center">{i + 1}</td>
                        <td className="px-1 py-1">
                          <input
                            className="w-full rounded border p-1 text-sm"
                            value={row.paymentTerm}
                            onChange={(e) => onPaymentRowChange(i, "paymentTerm", e.target.value)}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <input
                            className="w-full rounded border p-1 text-sm"
                            value={row.description}
                            onChange={(e) => onPaymentRowChange(i, "description", e.target.value)}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <input
                            type="date"
                            className="w-full rounded border p-1 text-sm"
                            value={row.dueDate}
                            onChange={(e) => onPaymentRowChange(i, "dueDate", e.target.value)}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <input
                            type="number"
                            className="w-full rounded border p-1 text-sm"
                            value={row.invoicePortion}
                            onChange={(e) => onPaymentRowChange(i, "invoicePortion", Number(e.target.value))}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <input
                            type="number"
                            className="w-full rounded border p-1 text-sm"
                            value={row.paymentAmount}
                            onChange={(e) => onPaymentRowChange(i, "paymentAmount", Number(e.target.value))}
                          />
                        </td>
                        <td className="px-1 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => onRemovePaymentRow(i)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            disabled={paymentRows.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={onAddPaymentRow}
              className="flex items-center gap-1 rounded bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-200 mt-2"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Terms and Conditions</h3>
          </div>
          <div className="p-6">
            <textarea
              value={termsAndConditions}
              onChange={(e) => onTermsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={12}
              placeholder="Enter terms and conditions..."
            />
          </div>
        </div>
      </div>
    </Card>
  );
};