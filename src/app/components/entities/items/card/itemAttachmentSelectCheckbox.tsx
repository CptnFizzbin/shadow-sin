import Checkbox from "@mui/material/Checkbox"
import type { FC } from "react"

import { useItemSelectionToggle } from "#app/hooks/items/selection/useItemSelection.ts"
import type { ItemData } from "#data/items/itemData.ts"

interface ItemAttachmentSelectCheckboxProps {
  attachment: ItemData
}

/** Selects or deselects one Attachment row while the gear list is in selection mode. */
export const ItemAttachmentSelectCheckbox: FC<ItemAttachmentSelectCheckboxProps> = ({ attachment }) => {
  const selectionToggle = useItemSelectionToggle(attachment.id)
  if (!selectionToggle) return null

  return (
    <Checkbox
      size="small"
      color="secondary"
      checked={selectionToggle.isSelected}
      onChange={selectionToggle.toggle}
      // The row sits inside its parent's card, which toggles the parent when tapped.
      onClick={(event) => event.stopPropagation()}
      slotProps={{ input: { "aria-label": `Select ${attachment.name}` } }}
      sx={{ padding: 0.25 }}
    />
  )
}
