import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { PowerCard } from "#/components/powerCard/powerCard.tsx"
import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import { usePowerPoints } from "#/hooks/runner/adeptPowers/adeptPowersHooks.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

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
    <Stack>
      <PowerPoints value={powerPoints.used} total={powerPoints.max} />

      <Stack sx={{ gap: 0.5 }}>
        {adeptPowers.map((power) => (
          <PowerCard
            key={power.id}
            power={power}
            onOpen={() => handleEditPower(power)}
          />
        ))}
      </Stack>

      {adeptPowerFormDialog.outlet}
    </Stack>
  )
}
