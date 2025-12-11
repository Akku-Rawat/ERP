// sortUtils.ts
export const extractIdNumber = (val: any): number => {
  if (val === null || val === undefined) return NaN;
  const s = String(val);
  const m = s.match(/(\d+)(?!.*\d)/); // last number
  if (m) return Number(m[1]);
  const digits = s.replace(/\D/g, "");
  return digits ? Number(digits) : NaN;
};

export const compareIdSmart = (a: any, b: any, order: "asc" | "desc") => {
  const na = extractIdNumber(a);
  const nb = extractIdNumber(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) {
    return order === "asc" ? na - nb : nb - na;
  }
  const sa = a === undefined || a === null ? "" : String(a);
  const sb = b === undefined || b === null ? "" : String(b);
  return order === "asc"
    ? sa.localeCompare(sb, undefined, { numeric: true })
    : sb.localeCompare(sa, undefined, { numeric: true });
};
