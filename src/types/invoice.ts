import type { TermSection } from "./termsAndCondition";
export interface InvoiceSummary {
  invoiceNumber:     string;
  customerName:      string;
  receiptNumber:     string;
  currency:          string;
  exchangeRate:      string;
  dueDate:           null;
  dateOfInvoice:     Date;
  Total:             number;
  totalTax:          string;
  invoiceStatus:     string;
  invoiceTypeParent: string;
  invoiceType:       string;
}
export interface Invoice {
  invoiceNumber:string,
  customerId: string;
  currencyCode: string;
  exchangeRt: string;
  dateOfInvoice: Date;
  dueDate: Date;
  invoiceStatus: string;
  invoiceType: string;
  billingAddress: Address;
  shippingAddress: Address;
  paymentInformation: PaymentInformation;
  items: InvoiceItem[];
  terms: InvoiceTerms;
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


