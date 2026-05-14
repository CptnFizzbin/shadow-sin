import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiChat4Line } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { selectCurrentKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import type { SkillIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { isSkillIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

const MAX_SKILL_RATING = 6

export const ImprovementLanguageSkillList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const karmaStore = useKarmaStore()
  const languageSkills = useCharacterSheet((sheet) => sheet.skills.languageSkills)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedSkillIncreases = allImprovements
    .filter(isSkillIncreaseEntry)
    .filter((entry) => entry.skillType === "LanguageSkill")

  if (languageSkills.length === 0) {
    return (
      <Stack sx={{ py: 4, alignItems: "center", gap: 1 }}>
        <RiChat4Line size={32} style={{ opacity: 0.3 }} />
        <Typography variant="body2" color="text.secondary">
          No language skills
        </Typography>
      </Stack>
    )
  }

  const handleToggleImprove = (skillName: SkillKey, numericRating: number) => {
    const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skillName) ?? null
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
    } else {
      const newEntry: Omit<SkillIncreaseEntry, "id"> = {
        type: ImprovementType.skillIncrease,
        skillType: "LanguageSkill",
        skill: skillName,
        baseRating: numericRating,
        newRating: numericRating + 1,
      }
      improvementStore.add(newEntry)
    }
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="overline" color="text.secondary">Languages</Typography>

      {languageSkills.map((skill) => {
        const isNative = skill.rating === "native"
        const numericRating: number = skill.rating === "native" ? MAX_SKILL_RATING : skill.rating
        const karmaCost = (numericRating + 1) * 2
        const isAtMax = isNative || numericRating >= MAX_SKILL_RATING
        const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skill.name) ?? null
        const canAffordImprove = queuedEntry !== null || karmaCost <= remainingKarma

        return (
          <Box
            key={skill.name}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1,
              py: 0.75,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              opacity: !canAffordImprove && !queuedEntry && !isAtMax ? 0.45 : 1,
            }}
          >
            <RiChat4Line
              size={14}
              style={{ color: "var(--mui-palette-secondary-main)", flexShrink: 0 }}
            />
            <Typography variant="body2" sx={{ flex: 1 }}>{skill.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {isNative ? "Native" : skill.rating}
            </Typography>

            {isAtMax && <Chip label={isNative ? "Native" : "Max"} size="small" />}
            {!isAtMax && (
              <Tooltip title={`Improve (${karmaCost}k)`}>
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    aria-label="Improve rating"
                    aria-pressed={queuedEntry !== null}
                    color={queuedEntry ? "success" : "primary"}
                    disabled={!canAffordImprove}
                    onClick={() => handleToggleImprove(skill.name as SkillKey, numericRating)}
                    sx={{ minWidth: 0, px: 0.75 }}
                  >
                    <RiChat4Line size={13} />
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        )
      })}
    </Stack>
  )
}
