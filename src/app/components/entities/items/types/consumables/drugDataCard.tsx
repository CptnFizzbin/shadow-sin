import type { FC } from "react"

import { ItemCard } from "#app/components/ui/cards/itemCard/itemCard.tsx"
import { useConsumeAction } from "#app/hooks/items/types/consumables/useConsumeAction.ts"
import type { DrugData } from "#data/items/consumableData.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"

interface DrugDataCardProps {
  drug: DrugData
  onOpen?: () => void
  onEdit?: () => void
}

/** Card for a Drug, with Consume (or End Effect, while it's Active) as its primary action. */
export const DrugDataCard: FC<DrugDataCardProps> = ({ drug, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const consumeAction = useConsumeAction(drug)

  const removeDrug = () => dispatch(Actions.item.removeItem({ id: drug.id, removeChildren: true }))

  // The card's edge button has no disabled look, so a blocked action is left to the actions menu.
  const leftAction = consumeAction && !consumeAction.disabled
    ? { label: consumeAction.label, icon: <consumeAction.icon />, onClick: consumeAction.onClick }
    : undefined

  return (
    <ItemCard item={drug} onOpen={onOpen} onEdit={onEdit} onRemove={removeDrug} leftAction={leftAction}>
      {drug.duration ? <ItemCard.Stat label="Duration" value={drug.duration} /> : null}
    </ItemCard>
  )
}
