import ButtonBase from "@mui/material/ButtonBase"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { SpellData } from "#/system/magic/spellData.ts"

import { DrainValue } from "./drainValue.tsx"

interface SpellViewerListItemProps {
  spell: SpellData
  onClick: () => void
  onToggleSustained?: () => void
}

export const SpellViewerListItem: FC<SpellViewerListItemProps> = ({ spell, onClick, onToggleSustained }) => {
  const hasSustainableEffects = onToggleSustained && spell.effects && spell.effects.length > 0

  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
      <ButtonBase
        component={Paper}
        onClick={onClick}
        aria-label={`Cast ${spell.name}`}
        sx={{
          "padding": 1,
          "border": "1px solid",
          "borderColor": "divider",
          "flexGrow": 1,
          "textAlign": "left",
          "display": "block",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <Typography sx={{ flexGrow: 1 }}>
            {spell.name}
          </Typography>
          <DrainValue mod={spell.drainValueMod} />
        </Stack>
      </ButtonBase>
      {hasSustainableEffects && (
        <Chip
          label="Sustained"
          size="small"
          variant={spell.sustained ? "filled" : "outlined"}
          color={spell.sustained ? "secondary" : "default"}
          onClick={onToggleSustained}
        />
      )}
    </Stack>
  )
}
