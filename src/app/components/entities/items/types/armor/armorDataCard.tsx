import type { FC } from "react"

import { ItemAttachmentTree } from "#app/components/entities/items/card/itemAttachmentTree.tsx"
import { ItemCard } from "#app/components/ui/cards/itemCard/itemCard.tsx"
import type { ArmorData } from "#data/items/armorData.ts"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

interface ArmorDataCardProps {
  armor: ArmorData
  onOpen?: () => void
  onEdit?: () => void
}

export const ArmorDataCard: FC<ArmorDataCardProps> = ({ armor, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const mods = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: armor.id })
  const hasMods = Object.keys(mods).length > 0

  const removeArmor = () => dispatch(Actions.item.removeItem({ id: armor.id, removeChildren: true }))

  return (
    <ItemCard item={armor} onOpen={onOpen} onEdit={onEdit} onRemove={removeArmor}>
      <ItemCard.Stat label="B" value={armor.ballistic} type="damage" />
      <ItemCard.Stat label="I" value={armor.impact} type="damage" />

      {hasMods && (
        <ItemCard.Layout.BodyRow
          direction="column"
          sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
        >
          <ItemAttachmentTree itemId={armor.id} />
        </ItemCard.Layout.BodyRow>
      )}
    </ItemCard>
  )
}
