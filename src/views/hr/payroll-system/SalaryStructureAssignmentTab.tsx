import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import HrDateInput from "../../../components/Hr/HrDateInput";
import { createSalaryStructureAssignment } from "../../../api/salaryStructureAssignmentApi";
import { getSalaryStructures, type SalaryStructureListItem } from "../../../api/salaryStructureApi";
import { getAllEmployees } from "../../../api/employeeapi";

type Props = {
  employeeId?: string;
  defaultCompany?: string;
  editableEmployee?: boolean;
  onAssigned?: () => void;
};

const inputCls =
  "w-full px-3 py-2.5 bg-app border border-theme rounded-lg text-sm text-main placeholder:text-muted focus:outline-none focus:border-primary transition";
const selectCls =
  "w-full px-3 py-2.5 bg-app border border-theme rounded-lg text-sm text-main focus:outline-none focus:border-primary transition cursor-pointer";

export default function SalaryStructureAssignmentTab({
  employeeId,
  defaultCompany,
  editableEmployee,
  onAssigned,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [salaryStructuresLoading, setSalaryStructuresLoading] = useState(false);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructureListItem[]>([]);

  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  const [form, setForm] = useState({
    employee: employeeId || "",
    salary_structure: "",
    from_date: new Date().toISOString().slice(0, 10),
    company: defaultCompany || "",
  });

  useEffect(() => {
    if (!employeeId) return;
    setForm((p) => ({ ...p, employee: employeeId }));
  }, [employeeId]);

  useEffect(() => {
    if (!defaultCompany) return;
    setForm((p) => ({ ...p, company: p.company || defaultCompany }));
  }, [defaultCompany]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setSalaryStructuresLoading(true);
      try {
        const data = await getSalaryStructures();
        if (!mounted) return;
        setSalaryStructures(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setSalaryStructures([]);
      } finally {
        if (!mounted) return;
        setSalaryStructuresLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!editableEmployee) return;

    let mounted = true;

    const run = async () => {
      setEmployeesLoading(true);
      try {
        const resp = await getAllEmployees({ page: 1, page_size: 500 });
        if (!mounted) return;
        const list = Array.isArray(resp?.employees) ? resp.employees : [];
        setEmployees(list);
      } catch {
        if (!mounted) return;
        setEmployees([]);
      } finally {
        if (!mounted) return;
        setEmployeesLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [editableEmployee]);

  const structureOptions = useMemo(() => {
    const items = Array.isArray(salaryStructures) ? salaryStructures : [];
    return items
      .map((s) => ({
        value: String(s.name || s.id),
        label: String(s.name || s.id),
        company: String(s.company || ""),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [salaryStructures]);

  const employeeOptions = useMemo(() => {
    const items = Array.isArray(employees) ? employees : [];
    return items
      .map((e: any) => {
        const code = String(e?.employeeId ?? e?.employee_id ?? e?.id ?? "").trim();
        const fullName = String(e?.name ?? e?.employeeName ?? "").trim();
        return {
          value: code,
          label: fullName ? `${code} — ${fullName}` : code,
        };
      })
      .filter((o) => o.value)
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [employees]);

  const canSubmit = useMemo(() => {
    return Boolean(
      form.employee?.trim() &&
        form.salary_structure?.trim() &&
        form.from_date?.trim() &&
        form.company?.trim(),
    );
  }, [form]);

  const handleAssign = async () => {
    if (!canSubmit) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await createSalaryStructureAssignment({
        employee: form.employee.trim(),
        salary_structure: form.salary_structure.trim(),
        from_date: form.from_date,
        company: form.company.trim(),
      });
      toast.success("Salary structure assigned");
      onAssigned?.();
    } catch (e: any) {
      toast.error(e?.message || "Failed to assign salary structure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="text-sm font-extrabold text-main">Salary Structure Assignment</div>
        <div className="text-xs text-muted mt-1">
          Assign a salary structure to this employee effective from a start date
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] font-extrabold text-muted mb-1.5 uppercase tracking-wider">
            Employee
            <span className="text-danger ml-0.5">*</span>
          </label>
          {editableEmployee ? (
            <select
              value={form.employee}
              onChange={(e) => setForm((p) => ({ ...p, employee: e.target.value }))}
              className={selectCls}
              disabled={employeesLoading}
            >
              <option value="">{employeesLoading ? "Loading..." : "Select employee"}</option>
              {employeeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input value={form.employee} readOnly className={`${inputCls} opacity-80`} />
          )}
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-muted mb-1.5 uppercase tracking-wider">
            Company
            <span className="text-danger ml-0.5">*</span>
          </label>
          <input
            value={form.company}
            onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            placeholder="e.g. Izyane"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-muted mb-1.5 uppercase tracking-wider">
            Salary Structure
            <span className="text-danger ml-0.5">*</span>
          </label>
          <select
            value={form.salary_structure}
            onChange={(e) => setForm((p) => ({ ...p, salary_structure: e.target.value }))}
            className={selectCls}
            disabled={salaryStructuresLoading}
          >
            <option value="">{salaryStructuresLoading ? "Loading..." : "Select salary structure"}</option>
            {structureOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.company ? `${o.label} (${o.company})` : o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-muted mb-1.5 uppercase tracking-wider">
            From Date
            <span className="text-danger ml-0.5">*</span>
          </label>
          <HrDateInput
            value={form.from_date}
            onChange={(v: string) => setForm((p) => ({ ...p, from_date: v }))}
            placeholder="DD/MM/YYYY"
            inputClassName={inputCls}
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleAssign}
          disabled={!canSubmit || loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-extrabold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Assign
        </button>
      </div>
    </div>
  );
}
