import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ItemActionsDialogContext } from "#app/components/entities/items/actions/itemActionsDialogContext.ts"
import { useAddItemDialogContext } from "#app/components/entities/items/addItemDialogContext.ts"
import { AnyItemCard } from "#app/components/ui/cards/itemCard/anyItemCard.tsx"
import type { UUID } from "#common/uuid/uuidUtils.ts"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"
import { Icons } from "#ui/icons/icons.ts"

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
      {/* The parent's form is still open, so acting on an Attachment here would leave the form's
          own copy of its Attachment list out of date. */}
      <ItemActionsDialogContext.Provider value={null}>
        {Object.values(subitems).map((subitem) => (
          <AnyItemCard key={subitem.id} item={subitem} />
        ))}
      </ItemActionsDialogContext.Provider>

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
