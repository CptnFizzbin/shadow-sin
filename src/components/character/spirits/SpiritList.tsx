import { useSelector } from "@tanstack/react-store"
import Stack from "@mui/material/Stack"
import { useState } from "react"
import type { FC } from "react"

import { ItemList } from "#/components/items/card/itemList.tsx"
import { SpiritItemCard } from "#/components/character/spirits/SpiritItemCard.tsx"
import { TraditionDisplay } from "#/components/character/spirits/TraditionDisplay.tsx"
import { useSpiritsStore } from "#/components/character/spirits/useSpiritsStore.ts"
import { selectAllSpirits } from "#/components/character/spirits/spiritsSelectors.ts"
import { SpiritFormDialog } from "#/components/character/spirits/dialogs/SpiritFormDialog.tsx"
import type { SpiritData } from "#/system/magic/spiritData.ts"

export const SpiritList: FC = () => {
  const spiritsStore = useSpiritsStore()
  const spirits = useSelector(spiritsStore, selectAllSpirits)

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
    if (result) spiritsStore.save(result)
    setDialogOpen(false)
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
            onRemove={() => spiritsStore.remove(spirit.id)}
          />
        ))}
      </Stack>

      <SpiritFormDialog
        open={dialogOpen}
        spirit={editingSpirit}
        onClose={handleClose}
        onClosed={() => setEditingSpirit(undefined)}
      />
    </Stack>
  )
}
