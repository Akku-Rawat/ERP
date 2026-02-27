import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getSalaryStructureById, type SalaryStructureDetail } from "../../../api/salaryStructureApi";
import type { Employee } from "../../../types/payrolltypes";

type Props = {
  open: boolean;
  employees: Employee[];
  selectedEmployeeIds: string[];
  structureName: string;
  currency: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  onPayPeriodStartChange: (v: string) => void;
  onPayPeriodEndChange: (v: string) => void;
  onClose: () => void;
  onRunPayroll: () => void;
  runPayrollDisabled?: boolean;
  runPayrollLoading?: boolean;
};

const toIso = (d: Date) => d.toISOString().slice(0, 10);

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

export default function MultiPayrollPreviewModal({
  open,
  employees,
  selectedEmployeeIds,
  structureName,
  currency,
  payPeriodStart,
  payPeriodEnd,
  onPayPeriodStartChange,
  onPayPeriodEndChange,
  onClose,
  onRunPayroll,
  runPayrollDisabled,
  runPayrollLoading,
}: Props) {
  const selected = useMemo(() => {
    const set = new Set(selectedEmployeeIds.map((x) => String(x)));
    return employees.filter((e) => set.has(String(e.id)));
  }, [employees, selectedEmployeeIds]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeEmployee = selected[activeIndex] ?? null;
  const isLastEmployee = selected.length > 0 && activeIndex >= selected.length - 1;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<SalaryStructureDetail | null>(null);

  const initialMonth = useMemo(() => {
    const base = String(payPeriodStart || payPeriodEnd || "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(base)) return base.slice(0, 7);
    return "";
  }, [payPeriodEnd, payPeriodStart]);

  const [month, setMonth] = useState<string>(initialMonth);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    setMonth(initialMonth);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const max = Math.max(0, selected.length - 1);
    setActiveIndex((i) => Math.min(Math.max(0, i), max));
  }, [open, selected.length]);

  useEffect(() => {
    if (!open) return;
    if (!month) return;
    if (!/^\d{4}-\d{2}$/.test(month)) return;

    const [y, m] = month.split("-").map((v) => Number(v));
    if (!y || !m) return;
    const d = new Date(y, m - 1, 1);
    onPayPeriodStartChange(toIso(startOfMonth(d)));
    onPayPeriodEndChange(toIso(endOfMonth(d)));
  }, [month, open]);

  useEffect(() => {
    if (!open) return;
    const name = String(structureName ?? "").trim();
    if (!name) {
      setDetail(null);
      setError(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      setDetail(null);
      try {
        const resp = await getSalaryStructureById(name);
        if (!mounted) return;
        setDetail(resp);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Failed to load salary structure");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [open, structureName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-lg font-semibold">Payroll Preview</div>
            <div className="text-xs text-white/80 mt-0.5">Multiple Employees</div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-600">Report Period</div>
              <div className="mt-3 grid grid-cols-1 gap-3">
                <div>
                  <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Month</div>
                  <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="mt-1 h-10 w-full px-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 shadow-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Start</div>
                    <input
                      type="date"
                      value={payPeriodStart}
                      onChange={(e) => onPayPeriodStartChange(e.target.value)}
                      className="mt-1 h-10 w-full px-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 shadow-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">End</div>
                    <input
                      type="date"
                      value={payPeriodEnd}
                      onChange={(e) => onPayPeriodEndChange(e.target.value)}
                      className="mt-1 h-10 w-full px-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 shadow-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Summary</div>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Employees</span>
                      <span className="font-bold text-gray-900 tabular-nums">{selected.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Salary Structure</span>
                      <span className="font-bold text-gray-900 tabular-nums">{String(structureName || (detail as any)?.name || "—")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-600">Employee Preview</div>
                  <div className="text-xs text-gray-500 mt-0.5">Use previous/next to review selected employees</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    disabled={activeIndex <= 0}
                    className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex((i) => Math.min(selected.length - 1, i + 1))}
                    disabled={activeIndex >= selected.length - 1}
                    className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!activeEmployee ? (
                <div className="text-sm text-gray-500 mt-6">No employee selected</div>
              ) : (
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Employee</div>
                    <div className="text-base font-extrabold text-gray-900 mt-1 break-words">
                      {String(activeEmployee.name || activeEmployee.id || "Employee")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{String((activeEmployee as any).employeeId || activeEmployee.id)}</div>
                    <div className="text-xs text-gray-500 mt-1">{String(activeEmployee.department || "")}</div>
                    <div className="text-xs text-gray-500">{String(activeEmployee.jobTitle || (activeEmployee as any).designation || "")}</div>
                  </div>

                  <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Salary Structure</div>
                    <div className="text-sm font-bold text-gray-900 mt-1 break-words">
                      {String(structureName || (detail as any)?.name || "—")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Company: {String((detail as any)?.company || "—")}</div>
                    <div className="text-xs text-gray-600">Status: {Boolean((detail as any)?.is_active) ? "Active" : "Inactive"}</div>
                  </div>
                </div>
              )}

              <div className="mt-5 border-t border-gray-200 pt-3 flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  {selected.length === 0
                    ? ""
                    : `Employee ${activeIndex + 1} of ${selected.length}`}
                </div>
                <div className="text-xs text-gray-500">Ready to run payroll</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-gray-600">Salary Structure Components</div>
            <div className="text-xs text-gray-500 mt-0.5">Earnings and deductions for this run</div>

            {loading ? (
              <div className="text-sm text-gray-500 mt-4">Loading salary structure…</div>
            ) : error ? (
              <div className="text-sm text-red-600 mt-4">{error}</div>
            ) : !detail ? (
              <div className="text-sm text-gray-500 mt-4">—</div>
            ) : (
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-[11px] font-extrabold text-gray-600 uppercase tracking-wider">Earnings</div>
                  <div className="p-4 space-y-2">
                    {(Array.isArray((detail as any)?.earnings) ? (detail as any).earnings : []).length === 0 ? (
                      <div className="text-sm text-gray-500">—</div>
                    ) : (
                      (detail as any).earnings.map((row: any, idx: number) => (
                        <div key={`${row?.component ?? idx}`} className="flex items-center justify-between gap-3 border-b border-gray-200/60 last:border-0 pb-2 last:pb-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{String(row?.component ?? "—")}</div>
                          <div className="text-sm font-extrabold text-gray-900 tabular-nums whitespace-nowrap">{currency} {Number(row?.amount ?? 0).toLocaleString("en-ZM")}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-[11px] font-extrabold text-gray-600 uppercase tracking-wider">Deductions</div>
                  <div className="p-4 space-y-2">
                    {(Array.isArray((detail as any)?.deductions) ? (detail as any).deductions : []).length === 0 ? (
                      <div className="text-sm text-gray-500">—</div>
                    ) : (
                      (detail as any).deductions.map((row: any, idx: number) => (
                        <div key={`${row?.component ?? idx}`} className="flex items-center justify-between gap-3 border-b border-gray-200/60 last:border-0 pb-2 last:pb-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{String(row?.component ?? "—")}</div>
                          <div className="text-sm font-extrabold text-gray-900 tabular-nums whitespace-nowrap">{currency} {Number(row?.amount ?? 0).toLocaleString("en-ZM")}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          {!isLastEmployee ? (
            <button
              type="button"
              onClick={() => setActiveIndex((i) => Math.min(selected.length - 1, i + 1))}
              disabled={selected.length === 0 || activeIndex >= selected.length - 1}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={onRunPayroll}
              disabled={Boolean(runPayrollDisabled) || Boolean(runPayrollLoading) || selected.length === 0}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {runPayrollLoading ? "Running…" : `Run Payroll (${selected.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
