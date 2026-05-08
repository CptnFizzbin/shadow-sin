import DeleteIcon from "@mui/icons-material/Delete"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { describeImprovement } from "./improvementDescription.ts"
import { calcImprovementKarmaCost } from "./improvementsKarmaCost.ts"
import type { ImprovementsStore } from "./improvementsStore.ts"
import type { AnyImprovement } from "./types/anyImprovement.ts"
import { ImprovementType } from "./types/improvementType.ts"

const improvementKey = (improvement: AnyImprovement, index: number): string => {
  switch (improvement.type) {
    case ImprovementType.Attribute:
      return `${improvement.type}-${improvement.attribute}`
    case ImprovementType.ActiveSkill:
      return `${improvement.type}-${improvement.skill}-${improvement.specialization ?? improvement.newRating}`
    case ImprovementType.SkillGroup:
      return `${improvement.type}-${improvement.group}`
    case ImprovementType.KnowledgeSkill:
    case ImprovementType.LanguageSkill:
      return `${improvement.type}-${improvement.skill}-${improvement.specialization ?? improvement.newRating}`
    case ImprovementType.LearnSpell:
      return `${improvement.type}-${improvement.spell.id}`
    default:
      return `${index}`
  }
}

interface PendingImprovementsListProps {
  improvements: AnyImprovement[]
  improvementsStore: ImprovementsStore
}

export const PendingImprovementsList: FC<PendingImprovementsListProps> = ({
  improvements,
  improvementsStore,
}) => {
  if (improvements.length === 0) return null

  return (
    <>
      <Stack sx={{ gap: 0.5 }}>
        {improvements.map((improvement, index) => (
          <Stack
            key={improvementKey(improvement, index)}
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography variant="body2">{describeImprovement(improvement)}</Typography>
            <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {calcImprovementKarmaCost(improvement)} karma
              </Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => improvementsStore.removeImprovement(index)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Divider />
    </>
  )
}
