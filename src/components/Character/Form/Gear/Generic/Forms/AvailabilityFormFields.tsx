import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"

export type AvailabilityRestriction = "none" | "restricted" | "forbidden"

interface AvailabilityFormFieldsProps {
  availabilityRating: number
  restriction: AvailabilityRestriction
  onAvailabilityRatingChange: (value: number) => void
  onRestrictionChange: (value: AvailabilityRestriction) => void
}

export const AvailabilityFormFields: FC<AvailabilityFormFieldsProps> = ({
  availabilityRating,
  restriction,
  onAvailabilityRatingChange,
  onRestrictionChange,
}) => {
  return (
    <Stack direction="row" gap={1}>
      <TextField
        type="number"
        label="Availability"
        size="small"
        sx={{ flex: 1 }}
        value={availabilityRating}
        inputProps={{ min: 0 }}
        onChange={(e) => onAvailabilityRatingChange(Number(e.target.value))}
      />

      <ToggleButtonGroup
        value={restriction}
        exclusive
        onChange={(_, value: AvailabilityRestriction | null) => {
          if (value !== null) onRestrictionChange(value)
        }}
        size="small"
        sx={{ height: 40, alignSelf: "center" }}
      >
        <ToggleButton value="none" sx={{ px: 1.5 }}>
          —
        </ToggleButton>
        <ToggleButton value="restricted" sx={{ px: 1.5 }}>
          R
        </ToggleButton>
        <ToggleButton value="forbidden" sx={{ px: 1.5 }}>
          F
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}
