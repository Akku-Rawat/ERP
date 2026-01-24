export interface SupplierFormData {
  tpin: string;
  supplierName: string;
  supplierCode: string;
  paymentTerms: string;
  currency: string;
  bankAccount: string;
  contactPerson: string;
  phoneNo: string;
  alternateNo: string;
  emailId: string;
  dateOfAddition: string;
  openingBalance: string;
  accountNumber: string;
  accountHolder: string;
  sortCode: string;
  swiftCode: string;
  branchAddress: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  district: string;
  province: string;
  billingCountry: string;
  billingPostalCode: string;
}

export const emptySupplierForm: SupplierFormData = {
  tpin: "",
  supplierName: "",
  supplierCode: "",
  paymentTerms: "",
  currency: "",
  bankAccount: "",
  contactPerson: "",
  phoneNo: "",
  alternateNo: "",
  emailId: "",
  dateOfAddition: "",
  openingBalance: "",
  accountNumber: "",
  accountHolder: "",
  sortCode: "",
  swiftCode: "",
  branchAddress: "",
  billingAddressLine1: "",
  billingAddressLine2: "",
  billingCity: "",
  district: "",
  province: "",
  billingCountry: "",
  billingPostalCode: "",
};

export const currencyOptions = ["ZMW", "USD", "INR"];

export type SupplierTab = "supplier" | "payment";