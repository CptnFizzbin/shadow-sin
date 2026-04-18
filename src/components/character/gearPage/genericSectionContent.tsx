import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearViewItem } from "#/components/character/gearPage/gearViewItem.tsx"
import { GearItemFormDialog } from "#/components/gear/dialogs/gearItemFormDialog.tsx"
import { useGearStore } from "#/components/gear/useGearApi.ts"
import type { ItemData } from "#/lib/system/itemData.ts"
import type { ItemType } from "#/lib/system/itemType.ts"

type GenericDialogState = null | { open: boolean }

interface GenericSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
  itemLabel: string
  itemType?: ItemType
}

export const GenericSectionContent: FC<GenericSectionContentProps> = ({
  items,
  getChildren,
  itemLabel,
  itemType,
}) => {
  const gearStore = useGearStore()
  const [dialogState, setDialogState] = useState<GenericDialogState>(null)

  const closeDialog = () => setDialogState((prev) => prev && { ...prev, open: false })

  const handleSave = (item: ItemData) => {
    gearStore.save(item)
    closeDialog()
  }

  return (
    <Stack gap={1}>
      {items.map((item) => (
        <GearViewItem key={item.id} item={item} subItems={getChildren(item.id)} />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ open: true })}
        color="secondary"
        fullWidth
      >
        Add {itemLabel}
      </Button>

      {dialogState && (
        <GearItemFormDialog
          open={dialogState.open}
          itemType={itemType}
          label={itemLabel}
          onSave={handleSave}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
