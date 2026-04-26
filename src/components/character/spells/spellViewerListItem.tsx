import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { formatDrainFormula } from "#/components/character/spells/spellDrainFormula.ts"
import type { SpellData } from "#/system/magic/spellData.ts"

interface SpellViewerListItemProps {
  spell: SpellData
  onClick: () => void
  onToggleSustained?: () => void
}

export const SpellViewerListItem: FC<SpellViewerListItemProps> = ({ spell, onClick, onToggleSustained }) => {
  const hasSustainableEffects = onToggleSustained && spell.effects && spell.effects.length > 0

  return (
    <Paper
      component="button"
      type="button"
      sx={{
        "padding": 1,
        "border": "1px solid",
        "borderColor": "divider",
        "cursor": "pointer",
        "width": "100%",
        "textAlign": "left",
        "background": "inherit",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onClick}
      aria-label={`Cast ${spell.name}`}
    >
      <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
        <Typography sx={{ flexGrow: 1 }}>
          {spell.name}
        </Typography>
        <Typography color="text.secondary">
          {formatDrainFormula(spell.drainValueMod)}
        </Typography>
        {hasSustainableEffects && (
          <Chip
            label="Sustained"
            size="small"
            variant={spell.sustained ? "filled" : "outlined"}
            color={spell.sustained ? "secondary" : "default"}
            onClick={(e) => {
              e.stopPropagation()
              onToggleSustained()
            }}
          />
        )}
      </Stack>
    </Paper>
  )
}
