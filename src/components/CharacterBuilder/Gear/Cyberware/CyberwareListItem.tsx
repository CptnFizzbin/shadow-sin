import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import type { ImplantFormState } from "#/components/CharacterBuilder/Gear/Cyberware/Forms/ImplantFormState.ts"
import {
  getImplantEffectiveEssenceCost,
  getImplantEffectiveNuyenCost,
} from "#/components/CharacterBuilder/Gear/Cyberware/ImplantUtils.ts"
import { GearMaxAvailability } from "#/components/CharacterBuilder/Gear/GearUtils.ts"
import { AvailabilityChip } from "#/components/Gear/AvailabilityChip.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"
import {
  ImplantGrade,
  ImplantType,
} from "#/lib/system/types/gear/implantData.ts"

interface CyberwareListItemProps {
  implant: ImplantFormState
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
    <Stack
      direction="column"
      sx={{
        "padding": 1,
        "borderRadius": 1,
        "border": "1px solid",
        "borderColor": "divider",
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography sx={{ flexGrow: 1, fontSize: "0.875rem" }}>
          {implant.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {effectiveEssence > 0
            ? `${effectiveEssence.toFixed(2).replace(/\.?0+$/, "")} Ess`
            : "0 Ess"}
        </Typography>

        <Typography>
          <Nuyen amount={effectiveNuyen} />
        </Typography>

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
      </Stack>

      <Stack direction="row" gap={1} sx={{ pt: 1 }} flexWrap="wrap">
        {implant.implantType && (
          <Chip
            label={typeLabel[implant.implantType] ?? implant.implantType}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
        )}

        {implant.grade && implant.grade !== ImplantGrade.standard && (
          <Chip
            label={gradeLabel[implant.grade] ?? implant.grade}
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
        )}

        {implant.location && (
          <Chip
            label={implant.location}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
        )}

        {availability && (
          <AvailabilityChip
            availability={availability}
            color={
              availability.rating > GearMaxAvailability ? "warning" : undefined
            }
          />
        )}

        {source && (
          <Chip
            label={`${source.book} p.${source.page}`}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
        )}

        {description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ flexGrow: 1, alignSelf: "center" }}
          >
            {description}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
