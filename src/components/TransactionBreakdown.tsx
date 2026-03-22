import { Box, Chip, Paper, Typography } from "@mui/material";
import { STANDARD_INTEREST_RATE } from "../constants";
import type {
  SortDirection,
  SortField,
  Transaction,
  TransactionDetails,
} from "../types";
import { SortToolbar } from "./SortToolbar";
import { TransactionCards } from "./TransactionCards";
import { TransactionTable } from "./TransactionTable";

interface TransactionBreakdownProps {
  items: TransactionDetails[];
  isCompact: boolean;
  editingId: string | null;
  hasActiveCustomRate: boolean;
  customRateLabel: string | null;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortFieldChange: (value: SortField) => void;
  onSortDirectionChange: (value: SortDirection) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionBreakdown = ({
  items,
  isCompact,
  editingId,
  hasActiveCustomRate,
  customRateLabel,
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
  onEdit,
  onDelete,
}: TransactionBreakdownProps) => (
  <Paper className="results-panel" elevation={0}>
    <Box className="section-heading">
      <Box>
        <Typography variant="h5" gutterBottom>
          Transaction breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Each row shows the record name, elapsed period in years, months, and days,
          the 18% interest result, and an optional custom rate result when requested.
        </Typography>
      </Box>
      <Chip
        className="hero-chip"
        label={
          hasActiveCustomRate && customRateLabel
            ? `Showing ${STANDARD_INTEREST_RATE}% and ${customRateLabel}%`
            : `Showing ${STANDARD_INTEREST_RATE}% only`
        }
      />
    </Box>

    {items.length === 0 ? (
      <Box className="empty-state">
        <Typography variant="h6" gutterBottom>
          No records yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first record to see the 18% calculation and any custom
          comparison you request.
        </Typography>
      </Box>
    ) : (
      <>
        <SortToolbar
          sortField={sortField}
          sortDirection={sortDirection}
          onSortFieldChange={onSortFieldChange}
          onSortDirectionChange={onSortDirectionChange}
        />
        {isCompact ? (
          <TransactionCards
            items={items}
            editingId={editingId}
            customRateLabel={customRateLabel}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <TransactionTable
            items={items}
            editingId={editingId}
            customRateLabel={customRateLabel}
            hasActiveCustomRate={hasActiveCustomRate}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </>
    )}
  </Paper>
);
