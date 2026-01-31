export interface ItemRow {
  itemCode: string;
  itemName?: string;
  requiredBy: string;
  quantity: number;
  uom: string;
  rate: number;
  vatCd?: string;
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

export type AddressBlock = {
  addressTitle: string;
  addressType: "Billing" | "Shipping";
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
};

export interface PurchaseOrderFormData {
  poNumber: string;
  date: string;
  supplier: string;
  supplierId: string;
  supplierCode: string;
  taxCategory: string;
  exportToCountry: string; // New field for Export country
  shippingRule: string;
  incoterm: string;
  taxesChargesTemplate: string;
  requiredBy: string;
  currency: string;
  status: string;
  costCenter: string;
  project: string;

  addresses: {
    supplierAddress: AddressBlock;
    dispatchAddress: AddressBlock;
    shippingAddress: AddressBlock;
    companyBillingAddress: AddressBlock;
  };

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
  templateName: string;
  templateType: string;
  subject: string;
  messageHtml: string;
  sendAttachedFiles: boolean;
  sendPrint: boolean;
}

export const emptyItem: ItemRow = {
  itemCode: "",
  itemName: "",
  requiredBy: "",
  quantity: 0,
  uom: "Unit",
  rate: 0,
  vatCd: "", // Empty, will be set based on tax category and item
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

export const emptyAddress: AddressBlock = {
  addressTitle: "",
  addressType: "Billing",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  phone: "",
  email: "",
};

export const emptyPOForm: PurchaseOrderFormData = {
  poNumber: "",
  date: "",
  supplier: "",
  requiredBy: "",
  currency: "INR",
  status: "Draft",
  taxCategory: "",
  exportToCountry: "", // Initialize new field
  shippingRule: "",
  incoterm: "",
  taxesChargesTemplate: "",
  costCenter: "",
  project: "",

  addresses: {
    supplierAddress: {
      ...emptyAddress,
      addressTitle: "Supplier Main Address",
      addressType: "Billing",
    },
    dispatchAddress: {
      ...emptyAddress,
      addressTitle: "Warehouse Dispatch",
      addressType: "Shipping",
    },
    shippingAddress: {
      ...emptyAddress,
      addressTitle: "Customer Delivery Address",
      addressType: "Shipping",
    },
    companyBillingAddress: {
      ...emptyAddress,
      addressTitle: "Company HQ Billing",
      addressType: "Billing",
    },
  },

  placeOfSupply: "",
  supplierId: "",
  supplierCode: "",

  paymentTermsTemplate: "",
  termsAndConditions: "",
  totalQuantity: 0,
  grandTotal: 0,
  roundingAdjustment: 0,
  roundedTotal: 0,

  items: [{ ...emptyItem }],
  taxRows: [], // Start with empty array, user can add as needed
  paymentRows: [], // Start with empty array, user can add as needed

  templateName: "",
  templateType: "",
  subject: "",
  messageHtml: "",
  sendAttachedFiles: false,
  sendPrint: false,
};

export type POTab = "details" | "email" | "tax" | "address" | "terms";