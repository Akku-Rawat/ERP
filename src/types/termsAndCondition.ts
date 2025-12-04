export interface TermPhase {
  name: string;
  percentage: string;
  condition: string;
}

export interface PaymentTerms {
  phases: TermPhase[];
  dueDates?: string;
  lateCharges?: string;
  tax?: string;
  notes?: string;
}

export interface TermSection {
  general?: string;
  payment?: PaymentTerms;
  delivery?: string;
  cancellation?: string;
  warranty?: string;
  liability?: string;
}
export interface Terms {
  terms: {
    buying?: TermSection;
    selling: TermSection;
  };
}
