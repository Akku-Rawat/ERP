export interface SupplierRow {
  supplier: string;
  contact: string;
  email: string;
  sendEmail: boolean;
}

export interface ItemRow {
  itemCode: string;
  requiredDate: string;
  quantity: number;
  uom: string;
  warehouse: string;
}

export interface PaymentRow {
  paymentTerm: string;
  description: string;
  dueDate: string;
  invoicePortion: number;
  paymentAmount: number;
}

export interface RfqFormData {
  rfqNumber: string;
  requestDate: string;
  quoteDeadline: string;
  status: string;
  suppliers: SupplierRow[];
  items: ItemRow[];
  paymentRows: PaymentRow[];
  termsAndConditions: string;
  templateName: string;
  templateType: string;
  subject: string;
  messageHtml: string;
  sendAttachedFiles: boolean;
  sendPrint: boolean;
}

export const emptySupplier: SupplierRow = {
  supplier: "",
  contact: "",
  email: "",
  sendEmail: true,
};

export const emptyItem: ItemRow = {
  itemCode: "",
  requiredDate: new Date().toISOString().split("T")[0],
  quantity: 0,
  uom: "",
  warehouse: "",
};

export const emptyPaymentRow: PaymentRow = {
  paymentTerm: "",
  description: "",
  dueDate: "",
  invoicePortion: 0,
  paymentAmount: 0,
};

export const emptyRfqForm: RfqFormData = {
  rfqNumber: "PUR-RFQ-",
  requestDate: new Date().toISOString().split("T")[0],
  quoteDeadline: "",
  status: "Draft",
  suppliers: [{ ...emptySupplier }],
  items: [{ ...emptyItem }],
  paymentRows: [{ ...emptyPaymentRow }],
  termsAndConditions: "",
  templateName: "",
  templateType: "Quote Email",
  subject: "",
  messageHtml: "",
  sendAttachedFiles: true,
  sendPrint: false,
};

export type RfqTab = "details" | "emailTemplates" | "terms";
