import { Box, Chip, Stack, Typography } from "@mui/material";
import type { Dayjs } from "dayjs";
import type { TransactionDetails } from "../types";
import { getRecordName, formatPeriodCompact } from "../utils/formatters";

interface AppHeaderProps {
  calculationDate: Dayjs;
  isEditing: boolean;
  name: string;
  oldestTransaction: TransactionDetails | null;
}

export const AppHeader = ({
  calculationDate,
  isEditing,
  name,
  oldestTransaction,
}: AppHeaderProps) => (
  <Box className="page-header">
    <Box>
      <Typography className="eyebrow">18% default interest view</Typography>
      <Typography variant="h3" gutterBottom>
        Interest Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Overall interest and sums are shown first. Inputs come next in one horizontal
        row, and compounding applies after each completed 3-year block.
      </Typography>
    </Box>
    <Stack
      direction="row"
      spacing={1.25}
      useFlexGap
      flexWrap="wrap"
      justifyContent={{ md: "flex-end" }}
    >
      <Chip
        className="hero-chip"
        label={`Calculated through ${calculationDate.format("DD MMM YYYY")}`}
      />
      {isEditing && <Chip className="hero-chip" label={`Editing ${getRecordName(name)}`} />}
      {oldestTransaction && (
        <Chip
          className="hero-chip"
          label={`Oldest period ${formatPeriodCompact(oldestTransaction.period)}`}
        />
      )}
    </Stack>
  </Box>
);
