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

import { ImprovementQueuedLearnRow } from "#app/components/runner/karma/improvements/improvementQueuedLearnRow.tsx"
import { useSpendKarmaDialogContext } from "#app/components/runner/karma/spendKarmaDialogContext.tsx"
import { KarmaChip } from "#app/components/runner/karma/viewer/karmaChip.tsx"
import { KarmaValue } from "#app/components/runner/karma/viewer/karmaValue.tsx"
import { useLanguageSkillDialog } from "#app/components/skills/viewer/knowledgeSkills/dialogs/languageSkillDialog.tsx"
import { useImprovementSelector } from "#app/hooks/improvements/useImprovementSelector.ts"
import type {
  LearnLanguageSkillEntry,
  SkillIncreaseEntry,
} from "#data/karma/improvements/improvementEntry.ts"
import { isLearnLanguageSkillEntry, isSkillIncreaseEntry } from "#data/karma/improvements/improvementEntry.ts"
import { ImprovementType } from "#data/karma/improvements/improvementType.ts"
import type { SkillKey } from "#data/skills/skillKey.ts"
import { getLanguageSkillCap } from "#rules/karma/improvements/improvementCaps.ts"
import { getImprovementCost } from "#rules/karma/improvements/improvementUtils.ts"
import { ImprovementsConfig } from "#rules/karma/improvements/improvementsConfig.ts"
import { selectAllImprovements, selectImprovementsTotalCost } from "#state/improvements/improvementSelectors.ts"
import { KarmaSelectors } from "#state/runner/karma/karma.selector.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#state/runner/skills/skills.selector.ts"

export const ImprovementLanguageSkillList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const languageSkills = useRunnerSelector(SkillsSelectors.selectLanguageSkills)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
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
    if (saved.isNative) return // Native languages can't be learned via karma
    const newEntry: Omit<LearnLanguageSkillEntry, "id"> = {
      type: ImprovementType.learnLanguageSkill,
      skill: { id: saved.id, name: saved.name, isNative: false, rating: saved.rating ?? 0, lingo: saved.lingo },
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
              const isNative = skill.isNative
              const numericRating: number = skill.isNative ? cap : (skill.rating ?? 0)
              const karmaCost = (numericRating + 1) * 1
              const isAtMax = isNative || numericRating >= cap
              const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skill.name) ?? null
              const canAffordImprove = queuedEntry !== null || karmaCost <= remainingKarma
              const improveDisabled = isAtMax || (!canAffordImprove && !queuedEntry)
              const isLast = index === languageSkills.length - 1 && queuedLearns.length === 0

              return (
                <ListItem
                  key={skill.id}
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
                          ? `Rating ${numericRating}`
                          : `${numericRating} → ${numericRating + 1}`}
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

      {languageSkillDialog.outlet}
    </Stack>
  )
}
