import type { InvoiceItem, InvoiceTerms } from "../types/invoice";

export const EMPTY_ITEM: InvoiceItem = {
  itemCode: "",
  description: "",
  quantity: 0,
  price: 0,
  discount: 0,
  vatRate: "",
  vatCode: "",
};

export const EMPTY_TERMS: InvoiceTerms = {
  selling: {
    general: "",
    payment: {
      phases: [],
      dueDates: "",
      lateCharges: "",
      taxes: "",
      notes: "",
    },
    delivery: "",
    cancellation: "",
    warranty: "",
    liability: "",
  },
};
export const paymentMethodOptions = [
  { value: "01", label: "CASH" },
  { value: "02", label: "CREDIT" },
  { value: "03", label: "CASH / CREDIT" },
  { value: "04", label: "BANK CHECK" },
  { value: "05", label: "DEBIT & CREDIT CARD" },
  { value: "06", label: "MOBILE MONEY" },
  { value: "07", label: "OTHER" },
  { value: "08", label: "BANK TRANSFER" },
] as const;

export const getPaymentMethodLabel = (code?: string) =>
  paymentMethodOptions.find((p) => p.value === code)?.label ?? "UNKNOWN";


export const DEFAULT_INVOICE_FORM = {
  customerId: "",
  currencyCode: "ZMW",
  exchangeRt: "1",
  dateOfInvoice: "",
  dueDate: "",
  invoiceStatus: "Draft",
  invoiceType: "lpo",
  destnCountryCd: "",
  lpoNumber: "",

  billingAddress: {
    line1: "",
    line2: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
  },

  shippingAddress: {
    line1: "",
    line2: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
  },

  paymentInformation: {
    paymentTerms: "",
    paymentMethod: paymentMethodOptions[0].value,
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    swiftCode: "",
  },

  items: [{ ...EMPTY_ITEM }],
  terms: EMPTY_TERMS,
};

/* =========================
   INVOICE STATUS
========================= */

export const invoiceStatusOptions = [
  { value: "Draft", label: "Draft" },
  { value: "Sent", label: "Sent" },
  { value: "Paid", label: "Paid" },
  { value: "Overdue", label: "Overdue" },
] as const;

export const invoiceTypeOptions = [
  { value: "LPO", label: "LPO" },
  { value: "Export", label: "Export" },
  { value: "Non-Export", label: "Non Export" },
] as const;

export const currencyOptions = [
  { value: "ZMW", label: "ZMW (ZK)" },
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
] as const;

export const currencySymbols: Record<string, string> = {
  ZMW: "ZK",
  INR: "₹",
  USD: "$",
};


export const ITEMS_PER_PAGE = 5;
