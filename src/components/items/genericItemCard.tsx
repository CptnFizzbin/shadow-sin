import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line, RiEdit2Line, RiFileShieldLine } from "@remixicon/react"
import type { FC } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"
import { useQuickBuyLicenseAction } from "#/lib/hooks/items/types/licenses/useQuickBuyLicenseAction.ts"
import type { ItemData } from "#/system/itemData.ts"

import { AvailabilityChip } from "./availability/availabilityChip.tsx"
import { ItemCard } from "./card/itemCard.tsx"
import type { ItemCardRootProps } from "./card/itemCardRoot.tsx"
import { ItemStatChip } from "./card/itemStatChip.tsx"
import { EquippedChip } from "./equippedChip.tsx"
import { GearMaxAvailability } from "./gearUtils.ts"

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
  const licenseQuickBuy = useQuickBuyLicenseAction(item)

  return (
    <>
      <ItemCard variant={variant}>
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

        <ItemCard.Action type="icon" aria-label="Edit" onClick={onEdit}>
          <RiEdit2Line size={16} />
        </ItemCard.Action>

        <ItemCard.Action type="icon" color="error" aria-label="Remove" onClick={onRemove}>
          <RiDeleteBin6Line size={16} />
        </ItemCard.Action>

        {onAddSubItem && (
          <ItemCard.AddChildButton onClick={onAddSubItem}>
            Add sub-item
          </ItemCard.AddChildButton>
        )}

        {subItems.length > 0 && (
          <ItemCard.Children>
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

        {licenseQuickBuy.eligible && (
          <ItemCard.Action type="icon" aria-label="Buy License" onClick={licenseQuickBuy.open}>
            <RiFileShieldLine size={16} />
          </ItemCard.Action>
        )}
      </ItemCard>

      {licenseQuickBuy.dialog}
    </>
  )
}
