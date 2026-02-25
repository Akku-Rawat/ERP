export type Money = number;

export type PayeBand = {
  lowerInclusive: Money;
  upperInclusive: Money | null;
  rate: number;
};

export const ZM_PAYE_BANDS_MONTHLY: PayeBand[] = [
  { lowerInclusive: 0, upperInclusive: 5100, rate: 0 },
  { lowerInclusive: 5100.01, upperInclusive: 7100, rate: 20 },
  { lowerInclusive: 7100.01, upperInclusive: 9200, rate: 30 },
  { lowerInclusive: 9200.01, upperInclusive: null, rate: 37 },
];

export type StatutoryRates = {
  napsaEmployeeRate: number;
  napsaEmployerRate: number;
  nhimaRate: number;
};

export const DEFAULT_ZM_RATES: StatutoryRates = {
  napsaEmployeeRate: 5,
  napsaEmployerRate: 5,
  nhimaRate: 2,
};

export const DEFAULT_NAPSA_CEILING = 29816.67;

const clampMoney = (n: any) => {
  const v = Number(n ?? 0);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, v);
};

export const calculateNapsa = (
  grossSalary: Money,
  ratePercent: number = DEFAULT_ZM_RATES.napsaEmployeeRate,
  ceiling: Money = DEFAULT_NAPSA_CEILING,
): Money => {
  const gross = clampMoney(grossSalary);
  const capped = Math.min(gross, clampMoney(ceiling));
  return (capped * Number(ratePercent ?? 0)) / 100;
};

export const calculateNhima = (
  grossSalary: Money,
  ratePercent: number = DEFAULT_ZM_RATES.nhimaRate,
): Money => {
  const gross = clampMoney(grossSalary);
  return (gross * Number(ratePercent ?? 0)) / 100;
};

export const calculatePaye = (
  taxableIncome: Money,
  bands: PayeBand[] = ZM_PAYE_BANDS_MONTHLY,
): Money => {
  const income = clampMoney(taxableIncome);
  if (income <= 0) return 0;

  let tax = 0;

  for (const band of bands) {
    const lower = clampMoney(band.lowerInclusive);
    const upper = band.upperInclusive === null ? null : clampMoney(band.upperInclusive);
    const rate = Number(band.rate ?? 0) / 100;

    if (income < lower) continue;

    const bandUpper = upper === null ? income : Math.min(income, upper);
    const amountInBand = Math.max(0, bandUpper - lower);
    if (amountInBand <= 0) continue;
    tax += amountInBand * rate;
  }

  return Math.max(0, tax);
};

export type ZmPayrollResult = {
  grossSalary: Money;
  taxableIncome: Money;
  rates: StatutoryRates;
  napsaCeiling: Money;
  statutory: {
    napsaEmployee: Money;
    napsaEmployer: Money;
    nhima: Money;
    paye: Money;
  };
  deductionsEmployeeSide: {
    totalContributions: Money;
    totalTax: Money;
    totalDeductions: Money;
  };
  netPay: Money;
};

export const calculateZmPayrollFromGross = (
  grossSalary: Money,
  opts?: {
    rates?: Partial<StatutoryRates>;
    napsaCeiling?: Money;
    payeBands?: PayeBand[];
    taxableIncome?: Money;
  },
): ZmPayrollResult => {
  const gross = clampMoney(grossSalary);
  const rates: StatutoryRates = { ...DEFAULT_ZM_RATES, ...(opts?.rates ?? {}) };
  const napsaCeiling = clampMoney(opts?.napsaCeiling ?? DEFAULT_NAPSA_CEILING);

  const napsaEmployee = calculateNapsa(gross, rates.napsaEmployeeRate, napsaCeiling);
  const napsaEmployer = calculateNapsa(gross, rates.napsaEmployerRate, napsaCeiling);
  const nhima = calculateNhima(gross, rates.nhimaRate);

  const taxableIncome = clampMoney(opts?.taxableIncome ?? (gross - napsaEmployee));
  const paye = calculatePaye(taxableIncome, opts?.payeBands ?? ZM_PAYE_BANDS_MONTHLY);

  const totalContributions = napsaEmployee + nhima;
  const totalTax = paye;
  const totalDeductions = totalContributions + totalTax;
  const netPay = gross - totalDeductions;

  return {
    grossSalary: gross,
    taxableIncome,
    rates,
    napsaCeiling,
    statutory: {
      napsaEmployee,
      napsaEmployer,
      nhima,
      paye,
    },
    deductionsEmployeeSide: {
      totalContributions,
      totalTax,
      totalDeductions,
    },
    netPay,
  };
};