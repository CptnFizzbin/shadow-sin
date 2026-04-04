import { Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { AdeptPowerFormDialog } from "#/components/AdeptPowers/Dialogs/adept-power-form-dialog.tsx"
import { usePowerPoints } from "#/components/AdeptPowers/adept-powers-hooks.ts"
import { useAdeptPowersStore } from "#/components/AdeptPowers/use-adept-powers-store.ts"
import { AdeptPowersListItem } from "#/components/CharacterBuilder/Sections/Resources/Adept/adept-powers-list-item.tsx"
import { PowerPoints } from "#/components/UI/power-points.tsx"
import type { AdeptPowerData } from "#/lib/system/magic/adept-power-data.ts"

type DialogState =
  | null
  | { open: boolean, type: "add" }
  | { open: boolean, type: "edit", power: AdeptPowerData }

export const AdeptPowersList: FC = () => {
  const adeptPowersStore = useAdeptPowersStore()
  const adeptPowers = useStore(adeptPowersStore, (state) => state)
  const powerPoints = usePowerPoints()
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const addPower = (power: AdeptPowerData) =>
    adeptPowersStore.add({ ...power, id: crypto.randomUUID() })
  const updatePower = (power: AdeptPowerData) => adeptPowersStore.update(power)
  const removePower = (power: AdeptPowerData) => adeptPowersStore.remove(power.id)

  return (
    <Stack gap={1}>
      <PowerPoints value={powerPoints.used} total={powerPoints.max} />

      {adeptPowers.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No adept powers added yet.
        </Typography>
      )}

      {adeptPowers.map((power) => (
        <AdeptPowersListItem
          key={power.id}
          power={power}
          onEdit={() => setDialogState({ type: "edit", open: true, power })}
        />
      ))}

      <Button
        startIcon={<RiAddLine />}
        color="secondary"
        variant="outlined"
        onClick={() => setDialogState({ type: "add", open: true })}
      >
        Add Power
      </Button>

      {dialogState?.type === "add" && (
        <AdeptPowerFormDialog
          open={dialogState.open}
          onSave={addPower}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}

      {dialogState?.type === "edit" && (
        <AdeptPowerFormDialog
          open={dialogState.open}
          power={dialogState.power}
          onSave={updatePower}
          onDelete={() => removePower(dialogState.power)}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}
    </Stack>
  )
}
