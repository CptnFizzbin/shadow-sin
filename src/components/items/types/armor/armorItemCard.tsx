import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { EquippedChip } from "#/components/items/equippedChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { ArmorData } from "#/system/gear/armorData.ts"

interface ArmorItemCardProps {
  armor: ArmorData
  onEdit: () => void
  onRemove: () => void
}

export const ArmorItemCard: FC<ArmorItemCardProps> = ({ armor, onEdit, onRemove }) => {
  const { availability, source } = armor

  return (
    <ItemCard onClick={onEdit}>
      <ItemCard.Title>{armor.name}</ItemCard.Title>

      {armor.equipped && (
        <ItemCard.Meta type="cost">
          <EquippedChip />
        </ItemCard.Meta>
      )}

      {armor.cost !== undefined && (
        <ItemCard.Meta type="cost">
          <Typography sx={{ fontSize: "0.875rem" }}>
            <Nuyen amount={armor.cost} />
          </Typography>
        </ItemCard.Meta>
      )}

      <ItemCard.Meta type="stat">
        <ItemStatChip label={`B: ${armor.ballistic}`} />
        <ItemStatChip label={`I: ${armor.impact}`} />
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
    </ItemCard>
  )
}
