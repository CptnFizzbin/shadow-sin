import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearViewItem } from "#/components/character/gearPage/gearViewItem.tsx"
import { GearItemFormDialog } from "#/components/characterBuilder/sections/gear/generic/dialogs/gearItemFormDialog.tsx"
import { useGearPurchase } from "#/components/gear/useGearPurchase.ts"
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
  const { acquire, purchase } = useGearPurchase()
  const [dialogState, setDialogState] = useState<GenericDialogState>(null)

  const closeDialog = () => setDialogState((prev) => prev && { ...prev, open: false })

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
          onAcquire={(item: ItemData) => acquire(item, closeDialog)}
          onPurchase={(item: ItemData) => purchase(item, item.cost ?? 0, closeDialog)}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
