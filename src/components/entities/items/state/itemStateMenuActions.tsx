import type { FC } from "react"

import { EntityCard } from "#/components/ui/cards/entityCard/entityCard.tsx"
import { useItemStateActions } from "#/hooks/items/state/useItemStateActions.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"

export interface ItemStateMenuActionsProps {
  item: ItemData
  /** Called after an action runs, e.g. to close the menu it sits in. */
  onDone: () => void
}

/** The state actions (Equip, Stash, ...) valid for `item`, as entries in a card's actions menu. */
export const ItemStateMenuActions: FC<ItemStateMenuActionsProps> = ({ item, onDone }) => {
  const actions = useItemStateActions(item)

  return actions.map(({ action, label, icon: Icon, disabled, onClick }) => (
    <EntityCard.Action
      key={action}
      label={label}
      icon={<Icon size={16} />}
      disabled={disabled}
      onClick={() => {
        onClick()
        onDone()
      }}
    />
  ))
}
