import { ZRA_TAX_CONFIGS, ZRA_TAX_AUTO_POPULATE } from "./zraTaxConfig";
import { INDIA_TAX_CONFIGS, INDIA_TAX_AUTO_POPULATE } from "./indiaTaxConfig";

const VITE_COMPANY_ID = import.meta.env.VITE_COMPANY_ID;

export interface TaxConfig {
  taxType: string;
  taxPerct: string;
  taxCode: string;
  taxDescription: string;
}

export type TaxConfigMap = Record<string, TaxConfig>;

export const getTaxConfigs = (companyCode: string): TaxConfigMap => {
  if (companyCode === VITE_COMPANY_ID) {
    return INDIA_TAX_CONFIGS as TaxConfigMap;
  }
  return ZRA_TAX_CONFIGS as TaxConfigMap;
};

export const isTaxAutoPopulated = (companyCode: string): boolean => {
  if (companyCode === VITE_COMPANY_ID) {
    return INDIA_TAX_AUTO_POPULATE;
  }
  return ZRA_TAX_AUTO_POPULATE;
};