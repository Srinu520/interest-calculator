import dayjs from "dayjs";
import type { PeriodBreakdown } from "../types";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const countFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export const getRecordName = (value: string): string => value.trim() || "Unnamed record";

export const formatCurrency = (value: number): string => currencyFormatter.format(value);

export const formatCount = (value: number): string => countFormatter.format(value);

export const formatDisplayDate = (value: string): string => dayjs(value).format("DD MMM YYYY");

export const formatPeriodCompact = ({ years, months, days }: PeriodBreakdown): string =>
  `${years}y ${months}m ${days}d`;
