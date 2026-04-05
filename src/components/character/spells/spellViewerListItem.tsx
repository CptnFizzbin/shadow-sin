import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { formatDrainFormula } from "#/components/character/spells/spellDrainFormula.ts"
import type { SpellData } from "#/lib/system/magic/spellData.ts"

interface SpellViewerListItemProps {
  spell: SpellData
  onClick: () => void
}

export const SpellViewerListItem: FC<SpellViewerListItemProps> = ({ spell, onClick }) => {
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
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography flexGrow={1} variant="body2">
          {spell.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDrainFormula(spell.drainValueMod)}
        </Typography>
      </Stack>
    </Paper>
  )
}
