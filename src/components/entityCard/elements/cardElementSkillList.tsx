import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

export interface CardElementSkillListItem {
  name: string
  /** The full dice pool for this skill (e.g. a Spirit's Force plus its linked attribute). */
  pool: number
}

export interface CardElementSkillListProps {
  label?: string
  skills: CardElementSkillListItem[]
}

/** Labeled row of skill chips, each showing its computed dice pool. Renders nothing when empty. */
export const CardElementSkillList: FC<CardElementSkillListProps> = ({ label = "Skills", skills }) => {
  if (skills.length === 0) return null

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Stack direction="row" sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
        {skills.map((skill) => (
          <Chip key={skill.name} label={`${skill.name} [${skill.pool}]`} size="small" />
        ))}
      </Stack>
    </Box>
  )
}

CardElementSkillList.displayName = "SpiritCard.SkillList"
