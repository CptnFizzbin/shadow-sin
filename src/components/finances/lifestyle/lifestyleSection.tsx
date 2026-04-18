import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { useLifestyleStore } from "#/components/profile/useLifestyleStore.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { Lifestyles, LifestyleType } from "#/lib/system/lifestyleType.ts"
import type { NuyenStore } from "../nuyen/useNuyenStore.ts"

interface Props {
  nuyenStore: NuyenStore
}

export const LifestyleSection: FC<Props> = ({ nuyenStore }) => {
  const lifestyleStore = useLifestyleStore()

  const quality = useStore(lifestyleStore, (lifestyle) => lifestyle.quality)
  const monthsPaid = useStore(lifestyleStore, (lifestyle) => lifestyle.monthsPaid)
  const upkeep = Lifestyles[quality].upkeep
  const currentNuyen = useStore(nuyenStore, (state) => state.current)

  const canPrepay = upkeep > 0 && currentNuyen >= upkeep

  const handlePrepay = () => {
    nuyenStore.withdraw(upkeep)
    lifestyleStore.setMonthsPaid(monthsPaid + 1)
  }

  return (
    <Stack gap={1}>
      <Label label="Lifestyle" />

      <FormControl fullWidth size="small">
        <InputLabel>Quality</InputLabel>
        <Select
          value={quality}
          label="Quality"
          onChange={(e) => lifestyleStore.setQuality(e.target.value as LifestyleType)}
        >
          {Object.values(LifestyleType).map((lifestyleType) => (
            <MenuItem key={lifestyleType} value={lifestyleType}>
              {lifestyleType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" justifyContent="space-between">
        <Typography color="text.secondary">Monthly upkeep</Typography>
        <Typography>
          {upkeep > 0 ? <Nuyen amount={upkeep} /> : "Free"}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Typography color="text.secondary">Months prepaid</Typography>
        <Typography color={monthsPaid === 0 ? "error.main" : monthsPaid === 1 ? "warning.main" : "text.primary"}>
          {monthsPaid}
        </Typography>
      </Stack>

      {upkeep > 0 && (
        <Button
          size="small"
          variant="outlined"
          color="success"
          disabled={!canPrepay}
          onClick={handlePrepay}
          fullWidth
        >
          Prepay Month (<Nuyen amount={upkeep} />)
        </Button>
      )}
    </Stack>
  )
}
