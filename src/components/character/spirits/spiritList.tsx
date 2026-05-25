import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import { produce } from "immer"
import type { FC } from "react"
import { useState } from "react"

import { ItemList } from "#/components/items/card/itemList.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import { SpiritDataSchema } from "#/system/magic/spiritData.ts"

import { SpiritFormDialog } from "./dialogs/spiritFormDialog.tsx"
import { SpiritItemCard } from "./spiritItemCard.tsx"
import { selectAllSpirits } from "./spiritsSelectors.ts"
import { TraditionDisplay } from "./traditionDisplay.tsx"
import { useSpiritsStore } from "./useSpiritsStore.ts"

export const SpiritList: FC = () => {
  const spiritsStore = useSpiritsStore()
  const spirits = useSelector(spiritsStore, selectAllSpirits)
  const confirmDialog = useConfirmDialog()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSpirit, setEditingSpirit] = useState<SpiritData | undefined>()
  // Bumped on each Add so the dialog remounts between successive new spirits
  // (otherwise useSpiritForm reuses the same generated id and the save overwrites).
  const [addCounter, setAddCounter] = useState(0)

  const handleAdd = () => {
    setEditingSpirit(undefined)
    setAddCounter((n) => n + 1)
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
            onDamageChange={(damage) => spiritsStore.save(produce(spirit, (draft) => { draft.damage = damage }))}
          />
        ))}
      </Stack>

      <SpiritFormDialog
        key={editingSpirit?.id ?? `new-${addCounter}`}
        open={dialogOpen}
        spirit={editingSpirit}
        onClose={handleClose}
        onClosed={() => setEditingSpirit(undefined)}
      />
    </Stack>
  )
}
