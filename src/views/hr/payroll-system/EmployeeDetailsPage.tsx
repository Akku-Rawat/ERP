import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { getEmployeeById } from "../../../api/employeeapi";

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

const KeyValueGrid: React.FC<{ data: AnyRecord }> = ({ data }) => {
  const entries = useMemo(
    () =>
      Object.entries(data)
        .filter(([, v]) => !isNil(v))
        .sort(([a], [b]) => a.localeCompare(b)),
    [data],
  );

  if (!entries.length) return <div className="text-sm text-muted">No information available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

  const identityInfo = (data?.identityInfo || {}) as AnyRecord;
  const personalInfo = (data?.personalInfo || {}) as AnyRecord;
  const contactInfo = (data?.contactInfo || {}) as AnyRecord;
  const employmentInfo = (data?.employmentInfo || {}) as AnyRecord;
  const payrollInfo = (data?.payrollInfo || {}) as AnyRecord;
  const bankInfo = (payrollInfo?.bankAccount || {}) as AnyRecord;
  const documents = (data?.documents || []) as any[];

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
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-6">
            <div className="text-sm font-bold text-danger">Failed to load</div>
            <div className="text-xs text-danger/80 mt-1">{error}</div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-card border border-theme rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 flex flex-col md:flex-row md:items-center gap-5">
                <div className="shrink-0">
                  {profilePictureUrl ? (
                    <img
                      src={String(profilePictureUrl)}
                      alt={employeeName}
                      className="w-20 h-20 rounded-2xl object-cover border border-theme bg-app"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-app border border-theme flex items-center justify-center text-sm font-extrabold text-muted">
                      {employeeName.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-lg font-extrabold text-main truncate">{employeeName}</div>
                      <div className="text-xs text-muted mt-0.5 truncate">{employeeCode ? `Employee ID: ${employeeCode}` : `ID: ${employeeId}`}</div>
                    </div>
                    <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold border ${headerStatus.toLowerCase() === "active"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-warning/10 text-warning border-warning/20"}`}>
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                <Card title="Identity">
                  <KeyValueGrid data={identityInfo} />
                </Card>

                <Card title="Personal">
                  <KeyValueGrid data={personalInfo} />
                </Card>

                <Card title="Contact">
                  <KeyValueGrid data={contactInfo} />
                </Card>
              </div>

              <div className="space-y-5">
                <Card title="Employment">
                  <KeyValueGrid data={employmentInfo} />
                </Card>

                <Card title="Payroll">
                  <KeyValueGrid data={payrollInfo} />
                </Card>

                <Card title="Bank">
                  <KeyValueGrid data={bankInfo} />
                </Card>
              </div>
            </div>

            <Card
              title="Documents"
              right={
                <button className="text-xs font-bold text-muted hover:text-main transition inline-flex items-center gap-1" type="button">
                  <X className="w-3.5 h-3.5" />
                  {Array.isArray(documents) ? documents.length : 0}
                </button>
              }
            >
              {Array.isArray(documents) && documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="rounded-xl border border-theme bg-app p-4">
                      <KeyValueGrid data={(doc || {}) as AnyRecord} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted">No documents</div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
