import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"
import { LifestyleType, Lifestyles } from "#/lib/system/LifestyleType.ts"

export const LifestylePanel: FC = () => {
  const storeSlice = useCharacterBuilderStoreSlice(
    (state) => state,
    (_state, newState) => newState,
  )
  const lifestyle = useCharacterBuilderStore((state) => state.lifestyle)
  const lifestyleMonths = useCharacterBuilderStore(
    (state) => state.lifestyleMonths,
  )
  const upkeep = Lifestyles[lifestyle].upkeep
  const totalCost = upkeep * lifestyleMonths

  return (
    <Stack gap={1}>
      <FormControl fullWidth size="small">
        <InputLabel>Lifestyle</InputLabel>
        <Select
          value={lifestyle}
          label="Lifestyle"
          onChange={(event) =>
            storeSlice.update((draft) => {
              draft.lifestyle = event.target.value as LifestyleType
            })}
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
          storeSlice.update((draft) => {
            draft.lifestyleMonths = months
          })
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
