import { Box, MenuItem, TextField, Typography } from "@mui/material";
import {
  SORT_DIRECTION_OPTIONS,
  SORT_FIELD_OPTIONS,
} from "../constants";
import type { SortDirection, SortField } from "../types";

interface SortToolbarProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortFieldChange: (value: SortField) => void;
  onSortDirectionChange: (value: SortDirection) => void;
}

export const SortToolbar = ({
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
}: SortToolbarProps) => (
  <Box className="results-toolbar">
    <Box className="sort-field-group">
      <Typography className="toolbar-label">Sort By</Typography>
      <TextField
        className="results-sort-input"
        select
        size="small"
        value={sortField}
        onChange={(event) => onSortFieldChange(event.target.value as SortField)}
      >
        {SORT_FIELD_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
    <Box className="sort-field-group">
      <Typography className="toolbar-label">Order</Typography>
      <TextField
        className="results-sort-input"
        select
        size="small"
        value={sortDirection}
        onChange={(event) => onSortDirectionChange(event.target.value as SortDirection)}
      >
        {SORT_DIRECTION_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  </Box>
);
