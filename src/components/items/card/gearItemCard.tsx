import { RiDeleteBin6Line, RiEdit2Line } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import type { AvailabilityInfo } from "#/system/availabilityInfo.ts"
import type { SourceData } from "#/system/sourceData.ts"

import { ItemCard } from "./itemCard.tsx"
import type { ItemCardRootProps } from "./itemCardRoot.tsx"
import { ItemStatChip } from "./itemStatChip.tsx"

interface GearItemCardProps extends Pick<ItemCardRootProps, "variant"> {
  availability?: AvailabilityInfo
  source?: SourceData
  onEdit: () => void
  onRemove: () => void
  children: ReactNode
}

/**
 * Wrapper around ItemCard that appends the shared gear metadata footer:
 * availability chip, source reference, and edit/delete actions.
 *
 * Specific card components supply their unique stats as children.
 */
export const GearItemCard: FC<GearItemCardProps> = ({
  availability,
  source,
  onEdit,
  onRemove,
  variant,
  children,
}) => {
  return (
    <ItemCard variant={variant}>
      {children}

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
