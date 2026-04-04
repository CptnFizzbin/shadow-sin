import ButtonBase from "@mui/material/ButtonBase"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useAttr } from "#/components/Character/character-utils.ts"
import { useWoundModifier } from "#/components/Damage/use-wound-modifier.ts"
import type { AttributeKey } from "#/lib/system/attribute-key.ts"
import { AttributeLabels } from "#/lib/system/attribute-key.ts"

interface SkillListItemProps {
  name: string
  specialization?: string
  rating: number | "native"
  attr: AttributeKey
  onClick: () => void
}

export const SkillListItem: FC<SkillListItemProps> = ({
  name,
  specialization,
  rating,
  attr,
  onClick,
}) => {
  const woundMod = useWoundModifier()
  const attrValue = useAttr(attr)

  const isNative = rating === "native"
  const ratingDice = isNative ? 0 : rating
  const totalDice = Math.max(0, ratingDice + attrValue - woundMod)

  return (
    <Stack
      direction="row"
      alignItems="center"
      onClick={onClick}
      component={ButtonBase}
      textAlign="left"
      padding={0}
    >
      <Chip
        label={isNative ? "N" : rating}
        size="small"
        variant="outlined"
        sx={{ height: 52, width: 52 }}
      />

      <Stack sx={{ flexGrow: 1 }} gap={0}>
        <Typography>{name}</Typography>
        {specialization && <Typography variant="caption" color="text.secondary">{specialization}</Typography>}
      </Stack>

      <Typography color="text.secondary">
        {AttributeLabels[attr]}
      </Typography>

      <Chip
        label={rating === "native" ? "Auto" : totalDice}
        size="small"
        color="secondary"
        sx={{ height: 52, width: 52, fontWeight: "bold" }}
      />
    </Stack>
  )
}
