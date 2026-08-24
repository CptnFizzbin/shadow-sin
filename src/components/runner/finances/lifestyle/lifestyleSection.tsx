import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiInfinityLine } from "@remixicon/react"
import type { FC } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"

export const LifestyleSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()

  const quality = useRunnerStoreSelector(Selectors.profile.selectLifestyleQuality) ?? LifestyleType.Street
  const monthsPaid = useRunnerStoreSelector(Selectors.profile.selectLifestyleMonthsPaid) ?? 1
  const upkeep = Lifestyles[quality].upkeep
  const currentNuyen = useRunnerStoreSelector(Selectors.nuyen.selectNuyenAmount)

  const canPrepay = upkeep > 0 && currentNuyen >= upkeep

  const handlePrepay = () => {
    dispatch(Actions.nuyen.withdrawNuyen(upkeep))
    dispatch(Actions.profile.setLifestyleMonthsPaid(monthsPaid + 1))
  }

  return (
    <Stack>
      <Label label="Lifestyle" />

      <Stack direction="row">
        <FormControl fullWidth size="small">
          <Select
            value={quality}
            onChange={(e) => dispatch(Actions.profile.setLifestyleQuality(e.target.value))}
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

      <Stack direction="row">
        <Stack sx={{ flexGrow: 1, alignItems: "center" }}>
          <Label label="Monthly Upkeep" />
          <Typography>
            {upkeep > 0 ? <Nuyen amount={upkeep} /> : "Free"}
          </Typography>
        </Stack>

        <Stack sx={{ flexGrow: 1, alignItems: "center" }}>
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
