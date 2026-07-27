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
import { RiAddLine, RiCheckLine, RiLightbulbLine } from "@remixicon/react"
import type { FC } from "react"

import { ImprovementQueuedLearnRow } from "#/components/improvements/improvementQueuedLearnRow.tsx"
import { ImprovementsConfig } from "#/components/improvements/improvementsConfig.ts"
import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import { KarmaValue } from "#/components/runner/karma/karmaValue.tsx"
import {
  useKnowledgeSkillDialog,
} from "#/components/runner/skills/knowledgeSkills/dialogs/knowledgeSkillEditDialog.tsx"
import { useSpendKarmaDialogContext } from "#/lib/contexts/improvements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "#/lib/hooks/improvements/useImprovementSelector.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { getKnowledgeSkillCap } from "#/system/karma/improvements/improvementCaps.ts"
import type {
  LearnKnowledgeSkillEntry,
  SkillIncreaseEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  isLearnKnowledgeSkillEntry,
  isSkillIncreaseEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

export const ImprovementKnowledgeSkillList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const knowledgeSkills = useRunnerStoreSelector(Selectors.skills.selectKnowledgeSkills)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)
  const knowledgeSkillDialog = useKnowledgeSkillDialog()

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedSkillIncreases = allImprovements
    .filter(isSkillIncreaseEntry)
    .filter((entry) => entry.skillType === "KnowledgeSkill")
  const queuedLearns = allImprovements.filter(isLearnKnowledgeSkillEntry)

  const handleToggleImprove = (skillName: SkillKey, rating: number) => {
    const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skillName) ?? null
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
    } else {
      const newEntry: Omit<SkillIncreaseEntry, "id"> = {
        type: ImprovementType.skillIncrease,
        skillType: "KnowledgeSkill",
        skill: skillName,
        baseRating: rating,
        newRating: rating + 1,
      }
      improvementStore.add(newEntry)
    }
  }

  const openLearnDialog = async () => {
    const saved = await knowledgeSkillDialog.open()
    if (!saved) return
    const newEntry: Omit<LearnKnowledgeSkillEntry, "id"> = {
      type: ImprovementType.learnKnowledgeSkill,
      skill: saved,
    }
    improvementStore.add(newEntry)
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      {(knowledgeSkills.length > 0 || queuedLearns.length > 0) && (
        <Paper variant="outlined">
          <List disablePadding>
            {knowledgeSkills.map((skill, index) => {
              const karmaCost = (skill.rating + 1) * 1
              const isAtMax = skill.rating >= getKnowledgeSkillCap()
              const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skill.name) ?? null
              const canAffordImprove = queuedEntry !== null || karmaCost <= remainingKarma
              const improveDisabled = isAtMax || (!canAffordImprove && !queuedEntry)
              const isLast = index === knowledgeSkills.length - 1 && queuedLearns.length === 0

              return (
                <ListItem
                  key={skill.name}
                  disablePadding
                  divider={!isLast}
                  secondaryAction={(
                    <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                      {isAtMax
                        ? <Chip label="Max" size="small" />
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
                    onClick={() => handleToggleImprove(skill.name as SkillKey, skill.rating)}
                    sx={{
                      minHeight: 52,
                      opacity: improveDisabled && !queuedEntry && !isAtMax ? 0.45 : 1,
                    }}
                  >
                    <ListItemText
                      primary={skill.name}
                      secondary={isAtMax ? `Rating ${skill.rating}` : `${skill.rating} → ${skill.rating + 1}`}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
            {queuedLearns.map((entry, index) => (
              <ImprovementQueuedLearnRow
                key={entry.id}
                primary={entry.skill.name}
                secondary={`New knowledge · Rating ${entry.skill.rating}`}
                cost={getImprovementCost(entry)}
                isLastRow={index === queuedLearns.length - 1}
                onRemove={() => improvementStore.remove(entry.id)}
              />
            ))}
          </List>
        </Paper>
      )}

      {knowledgeSkills.length === 0 && queuedLearns.length === 0 && (
        <Stack sx={{ py: 2, alignItems: "center", gap: 0.5 }}>
          <RiLightbulbLine size={28} style={{ opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            No knowledge skills
          </Typography>
        </Stack>
      )}

      <Tooltip title="Cost for rating 1 — a higher starting rating costs more">
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          endIcon={<KarmaValue amount={ImprovementsConfig.skills.knowledge.karmaCost.learnNew} />}
          onClick={openLearnDialog}
          sx={{ alignSelf: "flex-start" }}
        >
          Learn New Knowledge
        </Button>
      </Tooltip>

      {knowledgeSkillDialog.dialog}
    </Stack>
  )
}
