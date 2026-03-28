import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useId } from "react"

import { useBuilderLifestyleApi } from "#/components/CharacterBuilder/Sections/Gear/Lifestyle/UseLifestyleApi.ts"
import { Nuyen } from "#/components/UI/Nuyen.tsx"
import { Lifestyles, LifestyleType } from "#/lib/system/LifestyleType.ts"

export const LifestylePanel: FC = () => {
  const {
    lifestyle,
    lifestyleMonths,
    setLifestyle,
    setLifestyleMonths,
  } = useBuilderLifestyleApi()
  const lifestyleLabelId = useId()

  const upkeep = Lifestyles[lifestyle].upkeep
  const totalCost = upkeep * lifestyleMonths

  return (
    <Stack gap={1}>
      <FormControl fullWidth size="small">
        <InputLabel id={lifestyleLabelId}>Lifestyle</InputLabel>
        <Select
          labelId={lifestyleLabelId}
          value={lifestyle}
          label="Lifestyle"
          onChange={(event) =>
            setLifestyle(event.target.value as LifestyleType)}
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
        value={lifestyleMonths}
        slotProps={{ htmlInput: { min: 1 } }}
        onChange={(event) => {
          const months = Math.max(1, parseInt(event.target.value, 10) || 1)
          setLifestyleMonths(months)
        }}
      />

      <Typography variant="body2" color="text.secondary">
        Monthly upkeep:
        {" "}
        <Nuyen amount={upkeep} />
        {lifestyleMonths > 1 && (
          <>
            {" "}
            ×
            {" "}
            {lifestyleMonths}
            {" "}
            months =
            {" "}
            <Nuyen amount={totalCost} />
          </>
        )}
      </Typography>
    </Stack>
  )
}
