import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

import { AdeptPowerListItem } from "./adeptPowerListItem.tsx"
import { usePowerPoints } from "./adeptPowersHooks.ts"
import { useAdeptPowerFormDialog } from "./dialogs/adeptPowerFormDialog.tsx"

export const AdeptPowersViewerSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const adeptPowers = useRunnerStoreSelector(Selectors.powers.selectPowers)
  const powerPoints = usePowerPoints()
  const adeptPowerFormDialog = useAdeptPowerFormDialog()

  const handleEditPower = async (power: AdeptPowerData) => {
    const updated = await adeptPowerFormDialog.open({
      power,
      onDelete: () => dispatch(Actions.powers.removePower(power.id)),
    })
    if (updated) dispatch(Actions.powers.updatePower(updated))
  }

  if (adeptPowers.length === 0) {
    return (
      <Paper sx={{ padding: 1 }}>
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          No adept powers learned
        </Typography>
      </Paper>
    )
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <PowerPoints value={powerPoints.used} total={powerPoints.max} />

      <Stack sx={{ gap: 0.5 }}>
        {adeptPowers.map((power) => (
          <AdeptPowerListItem
            key={power.id}
            power={power}
            onClick={() => handleEditPower(power)}
          />
        ))}
      </Stack>

      {adeptPowerFormDialog.dialog}
    </Stack>
  )
}
