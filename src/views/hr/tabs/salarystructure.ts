// salaryStructureData.ts - SHARED DATA STORE
// Place this file in: src/data/salaryStructureData.ts

export type SalaryComponent = {
  id: string;
  name: string;
  category: "Earning" | "Deduction";
  valueType: "percentage" | "fixed" | "auto";
  value: number | string;
  taxable: boolean;
  statutory?: string;
};

export type SalaryStructure = {
  id: string;
  name: string;
  description: string;
  effectiveFrom: string;
  status: "Active" | "Draft";
  components: SalaryComponent[];
  usedBy: number;
  level: string;  
};

// In-memory storage (replace with API/database later)
let salaryStructures: SalaryStructure[] = [
  {
    id: "exec",
    name: "Executive Level",
    description: "For senior management and executives",
    effectiveFrom: "2025-01-01",
    status: "Active",
    level: "Senior",
    usedBy: 12,
    components: [
      { id: "c1", name: "Basic Salary", category: "Earning", valueType: "percentage", value: 60, taxable: true, statutory: "NAPSA Base" },
      { id: "c2", name: "House Allowance", category: "Earning", valueType: "percentage", value: 20, taxable: true },
      { id: "c3", name: "Transport", category: "Earning", valueType: "percentage", value: 15, taxable: true },
      { id: "c4", name: "Medical", category: "Earning", valueType: "fixed", value: 500, taxable: false },
      { id: "c5", name: "NAPSA (5%)", category: "Deduction", valueType: "auto", value: "5% of Basic", taxable: false, statutory: "NAPSA" },
      { id: "c6", name: "PAYE", category: "Deduction", valueType: "auto", value: "Tax Slab", taxable: false, statutory: "PAYE" },
    ]
  },
  {
    id: "mid",
    name: "Mid-Level Staff",
    description: "For middle management and senior staff",
    effectiveFrom: "2025-01-01",
    status: "Active",
    level: "Mid",
    usedBy: 45,
    components: [
      { id: "c1", name: "Basic Salary", category: "Earning", valueType: "percentage", value: 65, taxable: true, statutory: "NAPSA Base" },
      { id: "c2", name: "House Allowance", category: "Earning", valueType: "percentage", value: 18, taxable: true },
      { id: "c3", name: "Medical", category: "Earning", valueType: "fixed", value: 300, taxable: false },
      { id: "c4", name: "NAPSA (5%)", category: "Deduction", valueType: "auto", value: "5% of Basic", taxable: false, statutory: "NAPSA" },
      { id: "c5", name: "PAYE", category: "Deduction", valueType: "auto", value: "Tax Slab", taxable: false, statutory: "PAYE" },
    ]
  },
  {
    id: "entry",
    name: "Entry Level",
    description: "For junior staff and new hires",
    effectiveFrom: "2025-01-01",
    status: "Active",
    level: "Junior",
    usedBy: 78, 
    components: [
      { id: "c1", name: "Basic Salary", category: "Earning", valueType: "percentage", value: 70, taxable: true, statutory: "NAPSA Base" },
      { id: "c2", name: "House Allowance", category: "Earning", valueType: "percentage", value: 15, taxable: true },
      { id: "c3", name: "Transport", category: "Earning", valueType: "fixed", value: 200, taxable: true },
      { id: "c4", name: "NAPSA (5%)", category: "Deduction", valueType: "auto", value: "5% of Basic", taxable: false, statutory: "NAPSA" },
      { id: "c5", name: "PAYE", category: "Deduction", valueType: "auto", value: "Tax Slab", taxable: false, statutory: "PAYE" },
    ]
  }
];

// API Functions
export const getSalaryStructures = (): SalaryStructure[] => {
  return salaryStructures;
};

export const getActiveSalaryStructures = (): SalaryStructure[] => {
  return salaryStructures.filter(s => s.status === "Active");
};

export const getSalaryStructureById = (id: string): SalaryStructure | undefined => {
  return salaryStructures.find(s => s.id === id);
};

export const createSalaryStructure = (structure: SalaryStructure): void => {
  salaryStructures.push(structure);
};

export const updateSalaryStructure = (id: string, structure: SalaryStructure): void => {
  const index = salaryStructures.findIndex(s => s.id === id);
  if (index >= 0) {
    salaryStructures[index] = structure;
  }
};

export const deleteSalaryStructure = (id: string): void => {
  salaryStructures = salaryStructures.filter(s => s.id !== id);
};

// Calculate salary breakdown
export const calculateSalaryBreakdown = (
  structureId: string, 
  grossSalary: number
): { component: SalaryComponent; amount: number }[] => {
  const structure = getSalaryStructureById(structureId);
  if (!structure) return [];

  return structure.components.map(comp => {
    let amount = 0;
    if (comp.valueType === "percentage") {
      amount = (grossSalary * (comp.value as number)) / 100;
    } else if (comp.valueType === "fixed") {
      amount = comp.value as number;
    }
    return { component: comp, amount };
  });
};
export function getSalaryStructureByDesignation(designation: string): string | null {
  const map: Record<string, string> = {
    "Software Developer": "exec",
    "Senior Developer": "exec",
    "Intern": "entry",
    "Accountant": "mid",
  };

  return map[designation] ?? null;
}

export const getSalaryStructureByLevel = (level: string) => {
  return getActiveSalaryStructures()
    .find(s => s.level === level)?.id || null;
};
export const getLevelsFromHrSettings = () => {
  const active = getActiveSalaryStructures();
  return Array.from(new Set(active.map(s => s.level)));
};
