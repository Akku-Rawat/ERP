export function filterEmployeesByRole(
  employees: any[],
  role: { match: string[]; exclude?: string[] },
) {
  return employees.filter((e) => {
    const title = (e.jobTitle || "").toLowerCase();

    const match = role.match.some((k) => title.includes(k));
    const exclude = role.exclude?.some((k) => title.includes(k));

    return match && !exclude;
  });
}
