import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { getEffectLabel } from "#/components/system/gameEffects/gameEffectsSummary.tsx"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"

export interface CardElementEffectsProps {
  effects: GameEffectData[] | undefined
}

/** Read-only summary chips for an Entity's granted effects. Renders nothing when there are none. */
export const CardElementEffect: FC<CardElementEffectsProps> = ({ effects }) => {
  if (!effects || effects.length === 0) return null

  return (
    <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
      {effects.map((effect, index) => (
        <Chip
          key={`${effect.type}-${effect.target ?? "none"}-${index}`}
          size="small"
          variant="outlined"
          label={getEffectLabel(effect)}
          sx={{ "height": "auto", "& .MuiChip-label": { whiteSpace: "normal" } }}
        />
      ))}
    </Stack>
  )
}

CardElementEffect.displayName = "EntityCard.Effects"
