import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import type { RemixiconComponentType } from "@remixicon/react"
import {
  RiArchive2Line,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiEditLine,
  RiHandCoinLine,
  RiInboxUnarchiveLine,
} from "@remixicon/react"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useEditorMode } from "#/contexts/builder/editorMode.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { getItemState } from "#/system/formulas/items/itemStateRules.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { Icons } from "#/utils/icons.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

import { getItemActions, getItemStateDisplayLabel, ItemAction } from "./itemActions.ts"

const actionDisplay: Record<ItemAction, { label: string, icon: RemixiconComponentType }> = {
  [ItemAction.equip]: { label: "Equip", icon: RiCheckboxCircleLine },
  [ItemAction.unequip]: { label: "Unequip", icon: RiCloseCircleLine },
  [ItemAction.implant]: { label: "Implant", icon: Icons.item.state.implant },
  [ItemAction.extract]: { label: "Extract", icon: Icons.item.state.extract },
  [ItemAction.stash]: { label: "Stash", icon: RiArchive2Line },
  [ItemAction.unstash]: { label: "Unstash", icon: RiInboxUnarchiveLine },
  [ItemAction.consume]: { label: "Consume", icon: Icons.item.state.consume },
  [ItemAction.endEffect]: { label: "End Effect", icon: Icons.item.state.endEffect },
  [ItemAction.bond]: { label: "Bond", icon: Icons.item.bond },
  [ItemAction.unbond]: { label: "Unbond", icon: Icons.item.unbond },
  [ItemAction.attack]: { label: "Attack", icon: Icons.item.attack },
  [ItemAction.run]: { label: "Run", icon: Icons.item.run },
  [ItemAction.edit]: { label: "Edit", icon: RiEditLine },
  [ItemAction.sell]: { label: "Sell", icon: RiHandCoinLine },
  [ItemAction.delete]: { label: "Delete", icon: RiDeleteBinLine },
}

interface ItemActionsDialogProps extends ControlledDialogProps<ItemAction> {
  item: ItemData
}

const ItemActionsDialog: FC<ItemActionsDialogProps> = ({ ctrl, item }) => {
  const { isViewer } = useEditorMode()
  const parent = useRunnerSelector(ItemSelectors.selectById, { itemId: item.items.parentId ?? NullUuid })

  const actions = getItemActions(item, {
    isAttachment: !!parent,
    parentState: parent ? getItemState(parent) : undefined,
    isViewer,
  })

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs">
      <Dialog.Title>{item.name}</Dialog.Title>

      <Dialog.Content>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {parent
            ? `${getItemStateDisplayLabel(item)} · attached to ${parent.name} (${getItemStateDisplayLabel(parent)})`
            : getItemStateDisplayLabel(item)}
        </Typography>

        <List aria-label="Item actions">
          {actions.map((action) => {
            const { label, icon: Icon } = actionDisplay[action]
            const color = action === ItemAction.delete ? "error.main" : undefined

            return (
              <ListItemButton key={action} onClick={() => ctrl.close(action)} sx={{ color }}>
                <ListItemIcon sx={{ color }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            )
          })}
        </List>
      </Dialog.Content>

      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Close</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseItemActionsDialogProps = Omit<ItemActionsDialogProps, keyof ControlledDialogProps<ItemAction>>

/** Opens a list of everything the Player can do with an Item. Resolves to the chosen action. */
export const useItemActionsDialog = () => useDialog<ItemAction, UseItemActionsDialogProps>(
  (ctrl, props) => <ItemActionsDialog ctrl={ctrl} {...props} />,
)
