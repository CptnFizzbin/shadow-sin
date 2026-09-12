import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AnyItemCard } from "#/components/itemCard/anyItemCard.tsx"
import { useAddItemDialogContext } from "#/contexts/items/addItemDialogContext.ts"
import { Icons } from "#/lib/icons.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

interface ItemDialogSubitemsTabProps {
  itemId: UUID
}

/**
 * "Subitems" tab body for `ItemDialog`'s Edit mode — a card for every gear item currently
 * attached to this item, plus an "Add Item" button that opens the Add Item workflow with
 * this item pre-filled as the new item's parent. Reads the workflow from
 * `AddItemDialogContext` rather than calling `useAddItemDialog` directly — that hook imports
 * every concrete gear type's `*FormDialog`, which `ItemDialog` (this tab's host) is itself
 * shared by, so calling it here would be a dependency cycle.
 */
export const ItemDialogSubitemsTab: FC<ItemDialogSubitemsTabProps> = ({ itemId }) => {
  const subitems = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId })
  const addItemDialog = useAddItemDialogContext()

  return (
    <Stack sx={{ gap: 1 }}>
      {Object.values(subitems).map((subitem) => (
        <AnyItemCard key={subitem.id} item={subitem} />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<Icons.item.add />}
        onClick={() => addItemDialog.open({ parentId: itemId })}
        color="secondary"
        fullWidth
      >
        Add Item
      </Button>
    </Stack>
  )
}
