import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiInfinityLine } from "@remixicon/react"
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

      <Stack direction="row" gap={1}>
        <Stack sx={{ flexGrow: 1 }} alignItems="center" gap={1}>
          <Label label="Monthly Upkeep" />
          <Typography>
            {upkeep > 0 ? <Nuyen amount={upkeep} /> : "Free"}
          </Typography>
        </Stack>

        <Stack sx={{ flexGrow: 1 }} alignItems="center" gap={1}>
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
