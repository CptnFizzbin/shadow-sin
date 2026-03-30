import { Button } from "@mui/material"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { AdeptPowerFormDialog } from "#/components/AdeptPowers/Dialogs/AdeptPowerFormDialog.tsx"
import { usePowerPoints } from "#/components/CharacterBuilder/Sections/Resources/Adept/AdeptPowersHooks.ts"
import { AdeptPowersListItem } from "#/components/CharacterBuilder/Sections/Resources/Adept/AdeptPowersListItem.tsx"
import { useAdeptPowersStore } from "#/components/CharacterBuilder/Sections/Resources/Adept/UseAdeptPowersStore.ts"
import { PowerPoints } from "#/components/UI/PowerPoints.tsx"
import type { AdeptPowerData } from "#/lib/system/magic/adeptPowerData.ts"

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
    <Paper sx={{ padding: 1 }}>
      <Stack gap={1}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Adept Powers
        </Typography>

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
      </Stack>

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
    </Paper>
  )
}
