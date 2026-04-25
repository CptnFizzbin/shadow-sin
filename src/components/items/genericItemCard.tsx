import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import type { ItemCardRootProps } from "#/components/items/card/itemCardRoot.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { EquippedChip } from "#/components/items/equippedChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { ItemData } from "#/system/itemData.ts"

interface GenericItemCardProps extends Pick<ItemCardRootProps, "variant"> {
  item: ItemData
  subItems?: ItemData[]
  onEdit: () => void
  onRemove: () => void
  onAddSubItem?: () => void
  onEditSubItem?: (subItem: ItemData) => void
  onRemoveSubItem?: (subItem: ItemData) => void
}

export const GenericItemCard: FC<GenericItemCardProps> = ({
  item,
  variant,
  subItems = [],
  onEdit,
  onRemove,
  onAddSubItem,
  onEditSubItem,
  onRemoveSubItem,
}) => {
  const { availability, source, description } = item

  return (
    <ItemCard variant={variant} onClick={onEdit}>
      <ItemCard.Title>{item.name}</ItemCard.Title>

      {(item.quantity ?? 1) > 1 && (
        <ItemCard.Meta type="cost">
          <ItemStatChip label={`×${item.quantity ?? 1}`} color="primary" />
        </ItemCard.Meta>
      )}

      {item.equipped && (
        <ItemCard.Meta type="cost">
          <EquippedChip />
        </ItemCard.Meta>
      )}

      {item.rating !== undefined && (
        <ItemCard.Meta type="cost">
          <ItemStatChip label={`Rating: ${item.rating}`} />
        </ItemCard.Meta>
      )}

      {item.cost !== undefined && (
        <ItemCard.Meta type="cost">
          <Typography sx={{ fontSize: "0.875rem" }}>
            <Nuyen amount={item.cost} />
          </Typography>
        </ItemCard.Meta>
      )}

      {availability && (
        <ItemCard.Meta type="stat">
          <AvailabilityChip
            availability={availability}
            color={availability.rating > GearMaxAvailability ? "warning" : undefined}
          />
        </ItemCard.Meta>
      )}

      {description && (
        <ItemCard.Meta type="stat">
          <Typography color="text.secondary" sx={{ alignSelf: "center" }}>
            {description}
          </Typography>
        </ItemCard.Meta>
      )}

      {source && (
        <ItemCard.Meta type="source">
          <ItemStatChip label={`${source.book} p.${source.page}`} />
        </ItemCard.Meta>
      )}

      <ItemCard.Action type="icon" color="error" onClick={onRemove}>
        <RiDeleteBin6Line size={16} />
      </ItemCard.Action>

      {(subItems.length > 0 || onAddSubItem) && (
        <ItemCard.Children>
          {onAddSubItem && (
            <ItemCard.AddChildButton onClick={onAddSubItem}>
              Add sub-item
            </ItemCard.AddChildButton>
          )}
          {subItems.map((subItem) => (
            <GenericItemCard
              key={subItem.id}
              item={subItem}
              variant="borderless"
              onEdit={() => onEditSubItem?.(subItem)}
              onRemove={() => onRemoveSubItem?.(subItem)}
            />
          ))}
        </ItemCard.Children>
      )}
    </ItemCard>
  )
}
