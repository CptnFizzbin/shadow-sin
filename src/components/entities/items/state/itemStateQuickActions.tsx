import type { FC } from "react"

import { ItemDetailsQuickAction } from "#/components/entities/items/details/itemDetails.QuickAction.tsx"
import { useItemStateActions } from "#/hooks/items/state/useItemStateActions.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"

export interface ItemStateQuickActionsProps {
  item: ItemData
}

/** The state actions (Equip, Stash, ...) valid for `item`, as quick-action buttons on its details page. */
export const ItemStateQuickActions: FC<ItemStateQuickActionsProps> = ({ item }) => {
  const actions = useItemStateActions(item)

  return actions.map(({ action, label, icon: Icon, disabled, onClick }) => (
    <ItemDetailsQuickAction
      key={action}
      label={label}
      icon={<Icon size={16} />}
      disabled={disabled}
      onClick={onClick}
    />
  ))
}
