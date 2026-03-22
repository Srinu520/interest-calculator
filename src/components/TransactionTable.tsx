import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AMBER, CLAY, SLATE, STANDARD_INTEREST_RATE, TEAL } from "../constants";
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

interface TransactionTableProps {
  items: TransactionDetails[];
  editingId: string | null;
  customRateLabel: string | null;
  hasActiveCustomRate: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionTable = ({
  items,
  editingId,
  customRateLabel,
  hasActiveCustomRate,
  onEdit,
  onDelete,
}: TransactionTableProps) => (
  <TableContainer className="table-shell" component={Paper}>
    <Table>
      <TableHead>
        <TableRow
          sx={{
            "& th": {
              backgroundColor: alpha(TEAL, 0.08),
              borderBottomColor: alpha(TEAL, 0.12),
            },
          }}
        >
          <TableCell>Record</TableCell>
          <TableCell>Date</TableCell>
          <TableCell align="right">Principal</TableCell>
          <TableCell>Period</TableCell>
          <TableCell>Interest Info</TableCell>
          <TableCell align="right">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow
            hover
            key={item.transaction.id}
            sx={{
              backgroundColor:
                editingId === item.transaction.id ? alpha(TEAL, 0.06) : "transparent",
              "& td": {
                borderBottomColor: alpha(SLATE, 0.08),
                verticalAlign: "top",
                py: 1.5,
              },
            }}
          >
            <TableCell>
              <Typography variant="subtitle2" fontWeight={700} sx={{ whiteSpace: "nowrap" }}>
                {getRecordName(item.transaction.name)}
              </Typography>
              {editingId === item.transaction.id && (
                <Typography
                  variant="caption"
                  sx={{ color: TEAL, display: "block", fontWeight: 700 }}
                >
                  Currently editing
                </Typography>
              )}
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={700} sx={{ whiteSpace: "nowrap" }}>
                {formatDisplayDate(item.transaction.date)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {formatCount(item.period.totalDays)} days
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" fontWeight={700} sx={{ whiteSpace: "nowrap" }}>
                {formatCurrency(item.transaction.amount)}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={700} sx={{ whiteSpace: "nowrap" }}>
                {formatPeriodCompact(item.period)}
              </Typography>
              <CompoundingStatusLine status={item.compoundingStatus} />
            </TableCell>
            <TableCell>
              <Box className="interest-inline-row">
                <InterestInlineItem
                  accent={AMBER}
                  label={`${STANDARD_INTEREST_RATE}% Interest`}
                  result={item.standardResult}
                />
                {hasActiveCustomRate && customRateLabel && item.customResult && (
                  <InterestInlineItem
                    accent={CLAY}
                    label={`${customRateLabel}% Interest`}
                    result={item.customResult}
                  />
                )}
              </Box>
            </TableCell>
            <TableCell align="right">
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant={editingId === item.transaction.id ? "contained" : "text"}
                  size="small"
                  onClick={() => onEdit(item.transaction)}
                >
                  Edit
                </Button>
                <Button
                  color="error"
                  variant="text"
                  size="small"
                  onClick={() => onDelete(item.transaction)}
                >
                  Delete
                </Button>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
