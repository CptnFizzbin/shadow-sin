import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { SpellsBpPerSpell } from "#/components/character/spells/spellsUtils.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import type { SpellData } from "#/system/magic/spellData.ts"

interface SpellListItemProps {
  spell: SpellData
  onEdit?: () => void
}

export const SpellListItem: FC<SpellListItemProps> = ({ spell, onEdit }) => {
  return (
    <Paper
      sx={{
        "padding": 1,
        "border": "1px solid",
        "borderColor": "divider",
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
        <Typography sx={{ flexGrow: 1 }}>{spell.name}</Typography>
        <BuildPoints value={SpellsBpPerSpell} />
      </Stack>
    </Paper>
  )
}
