import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { SpellsBpPerSpell } from "#/components/Character/Form/Resources/Magician/SpellsUtils.ts"
import type { SpellData } from "#/lib/system/types/magic/spellData.ts"

interface SpellListItemProps {
  spell: SpellData
  onEdit?: () => void
}

export const SpellListItem: FC<SpellListItemProps> = ({ spell, onEdit }) => {
  return (
    <Paper
      sx={{
        padding: 1,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <Typography flexGrow={1}>{spell.name}</Typography>
        <Typography variant="body2" color="secondary.main">
          {SpellsBpPerSpell} BP
        </Typography>
      </Stack>
    </Paper>
  )
}
