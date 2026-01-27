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
  billingCity: d.city,
  district: d.district,
  province: d.province,
  billingCountry: d.country,
  billingPostalCode: d.postalCode,

  bankAccount: d.bankAccount || "",
  accountNumber: d.accountNumber,
  accountHolder: d.accountHolder,
  sortCode: d.sortCode,
  swiftCode: d.swiftCode,
  branchAddress: d.branchAddress,

  openingBalance: Number(d.openingBalance || 0),
  paymentTerms: Number(d.paymentTerms || 0),
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

  billingAddressLine1: f.billingAddressLine1,
  billingAddressLine2: f.billingAddressLine2,
  city: f.billingCity,
  district: f.district,
  province: f.province,
  country: f.billingCountry,
  postalCode: f.billingPostalCode,

  accountNumber: f.accountNumber,
  accountHolder: f.accountHolder,
  sortCode: f.sortCode,
  swiftCode: f.swiftCode,
  branchAddress: f.branchAddress,

  openingBalance: f.openingBalance,
  paymentTerms: f.paymentTerms,
  dateOfAddition: f.dateOfAddition,
});
