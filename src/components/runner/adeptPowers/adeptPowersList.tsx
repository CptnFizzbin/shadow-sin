import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

import { AdeptPowerListItem } from "./adeptPowerListItem.tsx"
import { usePowerPoints } from "./adeptPowersHooks.ts"
import { useAdeptPowerFormDialog } from "./dialogs/adeptPowerFormDialog.tsx"

export const AdeptPowersList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const adeptPowers = useRunnerStoreSelector(Selectors.powers.selectPowers)
  const powerPoints = usePowerPoints()
  const adeptPowerFormDialog = useAdeptPowerFormDialog()

  const savePower = (power: AdeptPowerData) => dispatch(Actions.powers.savePower(power))
  const removePower = (power: AdeptPowerData) => dispatch(Actions.powers.removePower(power.id))

  const handleAddPower = async () => {
    const saved = await adeptPowerFormDialog.open()
    if (saved) savePower(saved)
  }

  const handleEditPower = async (power: AdeptPowerData) => {
    const saved = await adeptPowerFormDialog
      .open({ power, onDelete: () => removePower(power) })
    if (saved) savePower(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <PowerPoints value={powerPoints.used} total={powerPoints.max} />

      {adeptPowers.length === 0 && (
        <Typography color="text.secondary">
          No adept powers added yet.
        </Typography>
      )}

      {adeptPowers.map((power) => (
        <AdeptPowerListItem
          key={power.id}
          power={power}
          onClick={() => handleEditPower(power)}
        />
      ))}

      <Button
        startIcon={<RiAddLine />}
        color="secondary"
        variant="outlined"
        onClick={handleAddPower}
      >
        Add Power
      </Button>

      {adeptPowerFormDialog.dialog}
    </Stack>
  )
}
