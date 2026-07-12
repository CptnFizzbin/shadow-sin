import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"

export const LifestylePanel: FC = () => {
  const dispatch = useRunnerStoreDispatch()

  const quality = useRunnerStoreSelector(Selectors.profile.selectLifestyleQuality) ?? LifestyleType.Street
  const upkeep = Lifestyles[quality].upkeep
  const monthsPaid = useRunnerStoreSelector(Selectors.profile.selectLifestyleMonthsPaid) ?? 1

  const totalCost = upkeep * monthsPaid

  return (
    <Stack sx={{ gap: 1 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Lifestyle</InputLabel>
        <Select
          value={quality}
          label="Lifestyle"
          onChange={(e) => dispatch(Actions.profile.setLifestyleQuality(e.target.value))}
        >
          {Object.values(LifestyleType).map((lifestyleType) => (
            <MenuItem key={lifestyleType} value={lifestyleType}>
              {lifestyleType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Months prepaid"
        type="number"
        size="small"
        fullWidth
        value={monthsPaid}
        slotProps={{ htmlInput: { min: 1 } }}
        onChange={(event) => {
          const months = Math.max(1, parseInt(event.target.value, 10) || 1)
          dispatch(Actions.profile.setLifestyleMonthsPaid(months))
        }}
      />

      <Typography color="text.secondary">
        Monthly upkeep: <Nuyen amount={upkeep} />
        {monthsPaid > 1 && (
          <>× {monthsPaid} months = <Nuyen amount={totalCost} /></>
        )}
      </Typography>
    </Stack>
  )
}
