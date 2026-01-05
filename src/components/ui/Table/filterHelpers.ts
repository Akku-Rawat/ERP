// filterHelpers.ts
import type { Column } from "../Table/type";

export type FilterState = {
  name?: string;
  type?: string;
  min?: string;
  max?: string;
};

export const detectNumericKey = (columns: Column<any>[]) => {
  const candidates = ["balance", "amount", "onboard", "total", "price", "value"];
  for (const col of columns) {
    const lk = col.key.toLowerCase();
    if (candidates.some((cand) => lk.includes(cand))) return col.key;
  }
  return null;
};

export const detectCustomerIdKey = (columns: Column<any>[]) => {
  const candidates = ["customerid", "customer_id", "customerid", "custid", "customerid", "id"];
  // prefer exact matches first
  for (const col of columns) {
    if (candidates.includes(col.key.toLowerCase())) return col.key;
  }
  // then heuristics
  for (const col of columns) {
    const lk = col.key.toLowerCase();
    if ((lk.includes("cust") || lk.includes("customer")) && lk.includes("id")) return col.key;
  }
  if (columns.some((c) => c.key.toLowerCase() === "id")) return "id";
  return null;
};
