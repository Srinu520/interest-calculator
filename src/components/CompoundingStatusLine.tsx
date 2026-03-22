import { Box, Chip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { CompoundingStatus } from "../types";

interface CompoundingStatusLineProps {
  status: CompoundingStatus;
}

export const CompoundingStatusLine = ({ status }: CompoundingStatusLineProps) => (
  <Box className="compound-status-line">
    <Chip
      className="compound-status-chip"
      size="small"
      label={status.badgeLabel}
      sx={{
        borderColor: alpha(status.accent, 0.18),
        backgroundColor: alpha(status.accent, 0.1),
        color: status.accent,
      }}
      variant="outlined"
    />
    <Typography
      className="compound-status-note"
      variant="caption"
      sx={{ color: status.accent }}
    >
      {status.note}
    </Typography>
  </Box>
);
