import type { FC } from "react"

import type { EntityCardLeftAction } from "#/components/ui/cards/entityCard/entityCard.tsx"
import { ItemCard } from "#/components/ui/cards/itemCard/itemCard.tsx"
import { useFocusBonding } from "#/hooks/items/types/magical/useFocusBonding.tsx"
import { useFocusEquipAction } from "#/hooks/items/types/magical/useFocusPrimaryAction.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { getFocusBondingCost } from "#/system/formulas/magic/focusRules.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"
import { Icons } from "#/utils/icons.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

import { getFocusBonusDescription, getFocusLinkLabel } from "./focusDescriptions.ts"

interface FocusDataCardProps {
  focus: FocusData
  onOpen?: () => void
  onEdit?: () => void
}

/** Card for a Focus, with Bond as its primary action until it's Bonded, then Equip / Unequip. */
export const FocusDataCard: FC<FocusDataCardProps> = ({ focus, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const focusBonding = useFocusBonding()
  const equipAction = useFocusEquipAction(focus)
  const parent = useRunnerSelector(ItemSelectors.selectById, { itemId: focus.items.parentId ?? NullUuid })

  const removeFocus = () => dispatch(Actions.item.removeItem({ id: focus.id, removeChildren: true }))

  // The card's edge button has no disabled look, so a blocked action is left to the actions menu.
  const leftAction: EntityCardLeftAction | undefined = !focus.bonded
    ? { label: "Bond", icon: <Icons.item.bond />, onClick: () => focusBonding.bond(focus) }
    : equipAction && !equipAction.disabled
      ? { label: equipAction.label, icon: <equipAction.icon />, onClick: equipAction.onClick }
      : undefined

  const linkLabel = getFocusLinkLabel(focus, parent?.name)

  return (
    <>
      <ItemCard item={focus} onOpen={onOpen} onEdit={onEdit} onRemove={removeFocus} leftAction={leftAction}>
        <ItemCard.SubType label={`${focus.focusType} Focus`} />

        <ItemCard.Stat label="Force" value={focus.force} type="rating" />
        {linkLabel ? <ItemCard.Stat value={linkLabel} /> : null}
        {focus.bonded
          ? <ItemCard.Stat value={getFocusBonusDescription(focus, parent?.name)} />
          : <ItemCard.Stat label="Bond" value={`${getFocusBondingCost(focus)} Karma`} />}
      </ItemCard>

      {focusBonding.outlet}
    </>
  )
}
