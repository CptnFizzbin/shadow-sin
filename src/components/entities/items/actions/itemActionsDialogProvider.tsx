import type { FC, PropsWithChildren } from "react"

import { useWeaponAttackDialog } from "#/components/entities/items/types/weapons/dialogs/weaponAttackDialog.tsx"
import { useRunProgramDialog } from "#/components/system/matrix/dialogs/runProgramDialog.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import type { WeaponData } from "#/system/model/items/weaponData.ts"

import { ItemAction } from "./itemActions.ts"
import { useItemActionsDialog } from "./itemActionsDialog.tsx"
import type { ItemActionsDialogOpenOptions } from "./itemActionsDialogContext.ts"
import { ItemActionsDialogContext } from "./itemActionsDialogContext.ts"
import { useSellItemDialog } from "./sellItemDialog.tsx"
import { useEditItemDialog } from "./useEditItemDialog.tsx"

/**
 * Provides the Item actions dialog to the subtree via `ItemActionsDialogContext`, carries out
 * whichever action the Player picks, and renders every dialog those actions open. Mount inside
 * `AddItemDialogProvider`, since the edit forms it opens can add Attachments.
 */
export const ItemActionsDialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useRunnerStoreDispatch()
  const itemActionsDialog = useItemActionsDialog()
  const editItemDialog = useEditItemDialog()
  const sellItemDialog = useSellItemDialog()
  const weaponAttackDialog = useWeaponAttackDialog()
  const runProgramDialog = useRunProgramDialog()
  const confirmDialog = useConfirmDialog()

  const open = async ({ item, onEdit, onRemoved }: ItemActionsDialogOpenOptions) => {
    const action = await itemActionsDialog.open({ item })
    if (!action) return

    switch (action) {
      case ItemAction.equip:
      case ItemAction.unequip:
        dispatch(Actions.item.setEquipped({ id: item.id, equipped: action === ItemAction.equip }))
        break

      case ItemAction.stash:
      case ItemAction.unstash:
        dispatch(Actions.item.setStashed({ id: item.id, stashed: action === ItemAction.stash }))
        break

      case ItemAction.attack:
        // `getItemActions` only offers Attack for weapons.
        await weaponAttackDialog.open({ weapon: item as WeaponData })
        break

      case ItemAction.run:
        // `getItemActions` only offers Run for Programs.
        await runProgramDialog.open({ program: item as ProgramData })
        break

      case ItemAction.edit:
        if (onEdit) onEdit()
        else await editItemDialog.open(item)
        break

      case ItemAction.sell:
        if (await sellItemDialog.open({ item })) onRemoved?.()
        break

      case ItemAction.delete: {
        const confirmed = await confirmDialog.confirm({
          title: `Delete ${item.name}?`,
          body: "This removes it and its attachments from your gear. It can't be undone.",
          confirmLabel: "Delete",
        })
        if (confirmed) {
          dispatch(Actions.item.removeItem({ id: item.id, removeChildren: true }))
          onRemoved?.()
        }
        break
      }
    }
  }

  return (
    <ItemActionsDialogContext.Provider value={{ open }}>
      {children}
      {itemActionsDialog.outlet}
      {editItemDialog.outlet}
      {sellItemDialog.outlet}
      {weaponAttackDialog.outlet}
      {runProgramDialog.outlet}
      {confirmDialog.outlet}
    </ItemActionsDialogContext.Provider>
  )
}
