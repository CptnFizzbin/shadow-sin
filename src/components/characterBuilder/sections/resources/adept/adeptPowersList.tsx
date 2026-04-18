import { Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { usePowerPoints } from "#/components/adeptPowers/adeptPowersHooks.ts"
import { AdeptPowerFormDialog } from "#/components/adeptPowers/dialogs/adeptPowerFormDialog.tsx"
import { useAdeptPowersStore } from "#/components/adeptPowers/useAdeptPowersStore.ts"
import { AdeptPowersListItem } from "#/components/characterBuilder/sections/resources/adept/adeptPowersListItem.tsx"
import { PowerPoints } from "#/components/ui/powerPoints.tsx"
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

  const savePower = (power: AdeptPowerData) => adeptPowersStore.save(power)
  const removePower = (power: AdeptPowerData) => adeptPowersStore.remove(power.id)

  return (
    <Stack sx={{ gap: 1 }}>
      <PowerPoints value={powerPoints.used} total={powerPoints.max} />

      {adeptPowers.length === 0 && (
        <Typography color="text.secondary">
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
          onSave={savePower}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}

      {dialogState?.type === "edit" && (
        <AdeptPowerFormDialog
          open={dialogState.open}
          power={dialogState.power}
          onSave={savePower}
          onDelete={() => removePower(dialogState.power)}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}
    </Stack>
  )
}
