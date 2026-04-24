import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import {
  getImplantEffectiveEssenceCost,
  getImplantEffectiveNuyenCost,
} from "#/components/items/types/implants/implantUtils.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantType } from "#/system/gear/implantData.ts"

interface CyberwareListItemProps {
  implant: ImplantData
  onEdit: () => void
  onRemove: () => void
}

const gradeLabel: Partial<Record<string, string>> = {
  [ImplantGrade.standard]: "Std",
  [ImplantGrade.alpha]: "Alpha",
  [ImplantGrade.beta]: "Beta",
  [ImplantGrade.delta]: "Delta",
}

const typeLabel: Partial<Record<string, string>> = {
  [ImplantType.cyberware]: "Cyber",
  [ImplantType.bioware]: "Bio",
}

export const CyberwareListItem: FC<CyberwareListItemProps> = ({
  implant,
  onEdit,
  onRemove,
}) => {
  const { availability, source, description } = implant
  const effectiveNuyen = getImplantEffectiveNuyenCost(implant)
  const effectiveEssence = getImplantEffectiveEssenceCost(implant)

  return (
    <ItemCard onClick={onEdit}>
      <ItemCard.Title>{implant.name}</ItemCard.Title>

      <ItemCard.Meta type="cost">
        <Typography color="text.secondary" sx={{ fontSize: "0.875rem" }}>
          {effectiveEssence > 0
            ? `${effectiveEssence.toFixed(2).replace(/\.?0+$/, "")} Ess`
            : "0 Ess"}
        </Typography>
      </ItemCard.Meta>

      <ItemCard.Meta type="cost">
        <Typography sx={{ fontSize: "0.875rem" }}>
          <Nuyen amount={effectiveNuyen} />
        </Typography>
      </ItemCard.Meta>

      {implant.implantType && (
        <ItemCard.Meta type="stat">
          <ItemStatChip label={typeLabel[implant.implantType] ?? implant.implantType} />
        </ItemCard.Meta>
      )}

      {implant.grade && implant.grade !== ImplantGrade.standard && (
        <ItemCard.Meta type="stat">
          <ItemStatChip
            label={gradeLabel[implant.grade] ?? implant.grade}
            color="secondary"
          />
        </ItemCard.Meta>
      )}

      {implant.location && (
        <ItemCard.Meta type="stat">
          <ItemStatChip label={implant.location} />
        </ItemCard.Meta>
      )}

      {availability && (
        <ItemCard.Meta type="stat">
          <AvailabilityChip
            availability={availability}
            color={
              availability.rating > GearMaxAvailability ? "warning" : undefined
            }
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

      <ItemCard.Action type="icon">
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
      </ItemCard.Action>
    </ItemCard>
  )
}
