import type { TermSection } from "./termsAndCondition";
type InvoiceStatus = "Draft" | "Rejected" | "Paid" | "Cancelled" | "Approved";


export interface ProformaInvoice {
  proformaId?: string;
  customerId: string;
  currencyCode: string;
  exchangeRt: string;
  dateOfInvoice: string;
  dueDate: string;
  invoiceStatus: InvoiceStatus;
  invoiceType: string;
  destnCountryCd?: string;
  lpoNumber?: string;

  billingAddress: Address;
  shippingAddress: Address;
  paymentInformation: PaymentInformation;

  items: InvoiceItem[];
  terms: InvoiceTerms;
}

export interface ProformaInvoiceSummary {
  proformaId: string;
  customerName: string;
  currency: string;
  exchangeRate: string;
  dueDate: string | null;
  totalAmount: number;
  invoiceStatus: InvoiceStatus;
  createdAt: string;
}

export interface Address {
  line1: string;
  line2: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

export interface InvoiceItem {
  itemCode: string;
  quantity: number;
  description: string;
  discount: number;
  vatRate: string;
  price: number;
  vatCode: string;
}

export interface PaymentInformation {
  paymentTerms: string;
  paymentMethod: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
}

export interface InvoiceTerms {
  selling: TermSection;
}
