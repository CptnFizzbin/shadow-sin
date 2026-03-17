import Stack from "@mui/material/Stack";
import MuiTextField from "@mui/material/TextField";
import type { FC } from "react";

export interface SourceFieldProps {
  book: string;
  page: string;
  onBookChange: (value: string) => void;
  onPageChange: (value: string) => void;
}

export const SourceField: FC<SourceFieldProps> = ({
  book,
  page,
  onBookChange,
  onPageChange,
}) => {
  return (
    <Stack direction="row" gap={1}>
      <MuiTextField
        label="Source Book"
        size="small"
        value={book}
        onChange={(e) => onBookChange(e.target.value)}
        placeholder="e.g. SR20A"
        sx={{ flexGrow: 1 }}
      />
      <MuiTextField
        label="Page"
        size="small"
        type="number"
        value={page}
        onChange={(e) => onPageChange(e.target.value)}
        sx={{ width: 90 }}
        slotProps={{ htmlInput: { min: 1 } }}
      />
    </Stack>
  );
};
