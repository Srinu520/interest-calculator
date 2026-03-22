export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
}

export interface PeriodBreakdown {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export interface InterestResult {
  interest: number;
  total: number;
}

export interface CompoundingStatus {
  accent: string;
  badgeLabel: string;
  note: string;
}

export interface TransactionDetails {
  transaction: Transaction;
  period: PeriodBreakdown;
  compoundingStatus: CompoundingStatus;
  standardResult: InterestResult;
  customResult: InterestResult | null;
}

export interface SummaryMetricData {
  accent: string;
  label: string;
  note?: string;
  value: string;
}

export interface TotalsSummary {
  principal: number;
  standardInterest: number;
  standardTotal: number;
  customInterest: number;
  customTotal: number;
}

export type SortField = "date" | "name" | "amount" | "period" | "interest";
export type SortDirection = "asc" | "desc";

export interface SortOption<T extends string> {
  value: T;
  label: string;
}
