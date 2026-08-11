import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiChat4Line, RiCheckLine } from "@remixicon/react"
import type { FC } from "react"

import { ImprovementQueuedLearnRow } from "#/components/improvements/improvementQueuedLearnRow.tsx"
import { ImprovementsConfig } from "#/components/improvements/improvementsConfig.ts"
import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import { KarmaValue } from "#/components/runner/karma/karmaValue.tsx"
import {
  useLanguageSkillDialog,
} from "#/components/runner/skills/knowledgeSkills/dialogs/languageSkillDialog.tsx"
import { useSpendKarmaDialogContext } from "#/lib/contexts/improvements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "#/lib/hooks/improvements/useImprovementSelector.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"
import { getLanguageSkillCap } from "#/system/karma/improvements/improvementCaps.ts"
import type {
  LearnLanguageSkillEntry,
  SkillIncreaseEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  isLearnLanguageSkillEntry,
  isSkillIncreaseEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

export const ImprovementLanguageSkillList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const languageSkills = useRunnerSelector(({ skills }) => skills.languageSkills)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerSelector(({ karma }) => karma.current)
  const languageSkillDialog = useLanguageSkillDialog()

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedSkillIncreases = allImprovements
    .filter(isSkillIncreaseEntry)
    .filter((entry) => entry.skillType === "LanguageSkill")
  const queuedLearns = allImprovements.filter(isLearnLanguageSkillEntry)

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

  const openLearnDialog = async () => {
    const saved = await languageSkillDialog.open()
    if (!saved) return
    if (saved.rating === "native") return // Native languages can't be learned via karma
    const newEntry: Omit<LearnLanguageSkillEntry, "id"> = {
      type: ImprovementType.learnLanguageSkill,
      skill: { name: saved.name, rating: saved.rating, lingo: saved.lingo },
    }
    improvementStore.add(newEntry)
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      {(languageSkills.length > 0 || queuedLearns.length > 0) && (
        <Paper variant="outlined">
          <List disablePadding>
            {languageSkills.map((skill, index) => {
              const cap = getLanguageSkillCap()
              const isNative = skill.rating === "native"
              const numericRating: number = skill.rating === "native" ? cap : skill.rating
              const karmaCost = (numericRating + 1) * 1
              const isAtMax = isNative || numericRating >= cap
              const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skill.name) ?? null
              const canAffordImprove = queuedEntry !== null || karmaCost <= remainingKarma
              const improveDisabled = isAtMax || (!canAffordImprove && !queuedEntry)
              const isLast = index === languageSkills.length - 1 && queuedLearns.length === 0

              return (
                <ListItem
                  key={skill.name}
                  disablePadding
                  divider={!isLast}
                  secondaryAction={(
                    <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                      {isAtMax
                        ? <Chip label={isNative ? "Native" : "Max"} size="small" />
                        : (
                            <KarmaChip
                              amount={karmaCost}
                              size="small"
                              color={queuedEntry ? "success" : canAffordImprove ? "default" : "warning"}
                            />
                          )}
                      {queuedEntry && (
                        <RiCheckLine size={14} style={{ color: "var(--mui-palette-success-main)" }} />
                      )}
                    </Stack>
                  )}
                >
                  <ListItemButton
                    aria-label="Improve rating"
                    aria-pressed={queuedEntry !== null}
                    disabled={improveDisabled}
                    onClick={() => handleToggleImprove(skill.name as SkillKey, numericRating)}
                    sx={{
                      minHeight: 52,
                      opacity: improveDisabled && !queuedEntry && !isAtMax ? 0.45 : 1,
                    }}
                  >
                    <ListItemText
                      primary={skill.name}
                      secondary={isNative
                        ? "Native"
                        : isAtMax
                          ? `Rating ${skill.rating}`
                          : `${skill.rating} → ${numericRating + 1}`}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
            {queuedLearns.map((entry, index) => (
              <ImprovementQueuedLearnRow
                key={entry.id}
                primary={entry.skill.name}
                secondary={`New language · Rating ${entry.skill.rating}`}
                cost={getImprovementCost(entry)}
                isLastRow={index === queuedLearns.length - 1}
                onRemove={() => improvementStore.remove(entry.id)}
              />
            ))}
          </List>
        </Paper>
      )}

      {languageSkills.length === 0 && queuedLearns.length === 0 && (
        <Stack sx={{ py: 2, alignItems: "center", gap: 0.5 }}>
          <RiChat4Line size={28} style={{ opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            No language skills
          </Typography>
        </Stack>
      )}

      <Tooltip title="Cost for rating 1 — a higher starting rating costs more">
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          endIcon={<KarmaValue amount={ImprovementsConfig.skills.language.karmaCost.learnNew} />}
          onClick={openLearnDialog}
          sx={{ alignSelf: "flex-start" }}
        >
          Learn New Language
        </Button>
      </Tooltip>

      {languageSkillDialog.dialog}
    </Stack>
  )
}
