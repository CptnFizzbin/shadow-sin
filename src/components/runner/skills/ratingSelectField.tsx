import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import type { FC } from "react"

interface RatingSelectFieldProps {
  rating: number
  options: readonly number[]
  onChange: (rating: number) => void
}

/** Plain (non-AppForm) rating dropdown shared by dialogs still on local useState. */
export const RatingSelectField: FC<RatingSelectFieldProps> = ({ rating, options, onChange }) => (
  <FormControl fullWidth size="small">
    <InputLabel>Rating</InputLabel>
    <Select value={rating} label="Rating" onChange={(e) => onChange(Number(e.target.value))}>
      {options.map((r) => (
        <MenuItem key={r} value={r}>
          {r}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)
