import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { useLifestyleStore } from "#/components/profile/useLifestyleStore.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Lifestyles, LifestyleType } from "#/lib/system/lifestyleType.ts"

export const LifestylePanel: FC = () => {
  const lifestyleStore = useLifestyleStore()

  const quality = useStore(lifestyleStore, (lifestyle) => lifestyle.quality)
  const upkeep = Lifestyles[quality].upkeep
  const monthsPaid = useStore(lifestyleStore, (lifestyle) => lifestyle.monthsPaid)

  const totalCost = upkeep * monthsPaid

  return (
    <Stack sx={{ gap: 1 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Lifestyle</InputLabel>
        <Select
          value={quality}
          label="Lifestyle"
          onChange={(e) => lifestyleStore.setQuality(e.target.value)}
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
          lifestyleStore.setMonthsPaid(months)
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
