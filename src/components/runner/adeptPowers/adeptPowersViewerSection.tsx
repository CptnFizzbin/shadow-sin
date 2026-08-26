import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { PowerCard } from "#/components/powerCard/powerCard.tsx"
import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { PowersSelectors } from "#/stores/runner/powers/powersSlice.selectors.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerSelector, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

import { useAdeptPowerFormDialog } from "./dialogs/adeptPowerFormDialog.tsx"

export const AdeptPowersViewerSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const adeptPowers = useRunnerStoreSelector(Selectors.powers.selectPowers)
  const powerPointsUsed = useRunnerSelector(PowersSelectors.selectUsed)
  const powerPointsMax = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.magic })
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
      <PowerPoints value={powerPointsUsed} total={powerPointsMax} />

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
