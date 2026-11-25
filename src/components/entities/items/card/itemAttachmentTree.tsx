import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { RiMore2Line } from "@remixicon/react"
import type { FC, MouseEvent } from "react"

import { useItemActionsDialogContext } from "#/components/entities/items/actions/itemActionsDialogContext.ts"
import { CardElementSubitem } from "#/components/ui/cards/entityCard/elements/cardElementSubitem.tsx"
import { useItemSelectionMode } from "#/hooks/items/selection/useItemSelection.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { isCredential } from "#/system/model/entities/entityTraits.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { ItemAttachmentSelectCheckbox } from "./itemAttachmentSelectCheckbox.tsx"

interface ItemAttachmentTreeProps {
  itemId: UUID
}

function getRatingStats(item: ItemData) {
  if (isCredential(item) && item.isReal) return [{ label: "Rating", value: "Real" }]
  return item.rating !== undefined ? [{ label: "Rating", value: item.rating }] : []
}

/**
 * Every Attachment of an Item, and theirs in turn, one row each and indented by depth. Inside an
 * `ItemActionsDialogProvider` each row has a button opening that Attachment's actions. While the gear
 * list is in selection mode, each row has a checkbox selecting that Attachment independently of its parent instead. Renders
 * nothing for an Item with no Attachments.
 */
export const ItemAttachmentTree: FC<ItemAttachmentTreeProps> = ({ itemId }) => {
  const attachments = useRunnerSelector(ItemSelectors.selectChildListOf, { itemId })
  const itemActionsDialog = useItemActionsDialogContext()
  const { isSelecting } = useItemSelectionMode()

  if (attachments.length === 0) return null

  const openActions = (event: MouseEvent, attachment: ItemData) => {
    // The row sits inside its parent's card, which opens the parent's details when tapped.
    event.stopPropagation()
    void itemActionsDialog?.open({ item: attachment })
  }

  return (
    <Stack sx={{ gap: 0.25 }}>
      {attachments.map((attachment) => (
        <Stack key={attachment.id} sx={{ gap: 0.25 }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", minHeight: 28 }}>
            <CardElementSubitem name={attachment.name} stats={getRatingStats(attachment)} />

            {isSelecting && <ItemAttachmentSelectCheckbox attachment={attachment} />}

            {!isSelecting && itemActionsDialog && (
              <IconButton
                size="small"
                aria-label={`${attachment.name} actions`}
                onClick={(event) => openActions(event, attachment)}
                sx={{ padding: 0.25 }}
              >
                <RiMore2Line size={16} />
              </IconButton>
            )}
          </Stack>

          {attachment.items.childIds.length > 0 && (
            <Stack sx={{ paddingLeft: 1.5, borderLeft: "1px solid", borderColor: "divider" }}>
              <ItemAttachmentTree itemId={attachment.id} />
            </Stack>
          )}
        </Stack>
      ))}
    </Stack>
  )
}
