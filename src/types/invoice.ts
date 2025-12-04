export interface InvoiceItem {
  itemCode: string;
  itemName: string;
  description?: string;
  qty: number;
  price: number;
  discount: number;
  amount: number;
}

export interface InvoiceSummary {
  invoiceNumber: string;
  customerName: string;
  date: string;
  currency: string;
  total: number;
  totalTax: number;
  status?: string;
  invoiceType?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate:string;
  invoiceDueDate:string;
  poNumber:string;
  customerName: string;
  postingDate: string;
  currency: string;

  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingPostalCode?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;

  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingPostalCode?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;

  paymentTerms?: string;
  paymentMethod?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  swift?: string;

  total: number;
  totalTax: number;
  totalDiscount: number;
  adjustment?: number;

  items: InvoiceItem[];

  termsAndConditions?: string;
  notes?: string;
}
