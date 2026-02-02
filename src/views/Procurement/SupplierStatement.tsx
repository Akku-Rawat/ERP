import React from "react";
import type { Supplier } from "../../types/Supply/supplier";

interface Props {
  supplier: Supplier;
}

const SupplierStatement: React.FC<Props> = ({ supplier }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-card border border-theme rounded-xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-main">
              Supplier Statement
            </h2>
            <p className="text-sm text-muted">
              {supplier?.supplierName} · {supplier?.supplierCode}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-primary/5 border border-theme rounded-lg p-4">
            <p className="text-xs text-muted uppercase">Total Purchases</p>
            <p className="text-lg font-semibold text-main">0.00</p>
          </div>

          <div className="bg-success/10 border border-theme rounded-lg p-4">
            <p className="text-xs text-muted uppercase">Total Paid</p>
            <p className="text-lg font-semibold text-success">0.00</p>
          </div>

          <div className="bg-warning/10 border border-theme rounded-lg p-4">
            <p className="text-xs text-muted uppercase">Outstanding</p>
            <p className="text-lg font-semibold text-warning">0.00</p>
          </div>
        </div>

        {/* Statement Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-theme rounded-lg overflow-hidden">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                  Reference
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase">
                  Debit
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase">
                  Credit
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="row-hover border-t border-theme">
                <td className="px-4 py-3 text-sm text-muted">—</td>
                <td className="px-4 py-3 text-sm text-muted">No records</td>
                <td className="px-4 py-3 text-sm text-right">—</td>
                <td className="px-4 py-3 text-sm text-right">—</td>
                <td className="px-4 py-3 text-sm text-right">0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SupplierStatement;
