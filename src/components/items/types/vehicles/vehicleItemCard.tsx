import Typography from "@mui/material/Typography"
import { RiFileShieldLine } from "@remixicon/react"
import type { FC } from "react"

import { GearItemCard } from "#/components/items/card/gearItemCard.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { GenericItemCard } from "#/components/items/genericItemCard.tsx"
import { useQuickBuyLicenseAction } from "#/components/items/types/licenses/useQuickBuyLicenseAction.ts"
import { InlineDamageTrack } from "#/components/system/damage/inlineDamageTrack.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { VehicleStatGroups } from "./vehicleStatGroups.tsx"

interface VehicleItemCardProps {
  vehicle: VehicleData
  attachments?: ItemData[]
  onEdit: () => void
  onRemove: () => void
  onAddAttachment?: () => void
  onEditAttachment?: (item: ItemData) => void
  onRemoveAttachment?: (item: ItemData) => void
  onDamageChange?: (value: number) => void
}

export const VehicleItemCard: FC<VehicleItemCardProps> = ({
  vehicle,
  attachments = [],
  onEdit,
  onRemove,
  onAddAttachment,
  onEditAttachment,
  onRemoveAttachment,
  onDamageChange,
}) => {
  const { availability, source } = vehicle
  const damageMax = vehicle.damage?.physical.max || vehicle.body
  const licenseQuickBuy = useQuickBuyLicenseAction(vehicle)

  return (
    <>
      <GearItemCard
        availability={availability}
        source={source}
        onEdit={onEdit}
        onRemove={onRemove}
      >
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
        </ItemCard.Meta>

        <ItemCard.Meta type="detail">
          <VehicleStatGroups vehicle={vehicle} />
        </ItemCard.Meta>

        {onDamageChange && (
          <ItemCard.Meta type="detail">
            <InlineDamageTrack
              label="Damage"
              max={damageMax}
              current={vehicle.damage?.physical.current ?? 0}
              onChange={onDamageChange}
            />
          </ItemCard.Meta>
        )}

        {onAddAttachment && (
          <ItemCard.AddChildButton onClick={onAddAttachment}>
            Equipment
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

        {licenseQuickBuy.eligible && (
          <ItemCard.Action type="icon" aria-label="Buy License" onClick={licenseQuickBuy.open}>
            <RiFileShieldLine size={16} />
          </ItemCard.Action>
        )}
      </GearItemCard>

      {licenseQuickBuy.dialog}
    </>
  )
}
