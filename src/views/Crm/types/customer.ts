export interface CustomerSummary {
  id: string;
  tpin: string;
  name: string;
  contactPerson: string;
  displayName: string;
  mobile: string;
  type: "Company" | "Individual";
  email: string;
  accountNumber: string;
  currency: string;
  onboardingBalance: number;
  status: "Active" | "Inactie";
}

export interface CustomerTermsPhase {
  name: string;
  percentage: string;
  condition: string;
}

export interface CustomerTermsPayment {
  phases: CustomerTermsPhase[];
  dueDates: string;
  lateCharges: string;
  tax: string;
  notes: string;
}

export interface CustomerTermsSelling {
  general: string;
  payment: CustomerTermsPayment;
  delivery: string;
  cancellation: string;
  warranty: string;
  liability: string;
}

export interface CustomerTerms {
  selling: CustomerTermsSelling;
}

export interface CustomerDetail extends CustomerSummary {
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

  terms?: CustomerTerms;
}
