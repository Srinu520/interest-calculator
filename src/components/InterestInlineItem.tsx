import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { InterestResult } from "../types";
import { formatCurrency } from "../utils/formatters";

interface InterestInlineItemProps {
  accent: string;
  label: string;
  result: InterestResult;
}

export const InterestInlineItem = ({
  accent,
  label,
  result,
}: InterestInlineItemProps) => (
  <Box
    className="interest-inline-item"
    sx={{
      borderColor: alpha(accent, 0.18),
      backgroundColor: alpha(accent, 0.06),
    }}
  >
    <Typography variant="body2" sx={{ color: accent, fontWeight: 700 }}>
      {label}: {formatCurrency(result.interest)}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
      Due {formatCurrency(result.total)}
    </Typography>
  </Box>
);
