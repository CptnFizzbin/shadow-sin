import { FC } from "react"
import { DataCard } from "#/components/dataCard/dataCard.tsx"
import { Icons } from "#/lib/icons.ts"
import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import type { ItemData } from "#/system/itemData.ts"

interface ItemCardProps extends EntityCardProps {
  item: ItemData
}

export const ItemCard: FC<ItemCardProps> = ({
  item
}) => {
  return (
    <EntityCard>
      <EntityCard.Title title={item.name} />
      <EntityCard.Type label={item.itemType} subtype={subType} />
      <EntityCard.Source source={item.source} />
      <EntityCard.Availability value={item.availability} />
      <EntityCard.Quantity value={item.quantity} />
      <EntityCard.Cost value={item.cost} />
      <EntityCard.Rating value={item.rating} />

      {item.equipped && <DataCard.StatusIcon icon={Icons.item.equipped} label="Equipped" />}
      {item.stashed && <DataCard.StatusIcon icon={Icons.item.stashed} label="Stashed" />}
      {item.fixed && <DataCard.StatusIcon icon={Icons.item.fixed} label="Fixed" />}
      {item.wireless && (
        item.wireless.removed
          ? <DataCard.StatusIcon icon={Icons.item.wireless.removed} label="Wireless removed" />
          : (
            <DataCard.StatusIcon
              icon={item.wireless.enabled ? Icons.item.wireless.enabled : Icons.item.wireless.disabled}
              label={item.wireless.enabled ? "Wireless" : "Wireless off"}
            />
          )
      )}

      {children}
    </EntityCard>
  )
}
