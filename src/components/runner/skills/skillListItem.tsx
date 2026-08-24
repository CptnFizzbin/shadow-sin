import ButtonBase from "@mui/material/ButtonBase"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { useWoundModifier } from "#/hooks/system/damage/useWoundModifier.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"

interface SkillListItemProps {
  name: string
  specialization?: string
  rating: number | "native"
  attr: AttributeKey
  isDefaulted?: boolean
  onClick: () => void
}

export const SkillListItem: FC<SkillListItemProps> = ({
  name,
  specialization,
  rating,
  attr,
  isDefaulted,
  onClick,
}) => {
  const woundMod = useWoundModifier()
  const attrValue = useEntitySelector(AttrSelectors.selectValue, { key: attr })

  const isNative = rating === "native"
  const ratingDice = isNative ? 0 : rating
  const defaultingPenalty = isDefaulted ? 1 : 0
  const totalDice = Math.max(0, ratingDice + attrValue - defaultingPenalty - woundMod)

  return (
    <Stack
      direction="row"
      onClick={onClick}
      component={ButtonBase}
      sx={{ alignItems: "center", textAlign: "left", padding: 0, width: "100%" }}
    >
      <Chip
        label={isNative ? "N" : rating}
        size="small"
        variant="outlined"
        sx={{ height: 52, width: 52 }}
      />

      <Stack sx={{ gap: 0, flexGrow: 1 }}>
        <Typography color={isDefaulted ? "warning.dark" : undefined}>{name}</Typography>
        {specialization && <Typography color="text.secondary">{specialization}</Typography>}
      </Stack>

      <Typography color="text.secondary">
        {AttributeLabels[attr]}
      </Typography>

      <Chip
        label={rating === "native" ? "Auto" : totalDice}
        size="small"
        color={isDefaulted ? "warning" : "secondary"}
        sx={{ height: 52, width: 52, fontWeight: "bold" }}
      />
    </Stack>
  )
}
