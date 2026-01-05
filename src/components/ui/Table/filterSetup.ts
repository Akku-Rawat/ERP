
export type FilterType =
  | "text"
  | "number"
  | "select"
  | "date"
  | "status";

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: string[];
}

// -------------------------
// CRM Filters
// -------------------------
export const crmFilters: FilterConfig[] = [
  { key: "name", label: "Customer Name", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "status", label: "Status", type: "status", options: ["Active", "Inactive"] },
  { key: "createdAt", label: "Created Date", type: "date" },
];

// -------------------------
// INVOICE Filters
// -------------------------
export const invoiceFilters: FilterConfig[] = [
  { key: "invoiceNumber", label: "Invoice No.", type: "text" },
  { key: "customerName", label: "Customer", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["Paid", "Unpaid", "Overdue"] },
  { key: "minAmount", label: "Min Amount", type: "number" },
  { key: "maxAmount", label: "Max Amount", type: "number" },
  { key: "date", label: "Invoice Date", type: "date" },
];

// -------------------------
// QUOTATION Filters
// -------------------------
export const quotationFilters: FilterConfig[] = [
  { key: "quotationNumber", label: "Quotation No.", type: "text" },
  { key: "customerName", label: "Customer", type: "text" },
  { key: "validTill", label: "Valid Till", type: "date" },
  { key: "status", label: "Status", type: "select", options: ["Approved", "Pending", "Rejected"] },
  { key: "preparedBy", label: "Prepared By", type: "text" },
];

// -------------------------
// Helper
// -------------------------
export const getFilters = (module: "crm" | "invoice" | "quotation") => {
  switch (module) {
    case "crm":
      return crmFilters;
    case "invoice":
      return invoiceFilters;
    case "quotation":
      return quotationFilters;
    default:
      return [];
  }
};
