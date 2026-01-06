export interface EmployeeSummary {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  workLocation: string;
  status: string;
}
export interface Employee {
  id: string;
  status: string;
  identityInfo: IdentityInfo;
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  employmentInfo: EmploymentInfo;
  payrollInfo: PayrollInfo;
  documents: any[];
}

export interface ContactInfo {
  Email: string;
  workEmail: string;
  phoneNumber: string;
  alternatePhone: string;
  address: Address;
  emergencyContact: EmergencyContact;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface EmploymentInfo {
  employeeId: string;
  Department: string;
  JobTitle: string;
  reportingManager: string;
  EmployeeType: string;
  joiningDate: Date;
  probationPeriod: string;
  contractEndDate: Date;
  workLocation: string;
  workAddress: string;
  shift: string;
  weeklySchedule: WeeklySchedule;
}

export interface WeeklySchedule {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface IdentityInfo {
  NrcId: string;
  SocialSecurityNapsa: string;
  NhimaHealthInsurance: string;
  TpinId: string;
  verifiedFromSource: string;
}

export interface PayrollInfo {
  grossSalary: string;
  currency: string;
  paymentFrequency: string;
  paymentMethod: string;
  salaryBreakdown: SalaryBreakdown;
  statutoryDeductions: StatutoryDeductions;
  bankAccount: BankAccount;
}

export interface BankAccount {
  AccountNumber: string;
  AccountName: string;
  BankName: string;
  branchCode: string;
  AccountType: string;
}

export interface SalaryBreakdown {
  BasicSalary: string;
  HousingAllowance: string;
  TransportAllowance: string;
  MealAllowance: string;
  otherAllowances: string;
}

export interface StatutoryDeductions {
  napsaEmployeeRate: number;
  napsaEmployerRate: number;
  nhimaRate: number;
  payeAmount: number;
}

export interface PersonalInfo {
  FirstName: string;
  OtherNames: string;
  LastName: string;
  Dob: Date;
  Gender: string;
  Nationality: string;
  maritalStatus: string;
}
