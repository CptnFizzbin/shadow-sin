import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import { GenericItemCard } from "#/components/items/genericItemCard.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"

interface VehicleItemCardProps {
  vehicle: VehicleData
  attachments?: ItemData[]
  onEdit: () => void
  onRemove: () => void
  onAddAttachment?: () => void
  onEditAttachment?: (item: ItemData) => void
  onRemoveAttachment?: (item: ItemData) => void
}

export const VehicleItemCard: FC<VehicleItemCardProps> = ({
  vehicle,
  attachments = [],
  onEdit,
  onRemove,
  onAddAttachment,
  onEditAttachment,
  onRemoveAttachment,
}) => {
  const { availability, source } = vehicle

  return (
    <ItemCard onClick={onEdit}>
      <ItemCard.Title>{vehicle.name}</ItemCard.Title>

      {vehicle.cost !== undefined && (
        <ItemCard.Meta type="cost">
          <Typography sx={{ fontSize: "0.875rem" }}>
            <Nuyen amount={vehicle.cost} />
          </Typography>
        </ItemCard.Meta>
      )}

      <ItemCard.Meta type="stat">
        <ItemStatChip label={vehicle.vehicleType} />
        <ItemStatChip label={`Spd: ${vehicle.speed}`} />
        <ItemStatChip label={`Bod: ${vehicle.body}`} />
        <ItemStatChip label={`Pilot: ${vehicle.pilot}`} />
      </ItemCard.Meta>

      {availability && (
        <ItemCard.Meta type="stat">
          <AvailabilityChip
            availability={availability}
            color={availability.rating > GearMaxAvailability ? "warning" : undefined}
          />
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

      {onAddAttachment && (
        <ItemCard.AddChildButton onClick={onAddAttachment}>
          Add Attachment
        </ItemCard.AddChildButton>
      )}

      {attachments.length > 0 && (
        <ItemCard.Children>
          {attachments.map((attachment) => (
            <GenericItemCard
              key={attachment.id}
              item={attachment}
              variant="borderless"
              onEdit={() => onEditAttachment?.(attachment)}
              onRemove={() => onRemoveAttachment?.(attachment)}
            />
          ))}
        </ItemCard.Children>
      )}
    </ItemCard>
  )
}
