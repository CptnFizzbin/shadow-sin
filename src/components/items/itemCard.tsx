import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { ItemCard as ItemCardComposite } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { EquippedChip } from "#/components/items/equippedChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { ItemData } from "#/system/itemData.ts"

interface ItemCardProps {
  item: ItemData
  onEdit: () => void
  onRemove: () => void
}

export const ItemCard: FC<ItemCardProps> = ({
  item,
  onEdit,
  onRemove,
}) => {
  const { availability, source, description } = item

  return (
    <ItemCardComposite onClick={onEdit}>
      <ItemCardComposite.Title>{item.name}</ItemCardComposite.Title>

      {(item.quantity ?? 1) > 1 && (
        <ItemCardComposite.Meta type="cost">
          <ItemStatChip label={`×${item.quantity ?? 1}`} color="primary" />
        </ItemCardComposite.Meta>
      )}

      {item.equipped && (
        <ItemCardComposite.Meta type="cost">
          <EquippedChip />
        </ItemCardComposite.Meta>
      )}

      {item.rating !== undefined && (
        <ItemCardComposite.Meta type="cost">
          <ItemStatChip label={`Rating: ${item.rating}`} />
        </ItemCardComposite.Meta>
      )}

      <ItemCardComposite.Meta type="cost">
        <Typography sx={{ fontSize: "0.875rem" }}>
          <Nuyen amount={item.cost} />
        </Typography>
      </ItemCardComposite.Meta>

      {availability && (
        <ItemCardComposite.Meta type="stat">
          <AvailabilityChip
            availability={availability}
            color={
              availability.rating > GearMaxAvailability ? "warning" : undefined
            }
          />
        </ItemCardComposite.Meta>
      )}

      {description && (
        <ItemCardComposite.Meta type="stat">
          <Typography color="text.secondary" sx={{ alignSelf: "center" }}>
            {description}
          </Typography>
        </ItemCardComposite.Meta>
      )}

      {source && (
        <ItemCardComposite.Meta type="source">
          <ItemStatChip label={`${source.book} p.${source.page}`} />
        </ItemCardComposite.Meta>
      )}

      <ItemCardComposite.Action type="icon">
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <RiDeleteBin6Line size={16} />
        </IconButton>
      </ItemCardComposite.Action>
    </ItemCardComposite>
  )
}
