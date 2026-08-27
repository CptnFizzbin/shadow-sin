import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { PowerCard } from "#/components/powerCard/powerCard.tsx"
import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { PowersSelectors } from "#/stores/runner/powers/powersSlice.selectors.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

import { useAdeptPowerFormDialog } from "./dialogs/adeptPowerFormDialog.tsx"

export const AdeptPowersList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const adeptPowers = useRunnerSelector(PowersSelectors.selectAll)
  const powerPointsUsed = useRunnerSelector(PowersSelectors.selectUsed)
  const powerPointsMax = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.magic })
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
    <Stack>
      <PowerPoints value={powerPointsUsed} total={powerPointsMax} />

      {adeptPowers.length === 0 && (
        <Typography color="text.secondary">
          No adept powers added yet.
        </Typography>
      )}

      {adeptPowers.map((power) => (
        <PowerCard
          key={power.id}
          power={power}
          onOpen={() => handleEditPower(power)}
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

      {adeptPowerFormDialog.outlet}
    </Stack>
  )
}
