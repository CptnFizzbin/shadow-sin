import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { CredstickCard } from "#/components/finances/credsticks/credstickCard.tsx"
import type { CredstickDialogMode } from "#/components/finances/credsticks/credstickDialog.tsx"
import { CredstickDialog } from "#/components/finances/credsticks/credstickDialog.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import { Label } from "#/components/ui/text/label.tsx"
import type { CredstickData } from "#/lib/system/gear/credstickData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

type DialogState = { open: boolean, mode: CredstickDialogMode, credstick?: CredstickData } | null

export const CredstickSection: FC = () => {
  const credsticks = useGearByType<CredstickData>(ItemType.credstick)
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const handleCardClick = (credstick: CredstickData) => {
    setDialogState({ open: true, mode: "edit", credstick })
  }

  return (

    <Stack gap={1}>
      <Label label="Credsticks" />

      {credsticks.length === 0
        ? (
            <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
              No credsticks
            </Typography>
          )
        : (
            <Stack gap={0.5}>
              {credsticks.map((credstick) => (
                <CredstickCard
                  key={credstick.id}
                  credstick={credstick}
                  onClick={handleCardClick}
                />
              ))}
            </Stack>
          )}

      <Stack direction="row" gap={1}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RiAddLine size={14} />}
          onClick={() => setDialogState({ open: true, mode: "add-certified" })}
          fullWidth
        >
          Create
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RiAddLine size={14} />}
          onClick={() => setDialogState({ open: true, mode: "add" })}
          fullWidth
        >
          Receive
        </Button>
      </Stack>

      {dialogState !== null && (
        <CredstickDialog
          open={dialogState.open}
          mode={dialogState.mode}
          credstick={dialogState.credstick}
          onClose={() => setDialogState((prev) => prev && { ...prev, open: false })}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
