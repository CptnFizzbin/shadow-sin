import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { PowerPoints } from "#/components/builder/powerPoints.tsx"
import { PowerCard } from "#/components/ui/cards/powerCard/powerCard.tsx"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { PowersSelectors } from "#/state/runner/powers/powers.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { AdeptPowerData } from "#/system/model/powers/adeptPowerData.ts"

import { useAdeptPowerFormDialog } from "./dialogs/adeptPowerFormDialog.tsx"

export const AdeptPowersViewerSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const adeptPowers = useRunnerSelector(PowersSelectors.selectAll)
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
