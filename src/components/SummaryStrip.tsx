import { Box, Paper } from "@mui/material";
import type { SummaryMetricData } from "../types";
import { SummaryMetric } from "./SummaryMetric";

interface SummaryStripProps {
  metrics: SummaryMetricData[];
}

export const SummaryStrip = ({ metrics }: SummaryStripProps) => (
  <Paper className="summary-strip" elevation={0}>
    <Box className="summary-strip-row">
      {metrics.map((item) => (
        <SummaryMetric key={`${item.label}-${item.accent}`} {...item} />
      ))}
    </Box>
  </Paper>
);
