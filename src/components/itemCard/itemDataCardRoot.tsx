import type { FC } from "react"

import type { BasicDataCardProps } from "#/components/dataCard/dataCard.tsx"
import { DataCard } from "#/components/dataCard/dataCard.tsx"
import { Icons } from "#/lib/icons.ts"
import type { ItemData } from "#/system/itemData.ts"
import { isEquipped, isStashed } from "#/system/items/itemUtils.ts"

export interface ItemCardRootProps extends BasicDataCardProps {
  item: ItemData
  subType?: string
}

/**
 * ItemData-aware layer between `DataCard` (fully generic) and a type's own
 * `*DataCard` (e.g. `WeaponDataCard`): auto-renders every field common to
 * `ItemData` — name, source, availability, quantity, cost, rating,
 * equipped/stashed/fixed/wireless status — so typed cards only need to
 * supply their own type-specific slots as `children`.
 */
export const ItemDataCardRoot: FC<ItemCardRootProps> = ({ item, subType, children, ...props }) => {
  return (
    <DataCard {...props}>
      <DataCard.Title title={item.name} />
      <DataCard.Type label={item.itemType} subtype={subType} />
      <DataCard.Source source={item.source} />
      <DataCard.Availability value={item.availability} />
      <DataCard.Quantity value={item.quantity} />
      <DataCard.Cost value={item.cost} />
      <DataCard.Rating value={item.rating} />

      {isEquipped(item) && !isStashed(item) && (
        <DataCard.StatusIcon icon={Icons.item.equipped} label="Equipped" />
      )}
      {isStashed(item) && <DataCard.StatusIcon icon={Icons.item.stashed} label="Stashed" />}
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
    </DataCard>
  )
}
