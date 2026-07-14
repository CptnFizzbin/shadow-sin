import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { GearItemCard } from "#/components/items/card/gearItemCard.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { EquippedChip } from "#/components/items/equippedChip.tsx"
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
    <GearItemCard availability={availability} source={source} onClick={onEdit} onRemove={onRemove}>
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
    </GearItemCard>
  )
}
