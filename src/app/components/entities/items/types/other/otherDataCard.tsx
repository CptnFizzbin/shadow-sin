import type { FC } from "react"

import { ItemAttachmentTree } from "#app/components/entities/items/card/itemAttachmentTree.tsx"
import { ItemCard } from "#app/components/ui/cards/itemCard/itemCard.tsx"
import type { ItemData } from "#data/items/itemData.ts"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

interface OtherDataCardProps {
  item: ItemData
  onOpen?: () => void
  onEdit?: () => void
}

export const OtherDataCard: FC<OtherDataCardProps> = ({ item, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const subItems = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: item.id })
  const hasSubItems = Object.keys(subItems).length > 0

  const removeItem = () => dispatch(Actions.item.removeItem({ id: item.id, removeChildren: true }))

  return (
    <ItemCard item={item} onOpen={onOpen} onEdit={onEdit} onRemove={removeItem}>
      {hasSubItems && (
        <ItemCard.Layout.BodyRow
          direction="column"
          sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
        >
          <ItemAttachmentTree itemId={item.id} />
        </ItemCard.Layout.BodyRow>
      )}
    </ItemCard>
  )
}
