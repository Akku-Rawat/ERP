export const EMPLOYEE_ROLE_CONFIG = {
  reportingManager: {
    label: "Reporting Manager",
    match: ["manager", "lead"], // future-proof
    exclude: ["hr"],
  },
  hrManager: {
    label: "HR Manager",
    match: ["hr"],
  },
  techLead: {
    label: "Tech Lead",
    match: ["tech lead", "technical lead"],
  },
};
