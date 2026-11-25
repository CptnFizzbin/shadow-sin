import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useItemActionsDialogContext } from "#app/components/entities/items/actions/itemActionsDialogContext.ts"
import { ItemDetailsRoot } from "#app/components/entities/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#app/components/entities/items/details/itemDetailsSlot.tsx"
import { useFocusBonding } from "#app/hooks/items/types/magical/useFocusBonding.tsx"
import { NullUuid } from "#common/uuid/uuidUtils.ts"
import type { FocusData } from "#data/items/magicalData.ts"
import { getFocusBondingCost } from "#rules/magic/focusRules.ts"
import { isNewItem } from "#state/runner/items/items.actions.ts"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"
import { Icons } from "#ui/icons/icons.ts"
import { Label } from "#ui/text/label.tsx"

import { useFocusFormDialog } from "./dialogs/focusFormDialog.tsx"
import { getFocusBonusDescription, getFocusLinkLabel } from "./focusDescriptions.ts"

export interface FocusItemDetailsProps {
  focus: FocusData
  onRemoved?: () => void
}

/** Item details view for a Focus, with Bond as a quick action until it's Bonded. */
export const FocusItemDetails: FC<FocusItemDetailsProps> = ({ focus, onRemoved }) => {
  const dispatch = useRunnerStoreDispatch()
  const focusFormDialog = useFocusFormDialog()
  const focusBonding = useFocusBonding()
  const itemActionsDialog = useItemActionsDialogContext()
  const parent = useRunnerSelector(ItemSelectors.selectById, { itemId: focus.items.parentId ?? NullUuid })

  const removeFocus = () => {
    dispatch(Actions.item.removeItem({ id: focus.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await focusFormDialog.open({ focus })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  const linkLabel = getFocusLinkLabel(focus, parent?.name)
  const bondingCost = getFocusBondingCost(focus)

  return (
    <>
      <ItemDetailsRoot item={focus} type={`${focus.focusType} Focus`} onEdit={handleEdit} onRemove={removeFocus}>
        <ItemDetailsSlot.Stat label="Force" value={focus.force} />
        {linkLabel ? <ItemDetailsSlot.Stat label="Linked To" value={linkLabel} /> : null}
        <ItemDetailsSlot.Stat label="Bonding Cost" value={`${bondingCost} Karma`} />

        {focus.bonded && <ItemDetailsSlot.Status icon={Icons.item.bond} label="Bonded" color="primary" />}

        {/* Without the actions dialog, the page already lists every action — Bond included. */}
        {itemActionsDialog && !focus.bonded && (
          <ItemDetailsSlot.QuickAction
            label={`Bond (${bondingCost} Karma)`}
            icon={<Icons.item.bond size={16} />}
            onClick={() => focusBonding.bond(focus)}
          />
        )}

        <ItemDetailsSlot.Section>
          <Label label="Effect" />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {getFocusBonusDescription(focus, parent?.name)}
            {focus.bonded ? " while equipped." : ". Bond the focus to use it."}
          </Typography>
        </ItemDetailsSlot.Section>
      </ItemDetailsRoot>

      {focusFormDialog.outlet}
      {focusBonding.outlet}
    </>
  )
}
