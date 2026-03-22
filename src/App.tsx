import { useEffect, useState } from "react";
import { Box, Container, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import "./App.css";
import { AppHeader } from "./components/AppHeader";
import { InputToolbar } from "./components/InputToolbar";
import { SummaryStrip } from "./components/SummaryStrip";
import { TransactionBreakdown } from "./components/TransactionBreakdown";
import { theme } from "./theme";
import type { SortDirection, SortField, Transaction } from "./types";
import {
  buildSummaryMetrics,
  buildTransactionDetails,
  calculateTotals,
  findOldestTransactionDetails,
} from "./utils/calculations";
import { getRecordName } from "./utils/formatters";
import { compareTransactionDetails } from "./utils/sorting";
import {
  loadStoredCustomRate,
  loadStoredTransactions,
  persistCustomRate,
  persistTransactions,
} from "./utils/storage";

const App = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadStoredTransactions());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [customRate, setCustomRate] = useState(() => loadStoredCustomRate());
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const calculationDate = dayjs().startOf("day");
  const today = calculationDate.format("YYYY-MM-DD");
  const parsedAmount = Number.parseFloat(amount);
  const trimmedCustomRate = customRate.trim();
  const parsedCustomRate = Number.parseFloat(trimmedCustomRate);
  const hasValidDate = Boolean(date) && !dayjs(date).isAfter(calculationDate, "day");
  const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const hasActiveCustomRate =
    trimmedCustomRate !== "" &&
    Number.isFinite(parsedCustomRate) &&
    parsedCustomRate > 0;
  const hasValidCustomRate = trimmedCustomRate === "" || hasActiveCustomRate;
  const customRateValue = hasActiveCustomRate ? parsedCustomRate : null;
  const customRateLabel = hasActiveCustomRate
    ? Number.isInteger(parsedCustomRate)
      ? parsedCustomRate.toFixed(0)
      : parsedCustomRate.toFixed(2)
    : null;
  const canSubmit = hasValidDate && hasValidAmount && hasValidCustomRate;
  const isEditing = editingId !== null;
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    persistTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    persistCustomRate(customRate);
  }, [customRate]);

  const baseTransactionDetails = transactions.map((transaction) =>
    buildTransactionDetails(transaction, calculationDate, customRateValue),
  );

  const transactionDetails = [...baseTransactionDetails].sort((left, right) =>
    compareTransactionDetails(left, right, sortField, sortDirection),
  );

  const totals = calculateTotals(baseTransactionDetails);
  const oldestTransaction = findOldestTransactionDetails(baseTransactionDetails);
  const summaryMetrics = buildSummaryMetrics({
    transactionCount: transactions.length,
    totals,
    calculationDate,
    hasActiveCustomRate,
    customRateLabel,
  });

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDate("");
    setAmount("");
  };

  const handleSubmitTransaction = () => {
    if (!canSubmit) {
      return;
    }

    const nextTransaction: Transaction = {
      id: editingId ?? crypto.randomUUID(),
      name: name.trim(),
      date,
      amount: parsedAmount,
    };

    setTransactions((currentTransactions) =>
      editingId === null
        ? [...currentTransactions, nextTransaction]
        : currentTransactions.map((transaction) =>
            transaction.id === editingId ? nextTransaction : transaction,
          ),
    );

    resetForm();
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setName(transaction.name);
    setDate(transaction.date);
    setAmount(String(transaction.amount));
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    const recordName = getRecordName(transaction.name);
    const shouldDelete = window.confirm(`Delete record "${recordName}"?`);

    if (!shouldDelete) {
      return;
    }

    setTransactions((currentTransactions) =>
      currentTransactions.filter((currentTransaction) => currentTransaction.id !== transaction.id),
    );

    if (editingId === transaction.id) {
      resetForm();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-shell">
        <Container maxWidth="xl" sx={{ px: { xs: 1.25, sm: 2.5, md: 3 } }}>
          <AppHeader
            calculationDate={calculationDate}
            isEditing={isEditing}
            name={name}
            oldestTransaction={oldestTransaction}
          />
          <SummaryStrip metrics={summaryMetrics} />
          <InputToolbar
            name={name}
            date={date}
            amount={amount}
            customRate={customRate}
            today={today}
            hasValidDate={hasValidDate}
            hasValidAmount={hasValidAmount}
            hasValidCustomRate={hasValidCustomRate}
            trimmedCustomRate={trimmedCustomRate}
            hasActiveCustomRate={hasActiveCustomRate}
            customRateLabel={customRateLabel}
            isEditing={isEditing}
            canSubmit={canSubmit}
            onNameChange={setName}
            onDateChange={setDate}
            onAmountChange={setAmount}
            onCustomRateChange={setCustomRate}
            onSubmit={handleSubmitTransaction}
            onCancel={resetForm}
          />
          <TransactionBreakdown
            items={transactionDetails}
            isCompact={isCompact}
            editingId={editingId}
            hasActiveCustomRate={hasActiveCustomRate}
            customRateLabel={customRateLabel}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortFieldChange={setSortField}
            onSortDirectionChange={setSortDirection}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
