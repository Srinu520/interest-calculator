import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { SummaryMetricData } from "../types";

export const SummaryMetric = ({ accent, label, note, value }: SummaryMetricData) => (
  <Box
    className="summary-metric"
    sx={{
      borderColor: alpha(accent, 0.16),
      boxShadow: `0 18px 40px ${alpha(accent, 0.08)}`,
    }}
  >
    <Typography
      variant="overline"
      sx={{
        color: accent,
        display: "block",
        fontWeight: 700,
        letterSpacing: "0.08em",
      }}
    >
      {label}
    </Typography>
    <Typography variant="h5" sx={{ color: accent }}>
      {value}
    </Typography>
    {note && (
      <Typography variant="body2" color="text.secondary">
        {note}
      </Typography>
    )}
  </Box>
);
