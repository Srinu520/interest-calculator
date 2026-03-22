import {
  CUSTOM_RATE_STORAGE_KEY,
  TRANSACTIONS_STORAGE_KEY,
} from "../constants";
import type { Transaction } from "../types";

export const canUseLocalStorage = (): boolean => typeof window !== "undefined";

export const loadStoredTransactions = (): Transaction[] => {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(TRANSACTIONS_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.flatMap((item): Transaction[] => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const candidate = item as Partial<Transaction> & { amount?: number | string };
      const parsedAmount =
        typeof candidate.amount === "number"
          ? candidate.amount
          : Number.parseFloat(String(candidate.amount ?? ""));

      if (
        typeof candidate.id !== "string" ||
        typeof candidate.name !== "string" ||
        typeof candidate.date !== "string" ||
        !Number.isFinite(parsedAmount) ||
        parsedAmount <= 0
      ) {
        return [];
      }

      return [
        {
          id: candidate.id,
          name: candidate.name,
          date: candidate.date,
          amount: parsedAmount,
        },
      ];
    });
  } catch {
    return [];
  }
};

export const loadStoredCustomRate = (): string => {
  if (!canUseLocalStorage()) {
    return "";
  }

  return window.localStorage.getItem(CUSTOM_RATE_STORAGE_KEY) ?? "";
};

export const persistTransactions = (transactions: Transaction[]): void => {
  if (!canUseLocalStorage()) {
    return;
  }

  if (transactions.length === 0) {
    window.localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
};

export const persistCustomRate = (customRate: string): void => {
  if (!canUseLocalStorage()) {
    return;
  }

  if (customRate === "") {
    window.localStorage.removeItem(CUSTOM_RATE_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(CUSTOM_RATE_STORAGE_KEY, customRate);
};
