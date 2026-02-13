export interface EmployeeCompanyFeatures {
  companyCode: string;
  
  // Identity & Verification
  requireIdentityVerification: boolean;  // Show NAPSA verification modal
  
  // Statutory Fields Visibility
  showStatutoryFields: boolean;          // NRC, SSN, NHIMA, TPIN
  showCeilingFields: boolean;            // CeilingYear, CeilingAmount
  
  // Field requirements
  statutoryFieldsRequired: boolean;      // Are statutory fields mandatory?

  departments: string[];
}

// ZRA Configuration
export const ZRA_FEATURES: EmployeeCompanyFeatures = {
  companyCode: 'ZRA',
  requireIdentityVerification: true,
  showStatutoryFields: true,
  showCeilingFields: true,
  statutoryFieldsRequired: true,
  departments: [
    'Customs Services',
    'Domestic Taxes',
    'Corporate Services',
    'Strategy & Innovation',
    'ICT',
    'Human Resources',
    'Finance',
    'Legal Services',
    'Internal Audit',
    'Investigations',
    'Tax Appeals',
    'Large Taxpayers Office',
  ],
};

// ROLA Configuration
export const ROLA_FEATURES: EmployeeCompanyFeatures = {
  companyCode: 'COMP-00004',  // or 'ROLA'
  requireIdentityVerification: false,
  showStatutoryFields: false,
  showCeilingFields: false,
  statutoryFieldsRequired: false,
  departments: [
    'Sales',
    'Marketing',
    'Operations',
    'Finance',
    'Human Resources',
    'IT',
    'Customer Service',
    'Product Development',
    'Quality Assurance',
    'Logistics',
  ],
};

// Resolver
export function getEmployeeFeatures(companyCode: string): EmployeeCompanyFeatures {
  switch (companyCode) {
    case 'ZRA':
      return ZRA_FEATURES;
    case 'COMP-00004':
    case 'rola':
    case 'ROLA':
      return ROLA_FEATURES;
    default:
      console.warn(`Unknown company: ${companyCode}, defaulting to ZRA`);
      return ZRA_FEATURES;
  }
}