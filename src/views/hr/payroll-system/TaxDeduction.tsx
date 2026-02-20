// TaxDeduction.tsx
import React from "react";
import type { PayrollRecord } from "../../../types/payrolltypes";
import { fmtINR } from "./utils";
import { ESI_EMPLOYER_RATE, ESI_RATE, PROFESSIONAL_TAX } from "./constants";

interface TaxDeductionProps {
  records: PayrollRecord[];
}

const TaxDeduction: React.FC<TaxDeductionProps> = ({ records }) => {
  const paidRecs = records.filter(r => r.status === "Paid");

  const totalTax = paidRecs.reduce((s, r) => s + r.taxDeduction, 0);
  const totalPF  = paidRecs.reduce((s, r) => s + r.pfDeduction,  0);
  const totalESI = paidRecs.reduce((s, r) => s + r.esiDeduction, 0);
  const totalPT  = paidRecs.length * PROFESSIONAL_TAX;
  const grandTotal = totalTax + totalPF * 2 + Math.round(totalESI * (1 + ESI_EMPLOYER_RATE / ESI_RATE)) + totalPT;

  const rows = [
    {
      type: "Income Tax (TDS)",
      emp: totalTax,
      employer: 0,
      total: totalTax,
      note: "Deducted per IT declaration",
    },
    {
      type: "Provident Fund (PF)",
      emp: totalPF,
      employer: totalPF,
      total: totalPF * 2,
      note: "12% each — employee & employer",
    },
    {
      type: "ESI",
      emp: totalESI,
      employer: Math.round(totalESI * (ESI_EMPLOYER_RATE / ESI_RATE)),
      total: Math.round(totalESI * (1 + ESI_EMPLOYER_RATE / ESI_RATE)),
      note: "0.75% emp · 3.25% employer",
    },
    {
      type: "Professional Tax",
      emp: totalPT,
      employer: 0,
      total: totalPT,
      note: "₹200/month per employee",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="flex items-center justify-between bg-app border border-theme rounded-xl p-4">
        <div>
          <h2 className="text-sm font-extrabold text-main">Tax & Statutory Deductions</h2>
          <p className="text-xs text-muted mt-0.5">
            Showing deductions for {paidRecs.length} paid employee{paidRecs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted uppercase tracking-wider">Total Liability</p>
          <p className="text-2xl font-extrabold text-danger tabular-nums">₹{fmtINR(grandTotal)}</p>
        </div>
      </div>

      {/* Breakdown table */}
      <div className="border border-theme rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-app border-b border-theme">
            <tr>
              {["Deduction Type", "Employee Share", "Employer Share", "Total", "Note"].map((h, i) => (
                <th key={h} className={`px-5 py-3 text-[10px] font-extrabold text-muted uppercase tracking-wider ${i > 0 ? "text-right" : "text-left"} last:text-left`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.type} className={`border-b border-theme last:border-0 ${i % 2 === 1 ? "bg-app" : "bg-card"}`}>
                <td className="px-5 py-3 text-xs font-semibold text-main">{row.type}</td>
                <td className="px-5 py-3 text-right text-xs font-mono font-semibold text-main tabular-nums">₹{fmtINR(row.emp)}</td>
                <td className="px-5 py-3 text-right text-xs font-mono text-muted tabular-nums">
                  {row.employer > 0 ? `₹${fmtINR(row.employer)}` : "—"}
                </td>
                <td className="px-5 py-3 text-right text-xs font-mono font-extrabold text-main tabular-nums">₹{fmtINR(row.total)}</td>
                <td className="px-5 py-3 text-xs text-muted">{row.note}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-primary/5 border-t-2 border-primary/20">
            <tr>
              <td className="px-5 py-3 text-xs font-extrabold text-main">Grand Total</td>
              <td className="px-5 py-3 text-right text-xs font-mono font-bold text-main tabular-nums">
                ₹{fmtINR(totalTax + totalPF + totalESI + totalPT)}
              </td>
              <td className="px-5 py-3 text-right text-xs font-mono font-bold text-main tabular-nums">
                ₹{fmtINR(totalPF + Math.round(totalESI * (ESI_EMPLOYER_RATE / ESI_RATE)))}
              </td>
              <td className="px-5 py-3 text-right text-sm font-extrabold text-danger tabular-nums">
                ₹{fmtINR(grandTotal)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Regime split */}
      <div className="grid grid-cols-2 gap-4">
        {["New", "Old"].map(regime => {
          const regRecs = paidRecs.filter(r => r.taxRegime === regime);
          return (
            <div key={regime} className={`rounded-xl border p-4 ${regime === "New" ? "border-primary/20 bg-primary/5" : "border-warning/20 bg-warning/5"}`}>
              <p className={`text-xs font-extrabold mb-1 ${regime === "New" ? "text-primary" : "text-warning"}`}>
                {regime} Regime
              </p>
              <p className="text-2xl font-extrabold text-main">{regRecs.length}</p>
              <p className="text-xs text-muted mt-0.5">employees · ₹{fmtINR(regRecs.reduce((s, r) => s + r.taxDeduction, 0))} TDS</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaxDeduction;