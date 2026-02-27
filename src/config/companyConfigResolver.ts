import type { FieldConfig } from "../types/fieldConfig.types";
import { ZRA_ITEM_FIELDS } from "./../companies/companyConfig";
import { COMP_00004_ITEM_FIELDS } from "../companies/RolConfig";

// ─────────────────────────────────────────────────────────────────────────────
// Item field resolver
//
// Returns the correct field config array for the active company.
// All company codes are normalised to uppercase before matching so callers
// don't need to worry about casing.
// ─────────────────────────────────────────────────────────────────────────────

export function getItemFieldConfigs(companyCode: string): FieldConfig[] {
  switch (companyCode?.toUpperCase()) {
    case "ZRA":
      return ZRA_ITEM_FIELDS;

    case "ROLA":
    case "COMP-00004":
      return COMP_00004_ITEM_FIELDS;

    default:
      console.warn(`[getItemFieldConfigs] Unknown company code "${companyCode}" — falling back to ZRA`);
      return ZRA_ITEM_FIELDS;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Employee feature flags
// ─────────────────────────────────────────────────────────────────────────────

export interface EmployeeCompanyFeatures {
  companyCode: string;

  /** Show NAPSA identity-verification modal on employee creation. */
  requireIdentityVerification: boolean;

  /** Show statutory fields: NRC, SSN, NHIMA, TPIN. */
  showStatutoryFields: boolean;

  /** Show ceiling fields: CeilingYear, CeilingAmount. */
  showCeilingFields: boolean;

  /** Whether statutory fields are required (validated on submit). */
  statutoryFieldsRequired: boolean;

  /** Departments available in the department dropdown. */
  departments: string[];
}

const ZRA_FEATURES: EmployeeCompanyFeatures = {
  companyCode: "ZRA",
  requireIdentityVerification: true,
  showStatutoryFields: true,
  showCeilingFields: true,
  statutoryFieldsRequired: true,
  departments: [
    "Customs Services",
    "Domestic Taxes",
    "Corporate Services",
    "Strategy & Innovation",
    "ICT",
    "Human Resources",
    "Finance",
    "Legal Services",
    "Internal Audit",
    "Investigations",
    "Tax Appeals",
    "Large Taxpayers Office",
  ],
};

const ROLA_FEATURES: EmployeeCompanyFeatures = {
  companyCode: "COMP-00004",
  requireIdentityVerification: false,
  showStatutoryFields: false,
  showCeilingFields: false,
  statutoryFieldsRequired: false,
  departments: [
    "Sales",
    "Marketing",
    "Operations",
    "Finance",
    "Human Resources",
    "IT",
    "Customer Service",
    "Product Development",
    "Quality Assurance",
    "Logistics",
  ],
};

export function getEmployeeFeatures(companyCode: string): EmployeeCompanyFeatures {
  switch (companyCode?.toUpperCase()) {
    case "ZRA":
      return ZRA_FEATURES;

    case "ROLA":
    case "COMP-00004":
      return ROLA_FEATURES;

    default:
      console.warn(`[getEmployeeFeatures] Unknown company code "${companyCode}" — falling back to ZRA`);
      return ZRA_FEATURES;
  }
}