import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { GearItemCard } from "#/components/items/card/gearItemCard.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import type { ItemCardRootProps } from "#/components/items/card/itemCardRoot.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { ProgramData } from "#/system/gear/programData.ts"

interface ProgramItemCardProps extends Pick<ItemCardRootProps, "variant"> {
  program: ProgramData
  onEdit: () => void
  onRemove: () => void
}

export const ProgramItemCard: FC<ProgramItemCardProps> = ({
  program,
  variant,
  onEdit,
  onRemove,
}) => {
  const { availability, source } = program

  return (
    <GearItemCard variant={variant} availability={availability} source={source} onClick={onEdit} onRemove={onRemove}>
      <ItemCard.Title>{program.name}</ItemCard.Title>

      <ItemCard.Meta type="cost">
        <ItemStatChip label={`Rating: ${program.rating}`} />
      </ItemCard.Meta>

      {program.cost !== undefined && (
        <ItemCard.Meta type="cost">
          <Typography sx={{ fontSize: "0.875rem" }}>
            <Nuyen amount={program.cost} />
          </Typography>
        </ItemCard.Meta>
      )}

      <ItemCard.Meta type="stat">
        <ItemStatChip label={program.programType} color="primary" />
      </ItemCard.Meta>
    </GearItemCard>
  )
}
