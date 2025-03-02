import React, { useState } from "react";
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Container } from "@mui/material";
import dayjs from "dayjs";
import './App.css'
interface Transaction {
  date: string;
  amount: number;
  interest24: number;
  interest18: number;
  customInterest: number;
}

const InterestCalculator: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [customRate, setCustomRate] = useState("");
  const interestRate24 = 24; // 24% per annum
  const interestRate18 = 18; // 18% per annum

  const calculateInterest = (transactionDate: string, amount: number, rate: number): number => {
    const daysElapsed = dayjs().diff(dayjs(transactionDate), "day");
    return (amount * (rate / 100) * daysElapsed) / 365;
  };

  const handleAddTransaction = () => {
    if (!date || !amount || !customRate) return;
    const amt = parseFloat(amount);
    const customRateValue = parseFloat(customRate);
    if (isNaN(amt) || amt <= 0 || isNaN(customRateValue) || customRateValue <= 0) return;

    const interest24 = calculateInterest(date, amt, interestRate24);
    const interest18 = calculateInterest(date, amt, interestRate18);
    const customInterest = calculateInterest(date, amt, customRateValue);

    setTransactions([...transactions, { date, amount: amt, interest24, interest18, customInterest }]);
    setDate("");
    setAmount("");
    // setCustomRate("");
  };

  const totalPrincipal = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalInterest24 = transactions.reduce((sum, t) => sum + t.interest24, 0);
  const totalInterest18 = transactions.reduce((sum, t) => sum + t.interest18, 0);
  const totalCustomInterest = transactions.reduce((sum, t) => sum + t.customInterest, 0);
  const totalSum24 = totalPrincipal + totalInterest24;
  const totalSum18 = totalPrincipal + totalInterest18;
  const totalCustomSum = totalPrincipal + totalCustomInterest;

  return (
    <>
      <Typography variant="h4" gutterBottom textAlign={'center'}>Interest Calculator</Typography>
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <TextField
          label="Custom Interest Rate (%)"
          type="number"
          value={customRate}
          onChange={(e) => setCustomRate(e.target.value)}
        />
      </Box>
      <div className="container">
        <Box component={Container}>
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
                  <TableCell>Custom Interest ({customRate}%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((t, index) => (
                  <TableRow key={index}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.amount.toFixed(2)}</TableCell>
                    <TableCell>{t.interest24.toFixed(2)}</TableCell>
                    <TableCell>{t.interest18.toFixed(2)}</TableCell>
                    <TableCell>{t.customInterest.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Total Principal</TableCell>
                <TableCell>Total Interest (24%)</TableCell>
                <TableCell>Total Sum (Principal + Interest 24%)</TableCell>
                <TableCell>Total Interest (18%)</TableCell>
                <TableCell>Total Sum (Principal + Interest 18%)</TableCell>
                <TableCell>Total Custom Interest ({customRate}%)</TableCell>
                <TableCell>Total Sum (Principal + Custom Interest ({customRate}%))</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{totalPrincipal.toFixed(2)}</TableCell>
                <TableCell>{totalInterest24.toFixed(2)}</TableCell>
                <TableCell>{totalSum24.toFixed(2)}</TableCell>
                <TableCell>{totalInterest18.toFixed(2)}</TableCell>
                <TableCell>{totalSum18.toFixed(2)}</TableCell>
                <TableCell>{totalCustomInterest.toFixed(2)}</TableCell>
                <TableCell>{totalCustomSum.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default InterestCalculator;