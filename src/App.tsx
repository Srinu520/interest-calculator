import React, { useState } from "react";
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";

interface Transaction {
  date: string;
  amount: number;
  interest24: number;
  interest18: number;
}

const InterestCalculator: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const interestRate24 = 24; // 24% per annum
  const interestRate18 = 18; // 18% per annum

  const calculateInterest = (transactionDate: string, amount: number, rate: number): number => {
    const daysElapsed = dayjs().diff(dayjs(transactionDate), "day");
    return (amount * (rate / 100) * daysElapsed) / 365;
  };

  const handleAddTransaction = () => {
    if (!date || !amount) return;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;

    const interest24 = calculateInterest(date, amt, interestRate24);
    const interest18 = calculateInterest(date, amt, interestRate18);
    
    setTransactions([...transactions, { date, amount: amt, interest24, interest18 }]);
    setDate("");
    setAmount("");
  };

  const totalPrincipal = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalInterest24 = transactions.reduce((sum, t) => sum + t.interest24, 0);
  const totalInterest18 = transactions.reduce((sum, t) => sum + t.interest18, 0);
  const totalSum24 = totalPrincipal + totalInterest24;
  const totalSum18 = totalPrincipal + totalInterest18;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>Interest Calculator</Typography>
      <TextField
        label="Transaction Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddTransaction} fullWidth>
        Add Transaction
      </Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Interest (24%)</TableCell>
              <TableCell>Interest (18%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t, index) => (
              <TableRow key={index}>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.amount.toFixed(2)}</TableCell>
                <TableCell>{t.interest24.toFixed(2)}</TableCell>
                <TableCell>{t.interest18.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" style={{ marginTop: 20 }}>
        Total Principal: {totalPrincipal.toFixed(2)}
      </Typography>
      <Typography variant="h6" style={{ marginTop: 10 }}>
        Total Interest (24%): {totalInterest24.toFixed(2)}
      </Typography>
      <Typography variant="h6" style={{ marginTop: 10 }}>
        Total Sum (Principal + Interest 24%): {totalSum24.toFixed(2)}
      </Typography>
      <Typography variant="h6" style={{ marginTop: 10 }}>
        Total Interest (18%): {totalInterest18.toFixed(2)}
      </Typography>
      <Typography variant="h6" style={{ marginTop: 10 }}>
        Total Sum (Principal + Interest 18%): {totalSum18.toFixed(2)}
      </Typography>
    </div>
  );
};

export default InterestCalculator;