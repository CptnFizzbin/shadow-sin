import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { SpiritFormDialog } from "#/components/character/spirits/dialogs/spiritFormDialog.tsx"
import { SpiritItemCard } from "#/components/character/spirits/spiritItemCard.tsx"
import { selectAllSpirits } from "#/components/character/spirits/spiritsSelectors.ts"
import { TraditionDisplay } from "#/components/character/spirits/traditionDisplay.tsx"
import { useSpiritsStore } from "#/components/character/spirits/useSpiritsStore.ts"
import { useConfirmDialog } from "#/components/dialogs/confirmDialog.tsx"
import { ItemList } from "#/components/items/card/itemList.tsx"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import { SpiritDataSchema } from "#/system/magic/spiritData.ts"

export const SpiritList: FC = () => {
  const spiritsStore = useSpiritsStore()
  const spirits = useSelector(spiritsStore, selectAllSpirits)
  const confirmDialog = useConfirmDialog()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSpirit, setEditingSpirit] = useState<SpiritData | undefined>()

  const handleAdd = () => {
    setEditingSpirit(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (spirit: SpiritData) => {
    setEditingSpirit(spirit)
    setDialogOpen(true)
  }

  const handleClose = (result?: SpiritData) => {
    if (result) spiritsStore.save(SpiritDataSchema.parse(result))
    setDialogOpen(false)
  }

  const handleRemove = async (spirit: SpiritData) => {
    if (await confirmDialog.confirm({
      title: `Dismiss ${spirit.name}?`,
      body: "Are you sure you want to dismiss this spirit? This action cannot be undone.",
      confirmLabel: "Dismiss",
    })) {
      spiritsStore.remove(spirit.id)
    }
  }

  return (
    <Stack sx={{ gap: 2 }}>
      <TraditionDisplay />

      <Stack sx={{ gap: 1 }}>
        <ItemList.AddItemButton onClick={handleAdd}>Summon Spirit</ItemList.AddItemButton>
        {spirits.map((spirit) => (
          <SpiritItemCard
            key={spirit.id}
            spirit={spirit}
            onEdit={() => handleEdit(spirit)}
            onRemove={() => handleRemove(spirit)}
          />
        ))}
      </Stack>

      <SpiritFormDialog
        key={editingSpirit?.id ?? "new"}
        open={dialogOpen}
        spirit={editingSpirit}
        onClose={handleClose}
        onClosed={() => setEditingSpirit(undefined)}
      />
    </Stack>
  )
}
