import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { getEmployeeById } from "../../../api/employeeapi";
import { calculateZmPayrollFromGross } from "./util";
import { useAssignedSalaryStructure } from "../../../hooks/useAssignedSalaryStructure";
import { toSalaryStructureMoneyRows } from "../../../utils/salaryStructureDisplay";

interface EmployeeDetailsPageProps {
  employeeId: string;
  onBack: () => void;
}

type AnyRecord = Record<string, any>;

const isNil = (v: any) => v === null || v === undefined || v === "";

const toTitle = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

const formatValue = (value: any): React.ReactNode => {
  if (isNil(value)) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    const allPrimitive = value.every(
      (v) => v === null || v === undefined || ["string", "number", "boolean"].includes(typeof v),
    );
    if (allPrimitive) return value.map((v) => String(v)).join(", ");
    return `${value.length} item${value.length === 1 ? "" : "s"}`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([, v]) => !isNil(v))
      .filter(([, v]) => ["string", "number", "boolean"].includes(typeof v))
      .slice(0, 4)
      .map(([k, v]) => `${toTitle(k)}: ${String(v)}`);
    return entries.length ? entries.join(" · ") : "—";
  }
  return String(value);
};

const Card: React.FC<{ title: string; children: React.ReactNode; right?: React.ReactNode }> = ({
  title,
  children,
  right,
}) => (
  <div className="bg-card border border-theme rounded-2xl overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-theme flex items-center justify-between">
      <h3 className="text-xs font-extrabold text-main uppercase tracking-wider">{title}</h3>
      {right}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const KeyValueGrid: React.FC<{ data: AnyRecord; columns?: 2 | 3 | 4 }> = ({ data, columns = 2 }) => {
  const entries = useMemo(
    () =>
      Object.entries(data)
        .filter(([, v]) => !isNil(v))
        .sort(([a], [b]) => a.localeCompare(b)),
    [data],
  );

  if (!entries.length) return <div className="text-sm text-muted">No information available</div>;

  return (
    <div
      className={`grid grid-cols-1 gap-4 ${
        columns === 4
          ? "md:grid-cols-4"
          : columns === 3
            ? "md:grid-cols-3"
            : "md:grid-cols-2"
      }`}
    >
      {entries.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-1">
            {toTitle(k)}
          </div>
          <div className="text-sm text-main break-words">{formatValue(v)}</div>
        </div>
      ))}
    </div>
  );
};

const EmployeeDetailsPage: React.FC<EmployeeDetailsPageProps> = ({ employeeId, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await getEmployeeById(employeeId);
        if (!mounted) return;
        setData(resp);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Failed to load employee details");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [employeeId]);

  const employeeName =
    [
      data?.name,
      data?.employeeName,
      data?.personalInfo?.FirstName,
      data?.personalInfo?.OtherNames,
      data?.personalInfo?.LastName,
    ]
      .filter((v) => typeof v === "string" && v.trim().length > 0)
      .join(" ")
      .trim() ||
    data?.employeeId ||
    "Employee";

  const profilePictureUrl = data?.ProfilePicture || null;

  const headerJobTitle = String(data?.employmentInfo?.JobTitle ?? data?.jobTitle ?? "");
  const headerDepartment = String(data?.employmentInfo?.Department ?? data?.department ?? "");
  const headerStatus = String(data?.status ?? data?.employmentInfo?.Status ?? "").trim() || "—";
  const headerEmail = String(data?.email ?? data?.contactInfo?.Email ?? "");
  const employeeCode = String(data?.employeeId ?? data?.identityInfo?.EmployeeId ?? "");

  const {
    assignedSalaryStructureName,
    assignedSalaryStructureFromDate,
    salaryStructureDetail,
  } = useAssignedSalaryStructure(employeeCode);

  const identityInfo = (data?.identityInfo || {}) as AnyRecord;
  const personalInfo = (data?.personalInfo || {}) as AnyRecord;
  const contactInfo = (data?.contactInfo || {}) as AnyRecord;
  const employmentInfo = (data?.employmentInfo || {}) as AnyRecord;
  const payrollInfo = (data?.payrollInfo || {}) as AnyRecord;
  const bankInfo = (payrollInfo?.bankAccount || {}) as AnyRecord;
  const statutory = (payrollInfo?.statutoryDeductions || {}) as AnyRecord;
  const documents = (data?.documents || []) as any[];

  const assignedStructureLabel = useMemo(() => {
    const name = String(assignedSalaryStructureName ?? "").trim();
    if (!name) return "—";
    const fd = String(assignedSalaryStructureFromDate ?? "").trim();
    return fd ? `${name} (from ${fd})` : name;
  }, [assignedSalaryStructureFromDate, assignedSalaryStructureName]);

  const grossSalaryForCalc = useMemo(() => {
    const v =
      data?.grossSalary ??
      payrollInfo?.grossSalary ??
      payrollInfo?.GrossSalary ??
      payrollInfo?.basicSalary ??
      payrollInfo?.BasicSalary ??
      data?.basicSalary ??
      0;
    const direct = Number(v ?? 0);
    if (Number.isFinite(direct) && direct > 0) return direct;

    const earnings = Array.isArray(salaryStructureDetail?.earnings) ? salaryStructureDetail.earnings : [];
    const fromStructure = earnings.reduce((sum: number, e: any) => sum + (Number(e?.amount ?? 0) || 0), 0);
    return Number(fromStructure ?? 0) || 0;
  }, [data, payrollInfo, salaryStructureDetail]);

  const statutoryCalc = useMemo(() => {
    const rates = {
      napsaEmployeeRate: statutory?.napsaEmployeeRate,
      napsaEmployerRate: statutory?.napsaEmployerRate,
      nhimaRate: statutory?.nhimaRate,
    };

    return calculateZmPayrollFromGross(grossSalaryForCalc, {
      rates,
    });
  }, [grossSalaryForCalc, statutory]);

  const profileInfo = useMemo(
    () => ({ ...identityInfo, ...personalInfo, ...contactInfo }),
    [identityInfo, personalInfo, contactInfo],
  );

  const payrollMain = useMemo(() => {
    const copy = { ...(payrollInfo || {}) } as AnyRecord;
    delete copy.bankAccount;
    delete copy.statutoryDeductions;
    return copy;
  }, [payrollInfo]);

  const employmentCompact = useMemo(() => {
    const omit = new Set(
      [
        "department",
        "jobtitle",
        "worklocation",
        "branch",
        "status",
        "email",
        "salarybreakdown",
        "weeklyschedule",
      ].map((s) => s.toLowerCase()),
    );
    const out: AnyRecord = {};
    Object.entries(employmentInfo || {}).forEach(([k, v]) => {
      if (omit.has(String(k).toLowerCase())) return;
      out[k] = v;
    });
    return out;
  }, [employmentInfo]);

  const weeklyScheduleRows = useMemo(() => {
    const raw =
      (employmentInfo as any)?.weeklySchedule ??
      (employmentInfo as any)?.WeeklySchedule ??
      (employmentInfo as any)?.weekly_schedule ??
      null;

    const normalize = (day: any) => {
      const d = String(day ?? "").trim();
      if (!d) return "";
      return d.charAt(0).toUpperCase() + d.slice(1).toLowerCase();
    };

    if (!raw) return [] as { day: string; time: string }[];

    if (Array.isArray(raw)) {
      return raw
        .map((x: any) => ({
          day: normalize(x?.day ?? x?.Day ?? x?.name ?? x?.label),
          time: String(x?.time ?? x?.Time ?? x?.hours ?? x?.value ?? "").trim(),
        }))
        .filter((r: any) => r.day && r.time);
    }

    if (typeof raw === "object") {
      return Object.entries(raw)
        .map(([k, v]) => ({ day: normalize(k), time: String(v ?? "").trim() }))
        .filter((r) => r.day && r.time);
    }

    const s = String(raw).trim();
    if (!s) return [] as { day: string; time: string }[];

    return s
      .split(/\s*[·,]\s*/g)
      .map((part) => {
        const p = String(part ?? "").trim();
        if (!p) return null;
        const idx = p.indexOf(":");
        if (idx === -1) return null;
        const day = normalize(p.slice(0, idx));
        const time = p.slice(idx + 1).trim();
        if (!day || !time) return null;
        return { day, time };
      })
      .filter(Boolean) as { day: string; time: string }[];
  }, [employmentInfo]);

  const payrollCompact = useMemo(() => {
    const omit = new Set(
      [
        "grosssalary",
        "basicsalary",
        "salarybreakdown",
        "department",
        "jobtitle",
        "worklocation",
      ].map((s) => s.toLowerCase()),
    );
    const out: AnyRecord = {};
    Object.entries(payrollMain || {}).forEach(([k, v]) => {
      if (omit.has(String(k).toLowerCase())) return;
      out[k] = v;
    });
    return out;
  }, [payrollMain]);

  const salaryBreakdown = useMemo(() => {
    const basic = payrollInfo?.basicSalary ?? payrollInfo?.BasicSalary ?? data?.basicSalary;
    const totalAllowances = payrollInfo?.allowances ?? payrollInfo?.Allowances ?? data?.allowances;
    const breakdown = payrollInfo?.salaryBreakdown ?? payrollInfo?.SalaryBreakdown ?? null;

    const earnings = Array.isArray(salaryStructureDetail?.earnings) ? salaryStructureDetail.earnings : [];
    if (earnings.length > 0) {
      return earnings
        .map((e: any) => ({ label: String(e?.component ?? "").trim(), amount: e?.amount }))
        .filter((r: any) => r.label && r.amount !== undefined && r.amount !== null);
    }

    if (Array.isArray(breakdown)) {
      return breakdown
        .map((x: any) => ({ label: String(x?.label ?? x?.name ?? ""), amount: x?.amount }))
        .filter((x: any) => x.label && x.amount !== undefined && x.amount !== null);
    }

    if (breakdown && typeof breakdown === "object") {
      return Object.entries(breakdown)
        .map(([k, v]) => ({ label: toTitle(String(k)), amount: v }))
        .filter((x) => x.label && x.amount !== undefined && x.amount !== null);
    }

    const rows: { label: string; amount: any }[] = [];
    if (basic !== undefined && basic !== null && basic !== "") rows.push({ label: "Basic Salary", amount: basic });
    if (totalAllowances !== undefined && totalAllowances !== null && totalAllowances !== "") rows.push({ label: "Allowances", amount: totalAllowances });
    return rows;
  }, [data?.allowances, data?.basicSalary, payrollInfo, salaryStructureDetail]);

  return (
    <div className="h-screen flex flex-col bg-app overflow-hidden">
      <header className="h-12 shrink-0 bg-card border-b border-theme px-5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-app text-muted hover:text-main transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-theme opacity-40" />
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-main truncate">Employee Details</div>
            <div className="text-xs text-muted truncate">{employeeName} • {employeeId}</div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        {loading ? (
          <div className="rounded-xl border border-theme bg-app p-6 text-sm text-muted">Loading employee details…</div>
        ) : error ? (
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-sm font-semibold text-danger">{error}</div>
        ) : (
          <div className="max-w-[1280px] mx-auto">
            <div className="bg-card border border-theme rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-app border border-theme flex items-center justify-center overflow-hidden shrink-0">
                        {profilePictureUrl ? (
                          <img src={profilePictureUrl} alt={employeeName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-primary/10" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-lg font-extrabold text-main truncate">{employeeName}</div>
                        <div className="text-xs text-muted mt-0.5 truncate">{employeeCode ? `Employee ID: ${employeeCode}` : `ID: ${employeeId}`}</div>
                      </div>
                    </div>

                    <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold border ${headerStatus.toLowerCase() === "active" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}`}>
                      {headerStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    <div className="bg-app border border-theme rounded-xl px-4 py-3">
                      <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Job Title</div>
                      <div className="text-sm font-bold text-main mt-1 truncate">{headerJobTitle || "—"}</div>
                    </div>
                    <div className="bg-app border border-theme rounded-xl px-4 py-3">
                      <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Department</div>
                      <div className="text-sm font-bold text-main mt-1 truncate">{headerDepartment || "—"}</div>
                    </div>
                    <div className="bg-app border border-theme rounded-xl px-4 py-3">
                      <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Email</div>
                      <div className="text-sm font-bold text-main mt-1 truncate">{headerEmail || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
                <div className="lg:col-span-2">
                  <Card title="Employee Information">
                    <div className="space-y-5">
                      <div>
                        <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-2">Profile</div>
                        <KeyValueGrid data={profileInfo} columns={4} />
                      </div>
                    </div>
                  </Card>

                  <div className="mt-5">
                    <Card
                      title="Salary, Bank & Deductions"
                      right={
                        <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">
                          {assignedStructureLabel}
                        </div>
                      }
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="min-w-0">
                          <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-3">Salary Breakdown</div>
                          <div className="space-y-2">
                            {salaryBreakdown.length ? (
                              salaryBreakdown.map((r: any) => (
                                <div key={r.label} className="flex items-center justify-between gap-3">
                                  <div className="text-xs font-semibold text-main">{r.label}</div>
                                  <div className="text-xs font-mono font-extrabold text-main tabular-nums">{r.amount ?? "—"}</div>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-muted">No salary data</div>
                            )}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-3">Bank</div>
                          <KeyValueGrid data={bankInfo} />
                        </div>

                        <div className="min-w-0">
                          <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-3">Statutory Deductions</div>
                          <div className="space-y-2">
                            {Array.isArray(salaryStructureDetail?.deductions) && salaryStructureDetail.deductions.length > 0 ? (
                              toSalaryStructureMoneyRows(salaryStructureDetail.deductions).map((d: any) => (
                                  <div key={d.label} className="flex items-center justify-between gap-3 bg-app border border-theme rounded-xl px-4 py-2">
                                    <div className="text-xs font-semibold text-main">{d.label}</div>
                                    <div className="text-xs font-mono font-extrabold text-main tabular-nums">
                                      ZMW {Number(d.amount ?? 0).toLocaleString("en-ZM")}
                                    </div>
                                  </div>
                                ))
                            ) : (
                              [
                                {
                                  label: "Napsa Employee",
                                  rate: statutoryCalc?.rates?.napsaEmployeeRate,
                                  amount: statutoryCalc?.statutory?.napsaEmployee,
                                },
                                {
                                  label: "Napsa Employer",
                                  rate: statutoryCalc?.rates?.napsaEmployerRate,
                                  amount: statutoryCalc?.statutory?.napsaEmployer,
                                },
                                {
                                  label: "Nhima",
                                  rate: statutoryCalc?.rates?.nhimaRate,
                                  amount: statutoryCalc?.statutory?.nhima,
                                },
                                {
                                  label: "Paye",
                                  rate: null,
                                  amount: statutoryCalc?.statutory?.paye,
                                },
                              ].map((r) => (
                                <div key={r.label} className="flex items-center justify-between gap-3 bg-app border border-theme rounded-xl px-4 py-2">
                                  <div className="text-xs font-semibold text-main">{r.label}</div>
                                  <div className="text-xs font-mono font-extrabold text-main tabular-nums">
                                    {r.rate === null || r.rate === undefined ? "" : `${Number(r.rate)}% • `}
                                    ZMW {Number(r.amount ?? 0).toLocaleString("en-ZM")}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="space-y-5">
                  <Card title="Employment & Payroll">
                    <KeyValueGrid columns={4} data={{ ...(employmentCompact || {}), ...(payrollCompact || {}) }} />

                    {weeklyScheduleRows.length > 0 && (
                      <div className="mt-6">
                        <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-2">Weekly Schedule</div>
                        <div className="overflow-x-auto border border-theme rounded-xl">
                          <table className="w-full">
                            <thead className="bg-app border-b border-theme">
                              <tr>
                                <th className="px-4 py-2 text-[10px] font-extrabold text-muted uppercase tracking-wider text-left whitespace-nowrap">Day</th>
                                <th className="px-4 py-2 text-[10px] font-extrabold text-muted uppercase tracking-wider text-left whitespace-nowrap">Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {weeklyScheduleRows.map((r) => (
                                <tr key={r.day} className="border-b border-theme last:border-0">
                                  <td className="px-4 py-2 text-xs font-bold text-main whitespace-nowrap">{r.day}</td>
                                  <td className="px-4 py-2 text-xs text-muted whitespace-nowrap">{r.time}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </Card>

                  <Card
                    title="Documents"
                    right={
                      <div className="text-xs font-extrabold text-muted tabular-nums">
                        {Array.isArray(documents) ? documents.length : 0}
                      </div>
                    }
                  >
                    {Array.isArray(documents) && documents.length > 0 ? (
                      <div className="space-y-3">
                        {documents.map((doc, idx) => (
                          <div key={idx} className="py-2">
                            <KeyValueGrid data={(doc || {}) as AnyRecord} columns={4} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted">No documents</div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default EmployeeDetailsPage;
