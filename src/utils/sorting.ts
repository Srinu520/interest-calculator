import type {
  SortDirection,
  SortField,
  TransactionDetails,
} from "../types";
import { getRecordName } from "./formatters";

const compareNumberValues = (left: number, right: number): number => {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
};

const compareTextValues = (left: string, right: string): number =>
  left.localeCompare(right, undefined, { sensitivity: "base", numeric: true });

export const compareTransactionDetails = (
  left: TransactionDetails,
  right: TransactionDetails,
  sortField: SortField,
  sortDirection: SortDirection,
): number => {
  let result = 0;

  switch (sortField) {
    case "date":
      result = compareTextValues(left.transaction.date, right.transaction.date);
      break;
    case "name":
      result = compareTextValues(
        getRecordName(left.transaction.name),
        getRecordName(right.transaction.name),
      );
      break;
    case "amount":
      result = compareNumberValues(left.transaction.amount, right.transaction.amount);
      break;
    case "period":
      result = compareNumberValues(left.period.totalDays, right.period.totalDays);
      break;
    case "interest":
      result = compareNumberValues(left.standardResult.interest, right.standardResult.interest);
      break;
  }

  if (result === 0) {
    result = compareTextValues(left.transaction.date, right.transaction.date);
  }

  if (result === 0) {
    result = compareTextValues(
      getRecordName(left.transaction.name),
      getRecordName(right.transaction.name),
    );
  }

  return sortDirection === "asc" ? result : -result;
};
