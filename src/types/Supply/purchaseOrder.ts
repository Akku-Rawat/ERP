export interface ItemRow {
  itemCode: string;
  requiredBy: string;
  quantity: number;
  uom: string;
  rate: number;
}

export interface TaxRow {
  type: string;
  accountHead: string;
  taxRate: number;
  amount: number;
}

export interface PaymentRow {
  paymentTerm: string;
  description: string;
  dueDate: string;
  invoicePortion: number;
  paymentAmount: number;
}

export interface PurchaseOrderFormData {
  poNumber: string;
  date: string;
  supplier: string;
  taxCategory: string;
  shippingRule: string;
  incoterm: string;
  taxesChargesTemplate: string;
  requiredBy: string;
  currency: string;
  status: string;
  costCenter: string;
  project: string;
  supplierAddress: string;
  supplierContact: string;
  dispatchAddress: string;
  shippingAddress: string;
  companyBillingAddress: string;
  placeOfSupply: string;
  paymentTermsTemplate: string;
  termsAndConditions: string;
  totalQuantity: number;
  grandTotal: number;
  roundingAdjustment: number;
  roundedTotal: number;
  items: ItemRow[];
  taxRows: TaxRow[];
  paymentRows: PaymentRow[];
  
  // Email template
  templateName: string;
  templateType: string;
  subject: string;
  messageHtml: string;
  sendAttachedFiles: boolean;
  sendPrint: boolean;
}

export const emptyItem: ItemRow = {
  itemCode: "",
  requiredBy: "",
  quantity: 0,
  uom: "Unit",
  rate: 0,
};

export const emptyTaxRow: TaxRow = {
  type: "",
  accountHead: "",
  taxRate: 0,
  amount: 0,
};

export const emptyPaymentRow: PaymentRow = {
  paymentTerm: "",
  description: "",
  dueDate: "",
  invoicePortion: 0,
  paymentAmount: 0,
};

export const emptyPOForm: PurchaseOrderFormData = {
  poNumber: "",
  date: "",
  supplier: "",
  requiredBy: "",
  currency: "INR",
  status: "Draft",
  taxCategory: "",
  shippingRule: "",
  incoterm: "",
  taxesChargesTemplate: "",
  costCenter: "",
  project: "",
  supplierAddress: "",
  supplierContact: "",
  dispatchAddress: "",
  shippingAddress: "",
  companyBillingAddress: "",
  placeOfSupply: "",
  paymentTermsTemplate: "",
  termsAndConditions: "",
  totalQuantity: 0,
  grandTotal: 0,
  roundingAdjustment: 0,
  roundedTotal: 0,
  items: [{ ...emptyItem }],
  taxRows: [{ ...emptyTaxRow }],
  paymentRows: [{ ...emptyPaymentRow }],
  templateName: "",
  templateType: "",
  subject: "",
  messageHtml: "",
  sendAttachedFiles: false,
  sendPrint: false,
};

export type POTab = "details" | "email" | "tax" | "address" | "terms";