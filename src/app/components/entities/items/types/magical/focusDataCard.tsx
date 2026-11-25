import type { FC } from "react"

import type { EntityCardLeftAction } from "#/app/components/ui/cards/entityCard/entityCard.tsx"
import { ItemCard } from "#/app/components/ui/cards/itemCard/itemCard.tsx"
import { useFocusBonding } from "#/app/hooks/items/types/magical/useFocusBonding.tsx"
import { NullUuid } from "#/common/uuid/uuidUtils.ts"
import type { FocusData } from "#/data/items/magicalData.ts"
import { getFocusBondingCost } from "#/rules/magic/focusRules.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { Icons } from "#/ui/icons/icons.ts"

import { getFocusBonusDescription, getFocusLinkLabel } from "./focusDescriptions.ts"

interface FocusDataCardProps {
  focus: FocusData
  onOpen?: () => void
  onEdit?: () => void
}

/** Card for a Focus, with Bond as its primary action until it's Bonded. */
export const FocusDataCard: FC<FocusDataCardProps> = ({ focus, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const focusBonding = useFocusBonding()
  const parent = useRunnerSelector(ItemSelectors.selectById, { itemId: focus.items.parentId ?? NullUuid })

  const removeFocus = () => dispatch(Actions.item.removeItem({ id: focus.id, removeChildren: true }))

  const leftAction: EntityCardLeftAction | undefined = focus.bonded
    ? undefined
    : { label: "Bond", icon: <Icons.item.bond />, onClick: () => focusBonding.bond(focus) }

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
