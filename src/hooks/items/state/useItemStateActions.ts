import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import {
  getItemState,
  getItemStateActions,
  isItemStateWithinParent,
  ItemStateAction,
  itemStateActionTargets,
} from "#/system/formulas/items/itemStateRules.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { IconComponent } from "#/utils/icons.ts"
import { Icons } from "#/utils/icons.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

/** One state change an Item's action menu offers. */
export interface ItemStateActionOption {
  action: ItemStateAction
  label: string
  icon: IconComponent
  /** Set when the Item's parent is less present than the target state (e.g. Unstash under a Stashed parent). */
  disabled: boolean
  onClick: () => void
}

const actionLabels: Record<ItemStateAction, string> = {
  [ItemStateAction.equip]: "Equip",
  [ItemStateAction.unequip]: "Unequip",
  [ItemStateAction.implant]: "Implant",
  [ItemStateAction.extract]: "Extract",
  [ItemStateAction.stash]: "Stash",
  [ItemStateAction.unstash]: "Unstash",
}

/** The state actions (Equip, Unequip, Implant, Extract, Stash, Unstash) valid for `item` right now. */
export function useItemStateActions(item: ItemData): ItemStateActionOption[] {
  const dispatch = useRunnerStoreDispatch()
  const parent = useRunnerSelector(ItemSelectors.selectById, { itemId: item.items.parentId ?? NullUuid })
  const parentState = parent ? getItemState(parent) : undefined

  return getItemStateActions(item).map((action) => {
    const target = itemStateActionTargets[action]
    return {
      action,
      label: actionLabels[action],
      icon: Icons.item.state[action],
      disabled: !isItemStateWithinParent(target, parentState),
      onClick: () => dispatch(Actions.item.setState({ id: item.id, state: target })),
    }
  })
}
