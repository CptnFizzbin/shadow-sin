import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line, RiFlashlightFill, RiFlashlightLine } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { FocusData } from "#/system/gear/focusData.ts"

import { ActiveChip } from "./activeChip.tsx"
import { BondedChip } from "./bondedChip.tsx"

interface FocusItemCardProps {
  focus: FocusData
  onEdit: () => void
  onRemove: () => void
  onToggleActivation: () => void
}

export const FocusItemCard: FC<FocusItemCardProps> = ({
  focus,
  onEdit,
  onRemove,
  onToggleActivation,
}) => {
  const { availability, source } = focus
  const isActive = focus.equipped === true && focus.bonded === true
  const canActivate = focus.bonded === true

  const activationTooltip = canActivate
    ? (isActive ? "Deactivate" : "Activate")
    : "Bond the focus before activating"

  return (
    <ItemCard onClick={onEdit}>
      <ItemCard.Title>{focus.name}</ItemCard.Title>

      <ItemCard.Meta type="stat">
        <ItemStatChip label={focus.focusType} color="secondary" />
      </ItemCard.Meta>

      {focus.bonded && (
        <ItemCard.Meta type="stat">
          <BondedChip />
        </ItemCard.Meta>
      )}

      {isActive && (
        <ItemCard.Meta type="cost">
          <ActiveChip />
        </ItemCard.Meta>
      )}

      {focus.rating !== undefined && (
        <ItemCard.Meta type="stat">
          <ItemStatChip label={`Force: ${focus.rating}`} />
        </ItemCard.Meta>
      )}

      {focus.cost !== undefined && (
        <ItemCard.Meta type="cost">
          <Typography sx={{ fontSize: "0.875rem" }}>
            <Nuyen amount={focus.cost} />
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

      {source?.book && (
        <ItemCard.Meta type="source">
          <ItemStatChip label={`${source.book} p.${source.page}`} />
        </ItemCard.Meta>
      )}

      <Tooltip title={activationTooltip}>
        <span>
          <ItemCard.Action
            type="icon"
            color={isActive ? "success" : "default"}
            disabled={!canActivate}
            onClick={onToggleActivation}
            aria-label={isActive ? "Deactivate focus" : "Activate focus"}
          >
            {isActive ? <RiFlashlightFill size={16} /> : <RiFlashlightLine size={16} />}
          </ItemCard.Action>
        </span>
      </Tooltip>

      <ItemCard.Action type="icon" color="error" onClick={onRemove} aria-label="Remove focus">
        <RiDeleteBin6Line size={16} />
      </ItemCard.Action>
    </ItemCard>
  )
}
