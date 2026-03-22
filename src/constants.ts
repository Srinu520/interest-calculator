import type { SortDirection, SortField, SortOption } from "./types";

export const STANDARD_INTEREST_RATE = 18;
export const COMPOUNDING_PERIOD_YEARS = 3;

export const TEAL = "#0e6e6c";
export const AMBER = "#c97228";
export const CLAY = "#8b5a3a";
export const SLATE = "#2f4d49";
export const ALERT_ORANGE = "#d77d28";
export const ALERT_RED = "#c44a34";

export const TRANSACTIONS_STORAGE_KEY = "interest-calculator.transactions";
export const CUSTOM_RATE_STORAGE_KEY = "interest-calculator.custom-rate";

export const SORT_FIELD_OPTIONS: Array<SortOption<SortField>> = [
  { value: "date", label: "Date" },
  { value: "name", label: "Record Name" },
  { value: "amount", label: "Principal" },
  { value: "period", label: "Period" },
  { value: "interest", label: `${STANDARD_INTEREST_RATE}% Interest` },
];

export const SORT_DIRECTION_OPTIONS: Array<SortOption<SortDirection>> = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];
