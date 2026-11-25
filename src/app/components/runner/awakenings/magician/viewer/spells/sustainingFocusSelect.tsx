import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import type { FC } from "react"

import type { FocusData } from "#/system/model/items/magicalData.ts"

const NO_FOCUS = ""

interface SustainingFocusSelectProps {
  /** The Sustaining Foci free to hold the Spell. */
  foci: FocusData[]
  /** The id of the chosen focus, or `null` for the caster to sustain the Spell themselves. */
  value: string | null
  onChange: (focusId: string | null) => void
  disabled?: boolean
}

/**
 * Picks the Bonded Sustaining Focus to hold a sustained Spell, or none so the caster sustains it
 * themselves. A focus-held Spell spares the caster the sustaining penalty, but its Force can't
 * exceed the focus's.
 */
export const SustainingFocusSelect: FC<SustainingFocusSelectProps> = ({ foci, value, onChange, disabled }) => {
  const selectedFocus = foci.find((focus) => focus.id === value)

  return (
    <FormControl fullWidth size="small" disabled={disabled}>
      <InputLabel id="sustaining-focus-select-label" shrink>Sustaining Focus</InputLabel>
      <Select
        labelId="sustaining-focus-select-label"
        label="Sustaining Focus"
        value={selectedFocus?.id ?? NO_FOCUS}
        displayEmpty
        notched
        onChange={(event) => onChange(event.target.value === NO_FOCUS ? null : event.target.value)}
      >
        <MenuItem value={NO_FOCUS}>None — sustain it yourself</MenuItem>
        {foci.map((focus) => (
          <MenuItem key={focus.id} value={focus.id}>
            {focus.name} (Force {focus.force})
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        {selectedFocus
          ? `No sustaining penalty — Force capped at ${selectedFocus.force}`
          : "Sustaining it yourself incurs the sustaining penalty"}
      </FormHelperText>
    </FormControl>
  )
}
