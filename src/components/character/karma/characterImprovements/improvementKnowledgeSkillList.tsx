import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiCheckLine, RiLightbulbLine, RiStarLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { selectCurrentKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import {
  useKnowledgeSkillDialog,
} from "#/components/character/skills/knowledgeSkills/dialogs/knowledgeSkillEditDialog.tsx"
import { getKnowledgeSkillCap } from "#/system/karma/improvements/improvementCaps.ts"
import type {
  LearnKnowledgeSkillEntry,
  SkillIncreaseEntry,
  SkillSpecializationEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  isLearnKnowledgeSkillEntry,
  isSkillIncreaseEntry,
  isSkillSpecializationEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { ImprovementQueuedLearnRow } from "./improvementQueuedLearnRow.tsx"
import { useSpecializationPickerDialog } from "./specializationPickerDialog.tsx"
import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

const SPEC_COST = 2

export const ImprovementKnowledgeSkillList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const karmaStore = useKarmaStore()
  const knowledgeSkills = useCharacterSheet((sheet) => sheet.skills.knowledgeSkills)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
  const knowledgeSkillDialog = useKnowledgeSkillDialog()
  const specializationDialog = useSpecializationPickerDialog()

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedSkillIncreases = allImprovements
    .filter(isSkillIncreaseEntry)
    .filter((entry) => entry.skillType === "KnowledgeSkill")
  const queuedSpecs = allImprovements
    .filter(isSkillSpecializationEntry)
    .filter((entry) => entry.skillType === "KnowledgeSkill")
  const queuedLearns = allImprovements.filter(isLearnKnowledgeSkillEntry)

  const handleToggleSpec = async (skillName: string, currentSpec?: string) => {
    const queuedEntry = queuedSpecs.find((entry) => entry.skill === skillName) ?? null
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
      return
    }
    const specialization = await specializationDialog.open({
      skillLabel: skillName,
      initialValue: currentSpec,
    })
    if (!specialization) return
    const newEntry: Omit<SkillSpecializationEntry, "id"> = {
      type: ImprovementType.skillSpecialization,
      skillType: "KnowledgeSkill",
      skill: skillName as SkillKey,
      specialization,
    }
    improvementStore.add(newEntry)
  }

  const handleEditSpec = async (skillName: string, queuedSpecName: string) => {
    const queuedEntry = queuedSpecs.find((entry) => entry.skill === skillName) ?? null
    if (!queuedEntry) return
    const specialization = await specializationDialog.open({
      skillLabel: skillName,
      initialValue: queuedSpecName,
    })
    if (!specialization) return
    const replacement: Omit<SkillSpecializationEntry, "id"> = {
      type: ImprovementType.skillSpecialization,
      skillType: "KnowledgeSkill",
      skill: skillName as SkillKey,
      specialization,
    }
    improvementStore.remove(queuedEntry.id)
    improvementStore.add(replacement)
  }

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
      <Typography variant="overline" color="text.secondary">Knowledge Skills</Typography>

      {(knowledgeSkills.length > 0 || queuedLearns.length > 0) && (
        <Paper variant="outlined">
          <List disablePadding>
            {knowledgeSkills.map((skill, index) => {
              const karmaCost = (skill.rating + 1) * 1
              const isAtMax = skill.rating >= getKnowledgeSkillCap()
              const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skill.name) ?? null
              const canAffordImprove = queuedEntry !== null || karmaCost <= remainingKarma
              const improveDisabled = isAtMax || (!canAffordImprove && !queuedEntry)
              const queuedSpec = queuedSpecs.find((entry) => entry.skill === skill.name) ?? null
              const canAffordSpec = queuedSpec !== null || SPEC_COST <= remainingKarma
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
                            <Chip
                              label={`${karmaCost}k`}
                              size="small"
                              color={queuedEntry ? "success" : canAffordImprove ? "default" : "warning"}
                            />
                          )}
                      {queuedEntry && (
                        <RiCheckLine size={14} style={{ color: "var(--mui-palette-success-main)" }} />
                      )}
                      {queuedSpec && (
                        <Tooltip title="Edit specialization name">
                          <Chip
                            label={queuedSpec.specialization}
                            size="small"
                            color="success"
                            variant="outlined"
                            onClick={() => handleEditSpec(skill.name, queuedSpec.specialization)}
                            sx={{ cursor: "pointer", maxWidth: 160 }}
                          />
                        </Tooltip>
                      )}
                      <Tooltip title={queuedSpec ? "Remove specialization" : `Specialization (${SPEC_COST}k)`}>
                        <span>
                          <IconButton
                            size="small"
                            aria-label={queuedSpec ? "Remove specialization" : "Add specialization"}
                            aria-pressed={queuedSpec !== null}
                            color={queuedSpec ? "success" : "default"}
                            disabled={!canAffordSpec && !queuedSpec}
                            onClick={() => handleToggleSpec(skill.name, skill.specialization)}
                          >
                            <RiStarLine size={16} />
                          </IconButton>
                        </span>
                      </Tooltip>
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

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={openLearnDialog}
        sx={{ alignSelf: "flex-start" }}
      >
        Learn New Knowledge
      </Button>
    </Stack>
  )
}
