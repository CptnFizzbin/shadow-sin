import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import type { FC } from "react"

interface SourceFormFieldsProps {
  sourceBook: string
  sourcePage: number
  onSourceBookChange: (value: string) => void
  onSourcePageChange: (value: number) => void
}

export const SourceFormFields: FC<SourceFormFieldsProps> = ({
  sourceBook,
  sourcePage,
  onSourceBookChange,
  onSourcePageChange,
}) => {
  return (
    <Stack direction="row" gap={1}>
      <TextField
        label="Book"
        size="small"
        sx={{ flex: 1 }}
        value={sourceBook}
        onChange={(e) => onSourceBookChange(e.target.value)}
      />

      <TextField
        type="number"
        label="Page"
        size="small"
        sx={{ width: 90 }}
        value={sourcePage}
        inputProps={{ min: 0 }}
        onChange={(e) => onSourcePageChange(Number(e.target.value))}
      />
    </Stack>
  )
}
