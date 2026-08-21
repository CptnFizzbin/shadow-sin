import Stack from "@mui/material/Stack"
import { produce } from "immer"
import type { FC } from "react"
import { useState } from "react"

import { ItemList } from "#/components/items/card/itemList.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { SpiritsSelectors } from "#/lib/stores/runner/spirits/spiritsSlice.selectors.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import { SpiritDataSchema } from "#/system/magic/spiritData.ts"

import { SpiritFormDialog } from "./dialogs/spiritFormDialog.tsx"
import { SpiritDataCard } from "./spiritDataCard.tsx"

export const SpiritList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const spirits = useRunnerSelector(SpiritsSelectors.selectAll)
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
    if (result) dispatch(Actions.spirits.saveSpirit(SpiritDataSchema.parse(result)))
    setDialogOpen(false)
  }

  const handleRemove = async (spirit: SpiritData) => {
    if (await confirmDialog.confirm({
      title: `Dismiss ${spirit.name}?`,
      body: "Are you sure you want to dismiss this spirit? This action cannot be undone.",
      confirmLabel: "Dismiss",
    })) {
      dispatch(Actions.spirits.removeSpirit(spirit.id))
    }
  }

  return (
    <>
      <Stack>
        <ItemList.AddItemButton onClick={handleAdd}>Summon Spirit</ItemList.AddItemButton>
        {spirits.map((spirit) => (
          <SpiritDataCard
            key={spirit.id}
            spirit={spirit}
            onEdit={() => handleEdit(spirit)}
            onRemove={() => handleRemove(spirit)}
            onDamageChange={(damage) => dispatch(Actions.spirits.saveSpirit(produce(spirit, (draft) => { draft.damage = damage })))}
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

      {confirmDialog.dialog}
    </>
  )
}
