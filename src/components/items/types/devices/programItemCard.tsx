import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line, RiEdit2Line } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import type { ItemCardRootProps } from "#/components/items/card/itemCardRoot.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
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
    <ItemCard variant={variant}>
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

      <ItemCard.Action type="icon" aria-label="Edit" onClick={onEdit}>
        <RiEdit2Line size={16} />
      </ItemCard.Action>

      <ItemCard.Action type="icon" color="error" aria-label="Remove" onClick={onRemove}>
        <RiDeleteBin6Line size={16} />
      </ItemCard.Action>
    </ItemCard>
  )
}
