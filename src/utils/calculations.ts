import dayjs, { type Dayjs } from "dayjs";
import {
  AMBER,
  ALERT_ORANGE,
  ALERT_RED,
  CLAY,
  COMPOUNDING_PERIOD_YEARS,
  SLATE,
  STANDARD_INTEREST_RATE,
  TEAL,
} from "../constants";
import type {
  CompoundingStatus,
  PeriodBreakdown,
  SummaryMetricData,
  TotalsSummary,
  Transaction,
  TransactionDetails,
} from "../types";
import { formatCurrency, formatPeriodCompact } from "./formatters";

const createEmptyPeriod = (): PeriodBreakdown => ({
  years: 0,
  months: 0,
  days: 0,
  totalDays: 0,
});

const calculateInterest = (amount: number, daysElapsed: number, rate: number): number =>
  (amount * (rate / 100) * daysElapsed) / 365;

const buildPeriodBreakdown = (start: Dayjs, end: Dayjs): PeriodBreakdown => {
  if (start.isAfter(end)) {
    return createEmptyPeriod();
  }

  let cursor = start;
  let years = 0;
  let months = 0;

  while (!cursor.add(1, "year").isAfter(end)) {
    cursor = cursor.add(1, "year");
    years += 1;
  }

  while (!cursor.add(1, "month").isAfter(end)) {
    cursor = cursor.add(1, "month");
    months += 1;
  }

  const days = end.diff(cursor, "day");

  return {
    years,
    months,
    days,
    totalDays: end.diff(start, "day"),
  };
};

const calculateElapsedPeriod = (
  transactionDate: string,
  calculationDate: Dayjs,
): PeriodBreakdown =>
  buildPeriodBreakdown(dayjs(transactionDate).startOf("day"), calculationDate);

const isWithinMonths = (period: PeriodBreakdown, monthsThreshold: number): boolean =>
  period.years === 0 &&
  (period.months < monthsThreshold ||
    (period.months === monthsThreshold && period.days === 0));

const formatCycleCount = (compoundCycles: number): string =>
  `${compoundCycles} cycle${compoundCycles === 1 ? "" : "s"}`;

const calculateNextCompoundPeriod = (
  transactionDate: string,
  compoundCycles: number,
  calculationDate: Dayjs,
): PeriodBreakdown => {
  const nextCompoundDate = dayjs(transactionDate)
    .startOf("day")
    .add((compoundCycles + 1) * COMPOUNDING_PERIOD_YEARS, "year");

  return buildPeriodBreakdown(calculationDate, nextCompoundDate);
};

const buildCompoundingStatus = (
  compoundCycles: number,
  nextCompoundPeriod: PeriodBreakdown,
): CompoundingStatus => {
  const dueNote = `Next in ${formatPeriodCompact(nextCompoundPeriod)}`;

  if (isWithinMonths(nextCompoundPeriod, 3)) {
    return {
      accent: ALERT_RED,
      badgeLabel: "Next < 3m",
      note:
        compoundCycles > 0
          ? `${formatCycleCount(compoundCycles)} applied, ${dueNote.toLowerCase()}`
          : dueNote,
    };
  }

  if (isWithinMonths(nextCompoundPeriod, 6)) {
    return {
      accent: ALERT_ORANGE,
      badgeLabel: "Next < 6m",
      note:
        compoundCycles > 0
          ? `${formatCycleCount(compoundCycles)} applied, ${dueNote.toLowerCase()}`
          : dueNote,
    };
  }

  if (compoundCycles > 0) {
    return {
      accent: CLAY,
      badgeLabel: formatCycleCount(compoundCycles),
      note: `Compounded, ${dueNote.toLowerCase()}`,
    };
  }

  return {
    accent: TEAL,
    badgeLabel: "Simple",
    note: dueNote,
  };
};

const calculateInterestWithThreeYearCompounding = (
  principal: number,
  transactionDate: string,
  rate: number,
  calculationDate: Dayjs,
): { interest: number; total: number; compoundCycles: number; remainderPeriod: PeriodBreakdown } => {
  const start = dayjs(transactionDate).startOf("day");
  const end = calculationDate;

  if (start.isAfter(end)) {
    return {
      interest: 0,
      total: principal,
      compoundCycles: 0,
      remainderPeriod: createEmptyPeriod(),
    };
  }

  let balance = principal;
  let cycleCursor = start;
  let compoundCycles = 0;

  while (!cycleCursor.add(COMPOUNDING_PERIOD_YEARS, "year").isAfter(end)) {
    const nextCycleDate = cycleCursor.add(COMPOUNDING_PERIOD_YEARS, "year");
    const cycleDays = nextCycleDate.diff(cycleCursor, "day");
    const cycleInterest = calculateInterest(balance, cycleDays, rate);

    balance += cycleInterest;
    cycleCursor = nextCycleDate;
    compoundCycles += 1;
  }

  const remainderPeriod = buildPeriodBreakdown(cycleCursor, end);
  const remainderInterest = calculateInterest(balance, remainderPeriod.totalDays, rate);
  const total = balance + remainderInterest;

  return {
    interest: total - principal,
    total,
    compoundCycles,
    remainderPeriod,
  };
};

export const buildTransactionDetails = (
  transaction: Transaction,
  calculationDate: Dayjs,
  customRate: number | null,
): TransactionDetails => {
  const period = calculateElapsedPeriod(transaction.date, calculationDate);
  const standardCalculation = calculateInterestWithThreeYearCompounding(
    transaction.amount,
    transaction.date,
    STANDARD_INTEREST_RATE,
    calculationDate,
  );
  const nextCompoundPeriod = calculateNextCompoundPeriod(
    transaction.date,
    standardCalculation.compoundCycles,
    calculationDate,
  );
  const customCalculation =
    customRate === null
      ? null
      : calculateInterestWithThreeYearCompounding(
          transaction.amount,
          transaction.date,
          customRate,
          calculationDate,
        );

  return {
    transaction,
    period,
    compoundingStatus: buildCompoundingStatus(
      standardCalculation.compoundCycles,
      nextCompoundPeriod,
    ),
    standardResult: {
      interest: standardCalculation.interest,
      total: standardCalculation.total,
    },
    customResult: customCalculation
      ? {
          interest: customCalculation.interest,
          total: customCalculation.total,
        }
      : null,
  };
};

export const calculateTotals = (
  transactionDetails: TransactionDetails[],
): TotalsSummary =>
  transactionDetails.reduce(
    (summary, item) => ({
      principal: summary.principal + item.transaction.amount,
      standardInterest: summary.standardInterest + item.standardResult.interest,
      standardTotal: summary.standardTotal + item.standardResult.total,
      customInterest: summary.customInterest + (item.customResult?.interest ?? 0),
      customTotal: summary.customTotal + (item.customResult?.total ?? 0),
    }),
    {
      principal: 0,
      standardInterest: 0,
      standardTotal: 0,
      customInterest: 0,
      customTotal: 0,
    },
  );

export const findOldestTransactionDetails = (
  transactionDetails: TransactionDetails[],
): TransactionDetails | null =>
  transactionDetails.reduce<TransactionDetails | null>((currentOldest, item) => {
    if (currentOldest === null) {
      return item;
    }

    return item.transaction.date < currentOldest.transaction.date ? item : currentOldest;
  }, null);

export const buildSummaryMetrics = ({
  transactionCount,
  totals,
  calculationDate,
  hasActiveCustomRate,
  customRateLabel,
}: {
  transactionCount: number;
  totals: TotalsSummary;
  calculationDate: Dayjs;
  hasActiveCustomRate: boolean;
  customRateLabel: string | null;
}): SummaryMetricData[] => [
  {
    accent: SLATE,
    label: "Records",
    value: `${transactionCount}`,
    note: `${transactionCount === 1 ? "Entry" : "Entries"} tracked`,
  },
  {
    accent: TEAL,
    label: "Principal",
    value: formatCurrency(totals.principal),
    note: `Calculated to ${calculationDate.format("DD MMM YYYY")}`,
  },
  {
    accent: AMBER,
    label: `${STANDARD_INTEREST_RATE}% Interest`,
    value: formatCurrency(totals.standardInterest),
    note: `${STANDARD_INTEREST_RATE}% Sum ${formatCurrency(totals.standardTotal)}`,
  },
  ...(hasActiveCustomRate && customRateLabel
    ? [
        {
          accent: CLAY,
          label: `${customRateLabel}% Interest`,
          value: formatCurrency(totals.customInterest),
          note: `${customRateLabel}% Sum ${formatCurrency(totals.customTotal)}`,
        },
      ]
    : []),
  {
    accent: SLATE,
    label: "Compounding",
    value: `Every ${COMPOUNDING_PERIOD_YEARS} years`,
    note: "Simple until a full 3-year block completes",
  },
];
