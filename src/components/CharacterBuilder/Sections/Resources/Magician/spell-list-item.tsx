import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { SpellsBpPerSpell } from "#/components/Spells/spells-utils.ts"
import { BuildPoints } from "#/components/UI/build-points.tsx"
import type { SpellData } from "#/lib/system/magic/spell-data.ts"

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
      <Stack direction="row" gap={1} alignItems="center">
        <Typography flexGrow={1}>{spell.name}</Typography>
        <BuildPoints value={SpellsBpPerSpell} />
      </Stack>
    </Paper>
  )
}
