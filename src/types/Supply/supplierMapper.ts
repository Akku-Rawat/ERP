import { SupplierFormData, Supplier } from "../../types/Supply/supplier";

export const mapSupplierApi = (d: any): Supplier => ({
  supplierId: d.supplierId,
  supplierName: d.supplierName,
  supplierCode: d.supplierCode,
  tpin: d.tpin,
  currency: d.currency,
  phoneNo: d.mobile_no || d.phoneNo,
  alternateNo: d.alternateNo || "",
  emailId: d.emailId,
  contactPerson: d.contactPerson || "",
  billingAddressLine1: d.billingAddressLine1,
  billingAddressLine2: d.billingAddressLine2,
  district: d.district,
  province: d.province,
  billingCity: d.billingCity || d.city || "",
  billingCountry: d.billingCountry || d.country || "",
  billingPostalCode: d.billingPostalCode || d.postalCode || "",
  bankAccount: d.bankAccount || "",
  accountNumber: d.accountNumber,
  accountHolder: d.accountHolder,
  sortCode: d.sortCode,
  swiftCode: d.swiftCode,
  branchAddress: d.branchAddress,
  openingBalance: Number(d.openingBalance || 0),
  paymentTerms: d.paymentTerms || "",
  dateOfAddition: d.dateOfAddition,
  status: d.status?.toLowerCase(),
});



export const mapSupplierToApi = (
  f: SupplierFormData,
  supplierId?: string | number
) => ({
  ...(supplierId ? { supplierId } : {}), 

  supplierName: f.supplierName,
  supplierCode: f.supplierCode,
  tpin: f.tpin,
  currency: f.currency,
  contactPerson: f.contactPerson,
  phoneNo: f.phoneNo,
  alternateNo: f.alternateNo,
  emailId: f.emailId,
  bankAccount: f.bankAccount,
  billingAddressLine1: f.billingAddressLine1,
  billingAddressLine2: f.billingAddressLine2,
  district: f.district,
  province: f.province,
  city: f.billingCity,
  billingCity: f.billingCity,
  
 country: f.billingCountry,
  billingCountry: f.billingCountry,

postalCode: f.billingPostalCode,
billingPostalCode: f.billingPostalCode,

  accountNumber: f.accountNumber,
  accountHolder: f.accountHolder,
  sortCode: f.sortCode,
  swiftCode: f.swiftCode,
  branchAddress: f.branchAddress,
  openingBalance: Number(f.openingBalance || 0),
  paymentTerms: f.paymentTerms || "",
  dateOfAddition: f.dateOfAddition,
});
