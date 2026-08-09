import type { FC } from "react"

import { ItemCard } from "#/components/itemCard/itemCard.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { ItemData } from "#/system/itemData.ts"

interface OtherDataCardProps {
  item: ItemData
  onOpen?: () => void
  onEdit?: () => void
}

export const OtherDataCard: FC<OtherDataCardProps> = ({ item, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const subItems = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(item.id))
  const hasSubItems = Object.keys(subItems).length > 0

  const removeItem = () => dispatch(Actions.gear.removeItem({ id: item.id, removeChildren: true }))

  return (
    <ItemCard item={item} onOpen={onOpen} onEdit={onEdit} onRemove={removeItem}>
      {hasSubItems && (
        <ItemCard.Layout.BodyRow
          direction="column"
          sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
        >
          {Object.values(subItems).map((subItem) => (
            <ItemCard.Subitem key={subItem.id} name={subItem.name} />
          ))}
        </ItemCard.Layout.BodyRow>
      )}
    </ItemCard>
  )
}
