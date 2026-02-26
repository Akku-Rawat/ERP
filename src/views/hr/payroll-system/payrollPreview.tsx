
import React from "react";
import { X } from "lucide-react";
import { getSalaryStructureById, type SalaryStructureDetail } from "../../../api/salaryStructureApi";

type PayrollPreviewModalProps = {
  open: boolean;
  structureName: string;
  currency?: string;
  onClose: () => void;
  onRunPayroll?: () => void | Promise<void>;
  runPayrollDisabled?: boolean;
  runPayrollLoading?: boolean;
};

export default function PayrollPreviewModal({
  open,
  structureName,
  currency,
  onClose,
  onRunPayroll,
  runPayrollDisabled,
  runPayrollLoading,
}: PayrollPreviewModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<SalaryStructureDetail | null>(null);

  React.useEffect(() => {
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

  const safeCurrency = String(currency ?? "").trim();
  const earnings = Array.isArray((detail as any)?.earnings) ? (detail as any).earnings : [];
  const deductions = Array.isArray((detail as any)?.deductions) ? (detail as any).deductions : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-theme rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-6 py-4 bg-app border-b border-theme flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-main">Salary Structure</div>
            <div className="text-xs text-muted mt-0.5 break-words">{String(structureName || (detail as any)?.name || "—")}</div>
          </div>
          <div className="flex items-center gap-2">
            {onRunPayroll && (
              <button
                type="button"
                onClick={() => onRunPayroll()}
                disabled={!!runPayrollDisabled}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success text-white text-xs font-extrabold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {runPayrollLoading ? "Running..." : "Run Payroll"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-card text-muted hover:text-main transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-xs text-muted">Loading salary structure…</div>
          ) : error ? (
            <div className="text-xs text-danger">{error}</div>
          ) : !detail ? (
            <div className="text-xs text-muted">—</div>
          ) : (
            <>
              <div className="border border-theme rounded-xl bg-card p-4">
                <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Salary Structure Details</div>
                <div className="mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-app border border-theme rounded-lg p-3">
                      <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">ID</div>
                      <div className="text-xs font-bold text-main mt-1 break-words">{String((detail as any)?.id ?? "—")}</div>
                    </div>
                    <div className="bg-app border border-theme rounded-lg p-3">
                      <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Name</div>
                      <div className="text-xs font-bold text-main mt-1 break-words">{String((detail as any)?.name ?? "—")}</div>
                    </div>
                    <div className="bg-app border border-theme rounded-lg p-3">
                      <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Company</div>
                      <div className="text-xs font-bold text-main mt-1 break-words">{String((detail as any)?.company ?? "—")}</div>
                    </div>
                    <div className="bg-app border border-theme rounded-lg p-3">
                      <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Active</div>
                      <div className="text-xs font-bold text-main mt-1">{String(Boolean((detail as any)?.is_active))}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-theme rounded-xl bg-card p-4">
                  <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Earnings</div>
                  <div className="mt-3 space-y-2">
                    {earnings.length === 0 ? (
                      <div className="text-xs text-muted">—</div>
                    ) : (
                      earnings.map((row: any, idx: number) => (
                        <div key={`${row?.component ?? idx}`} className="border-b border-theme/60 last:border-0 py-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-main truncate">{String(row?.component ?? "—")}</div>
                              <div className="text-[11px] text-muted mt-0.5">abbr: {String(row?.abbr ?? "—")} | depends_on_payment_days: {String(Boolean(row?.depends_on_payment_days))}</div>
                              <div className="text-[11px] text-muted">is_tax_applicable: {String(Boolean(row?.is_tax_applicable))}{String(row?.formula ?? "").trim() ? ` | formula: ${String(row?.formula)}` : ""}</div>
                            </div>
                            <div className="text-xs font-extrabold text-main tabular-nums whitespace-nowrap">
                              {safeCurrency} {safeCurrency ? " " : ""}{Number(row?.amount ?? 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border border-theme rounded-xl bg-card p-4">
                  <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Deductions</div>
                  <div className="mt-3 space-y-2">
                    {deductions.length === 0 ? (
                      <div className="text-xs text-muted">—</div>
                    ) : (
                      deductions.map((row: any, idx: number) => (
                        <div key={`${row?.component ?? idx}`} className="border-b border-theme/60 last:border-0 py-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-main truncate">{String(row?.component ?? "—")}</div>
                              <div className="text-[11px] text-muted mt-0.5">abbr: {String(row?.abbr ?? "—")} | depends_on_payment_days: {String(Boolean(row?.depends_on_payment_days))}</div>
                              <div className="text-[11px] text-muted">is_tax_applicable: {String(Boolean(row?.is_tax_applicable))}{String(row?.formula ?? "").trim() ? ` | formula: ${String(row?.formula)}` : ""}</div>
                            </div>
                            <div className="text-xs font-extrabold text-main tabular-nums whitespace-nowrap">
                              {safeCurrency} {safeCurrency ? " " : ""}{Number(row?.amount ?? 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

