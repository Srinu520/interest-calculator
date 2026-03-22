import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import {
  COMPOUNDING_PERIOD_YEARS,
  STANDARD_INTEREST_RATE,
} from "../constants";

interface InputToolbarProps {
  name: string;
  date: string;
  amount: string;
  customRate: string;
  today: string;
  hasValidDate: boolean;
  hasValidAmount: boolean;
  hasValidCustomRate: boolean;
  trimmedCustomRate: string;
  hasActiveCustomRate: boolean;
  customRateLabel: string | null;
  isEditing: boolean;
  canSubmit: boolean;
  onNameChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onCustomRateChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const InputToolbar = ({
  name,
  date,
  amount,
  customRate,
  today,
  hasValidDate,
  hasValidAmount,
  hasValidCustomRate,
  trimmedCustomRate,
  hasActiveCustomRate,
  customRateLabel,
  isEditing,
  canSubmit,
  onNameChange,
  onDateChange,
  onAmountChange,
  onCustomRateChange,
  onSubmit,
  onCancel,
}: InputToolbarProps) => (
  <Paper className="input-toolbar" elevation={0}>
    <Box className="toolbar-row">
      <Box className="toolbar-field toolbar-name">
        <Typography className="toolbar-label">Record Name</Typography>
        <TextField
          className="toolbar-input"
          placeholder="Customer / Invoice / Case"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          size="small"
        />
      </Box>
      <Box className="toolbar-field">
        <Typography className="toolbar-label">Transaction Date</Typography>
        <TextField
          className="toolbar-input"
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          inputProps={{ max: today, "aria-label": "Transaction Date" }}
          error={Boolean(date) && !hasValidDate}
          size="small"
        />
      </Box>
      <Box className="toolbar-field">
        <Typography className="toolbar-label">Amount</Typography>
        <TextField
          className="toolbar-input"
          placeholder="Enter amount"
          type="number"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          inputProps={{ min: 0, step: "0.01", "aria-label": "Amount" }}
          error={amount !== "" && !hasValidAmount}
          size="small"
        />
      </Box>
      <Box className="toolbar-field">
        <Typography className="toolbar-label">Custom Rate (%)</Typography>
        <TextField
          className="toolbar-input"
          placeholder="Optional rate"
          type="number"
          value={customRate}
          onChange={(event) => onCustomRateChange(event.target.value)}
          inputProps={{ min: 0, step: "0.01", "aria-label": "Custom Rate" }}
          error={trimmedCustomRate !== "" && !hasValidCustomRate}
          size="small"
        />
      </Box>
      <Box className="toolbar-actions">
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="toolbar-button"
        >
          {isEditing ? "Update Record" : "Add Record"}
        </Button>
        {isEditing && (
          <Button
            variant="outlined"
            onClick={onCancel}
            className="toolbar-button toolbar-button-secondary"
          >
            Cancel Edit
          </Button>
        )}
      </Box>
    </Box>
    <Box className="toolbar-meta">
      <Typography variant="body2" color="text.secondary">
        {hasActiveCustomRate && customRateLabel
          ? `Showing ${STANDARD_INTEREST_RATE}% and ${customRateLabel}% in every row. Saved in this browser.`
          : `Showing ${STANDARD_INTEREST_RATE}% only. Add a custom rate if needed. Saved in this browser.`}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Interest compounds once every {COMPOUNDING_PERIOD_YEARS} completed years.
      </Typography>
    </Box>
  </Paper>
);
