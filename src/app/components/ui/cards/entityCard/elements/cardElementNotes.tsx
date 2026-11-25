import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

export interface CardElementNotesProps {
  value: string | undefined
}

/** Free-text notes block (e.g. a Spirit/Sprite's summoner notes). Renders nothing when empty. */
export const CardElementNotes: FC<CardElementNotesProps> = ({ value }) => {
  if (!value) return null

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        Notes
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  )
}

CardElementNotes.displayName = "SpiritCard.Notes"
