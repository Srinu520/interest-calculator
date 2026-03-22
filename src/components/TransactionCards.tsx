import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AMBER, CLAY, TEAL, STANDARD_INTEREST_RATE } from "../constants";
import type { Transaction, TransactionDetails } from "../types";
import {
  formatCount,
  formatCurrency,
  formatDisplayDate,
  formatPeriodCompact,
  getRecordName,
} from "../utils/formatters";
import { CompoundingStatusLine } from "./CompoundingStatusLine";
import { InterestInlineItem } from "./InterestInlineItem";

interface TransactionCardsProps {
  items: TransactionDetails[];
  editingId: string | null;
  customRateLabel: string | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionCards = ({
  items,
  editingId,
  customRateLabel,
  onEdit,
  onDelete,
}: TransactionCardsProps) => (
  <Box className="transaction-cards">
    {items.map((item) => (
      <Paper className="transaction-card" elevation={0} key={item.transaction.id}>
        <Box className="card-top">
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {getRecordName(item.transaction.name)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDisplayDate(item.transaction.date)}
            </Typography>
          </Box>
          <Box className="card-top-actions">
            <Chip
              className="card-action-badge"
              size="small"
              sx={{ backgroundColor: alpha(TEAL, 0.12), color: TEAL }}
              label={`${formatCount(item.period.totalDays)}d`}
            />
            <Button
              className="card-action-button"
              variant={editingId === item.transaction.id ? "contained" : "outlined"}
              size="small"
              onClick={() => onEdit(item.transaction)}
            >
              Edit
            </Button>
            <Button
              className="card-action-button"
              color="error"
              variant="outlined"
              size="small"
              onClick={() => onDelete(item.transaction)}
            >
              Del
            </Button>
          </Box>
        </Box>
        <Box className="record-inline-meta">
          <Typography variant="caption" color="text.secondary">
            Principal
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {formatCurrency(item.transaction.amount)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatPeriodCompact(item.period)}
          </Typography>
        </Box>
        <CompoundingStatusLine status={item.compoundingStatus} />
        <Box className="interest-inline-row">
          <InterestInlineItem
            accent={AMBER}
            label={`${STANDARD_INTEREST_RATE}% Interest`}
            result={item.standardResult}
          />
          {item.customResult && customRateLabel && (
            <InterestInlineItem
              accent={CLAY}
              label={`${customRateLabel}% Interest`}
              result={item.customResult}
            />
          )}
        </Box>
      </Paper>
    ))}
  </Box>
);
