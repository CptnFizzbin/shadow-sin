import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiInfinityLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { selectNuyenAmount } from "#/components/character/finances/nuyen/nuyenSelectors.ts"
import type { NuyenStore } from "#/components/character/finances/nuyen/useNuyenStore.ts"
import { selectLifestyleMonthsPaid, selectLifestyleQuality } from "#/components/character/profile/lifestyleSelectors.ts"
import { useLifestyleStore } from "#/components/character/profile/useLifestyleStore.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"

interface Props {
  nuyenStore: NuyenStore
}

export const LifestyleSection: FC<Props> = ({ nuyenStore }) => {
  const lifestyleStore = useLifestyleStore()

  const quality = useStore(lifestyleStore, selectLifestyleQuality)
  const monthsPaid = useStore(lifestyleStore, selectLifestyleMonthsPaid)
  const upkeep = Lifestyles[quality].upkeep
  const currentNuyen = useStore(nuyenStore, selectNuyenAmount)

  const canPrepay = upkeep > 0 && currentNuyen >= upkeep

  const handlePrepay = () => {
    nuyenStore.withdraw(upkeep)
    lifestyleStore.setMonthsPaid(monthsPaid + 1)
  }

  return (
    <Stack>
      <Label label="Lifestyle" />

      <Stack direction="row">
        <FormControl fullWidth size="small">
          <Select
            value={quality}
            onChange={(e) => lifestyleStore.setQuality(e.target.value)}
          >
            {Object.values(LifestyleType).map((type) => (
              <MenuItem
                key={type}
                value={type}
                sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}
              >
                <Typography>{type}</Typography>
                <Typography variant="caption" color="secondary">
                  <Nuyen amount={Lifestyles[type].upkeep} />/m
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" sx={{ gap: 1 }}>
        <Stack sx={{ flexGrow: 1, alignItems: "center", gap: 1 }}>
          <Label label="Monthly Upkeep" />
          <Typography>
            {upkeep > 0 ? <Nuyen amount={upkeep} /> : "Free"}
          </Typography>
        </Stack>

        <Stack sx={{ flexGrow: 1, alignItems: "center", gap: 1 }}>
          <Label label="Months Prepaid" />
          <Typography>
            {upkeep > 0 ? monthsPaid : <RiInfinityLine />}
          </Typography>

          {upkeep > 0 && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              disabled={!canPrepay}
              onClick={handlePrepay}
              fullWidth
            >
              Prepay Month
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
