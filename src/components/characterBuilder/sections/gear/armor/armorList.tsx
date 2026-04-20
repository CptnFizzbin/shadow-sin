import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { ArmorFormDialog } from "#/components/gear/armor/dialogs/armorFormDialog.tsx"
import { ItemCard } from "#/components/gear/itemCard.tsx"
import { useGearStore, useGearByType } from "#/components/gear/useGearApi.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

type ArmorDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", armor: ArmorData, open: boolean }

export const ArmorList: FC = () => {
  const gearApi = useGearStore()
  const armorItems = useGearByType<ArmorData>(ItemType.armor)
  const [dialogState, setDialogState] = useState<ArmorDialogState>(null)

  const closeDialog = () =>
    setDialogState((prev) => prev && { ...prev, open: false })

  const handleAdd = (armor: ArmorData) => {
    gearApi.save(armor)
    closeDialog()
  }

  const handleUpdate = (armor: ArmorData) => {
    gearApi.save(armor)
    closeDialog()
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {armorItems.map((armor) => (
        <Box key={armor.id}>
          <ItemCard
            item={armor}
            onEdit={() => setDialogState({ mode: "edit", armor, open: true })}
            onRemove={() => gearApi.remove(armor)}
          />
        </Box>
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ mode: "create", open: true })}
        color="secondary"
        fullWidth
      >
        Add Armor
      </Button>

      {dialogState?.mode === "create" && (
        <ArmorFormDialog
          open={dialogState.open}
          onSave={handleAdd}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}

      {dialogState?.mode === "edit" && (
        <ArmorFormDialog
          open={dialogState.open}
          armor={dialogState.armor}
          onSave={handleUpdate}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
