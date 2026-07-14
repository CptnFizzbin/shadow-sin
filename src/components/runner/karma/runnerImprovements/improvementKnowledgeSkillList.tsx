import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiLightbulbLine } from "@remixicon/react"
import type { FC } from "react"

import {
  useKnowledgeSkillDialog,
} from "#/components/runner/skills/knowledgeSkills/dialogs/knowledgeSkillEditDialog.tsx"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
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

import { QueuedLearnRows } from "./improvementQueuedLearnRow.tsx"
import { ImprovementSpecSkillRow } from "./improvementSpecSkillRow.tsx"
import { useSpecializationPickerDialog } from "./specializationPickerDialog.tsx"
import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

const SPEC_COST = 2

export const ImprovementKnowledgeSkillList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const knowledgeSkills = useRunnerStoreSelector(Selectors.skills.selectKnowledgeSkills)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)
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
              const queuedSpec = queuedSpecs.find((entry) => entry.skill === skill.name) ?? null
              const canAffordSpec = queuedSpec !== null || SPEC_COST <= remainingKarma
              const isLast = index === knowledgeSkills.length - 1 && queuedLearns.length === 0

              return (
                <ImprovementSpecSkillRow
                  key={skill.name}
                  skillName={skill.name}
                  secondaryText={isAtMax ? `Rating ${skill.rating}` : `${skill.rating} → ${skill.rating + 1}`}
                  maxChipLabel="Max"
                  isAtMax={isAtMax}
                  karmaCost={karmaCost}
                  isImproveQueued={queuedEntry !== null}
                  canAffordImprove={canAffordImprove}
                  onToggleImprove={() => handleToggleImprove(skill.name as SkillKey, skill.rating)}
                  isLastRow={isLast}
                  specNoun="specialization"
                  specCost={SPEC_COST}
                  isSpecQueued={queuedSpec !== null}
                  canAffordSpec={canAffordSpec}
                  queuedSpecLabel={queuedSpec?.specialization}
                  onToggleSpec={() => handleToggleSpec(skill.name, skill.specialization)}
                  onEditSpec={() => handleEditSpec(skill.name, queuedSpec?.specialization ?? "")}
                />
              )
            })}
            <QueuedLearnRows
              entries={queuedLearns}
              label="knowledge"
              getCost={getImprovementCost}
              onRemove={(id) => improvementStore.remove(id)}
            />
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

      {knowledgeSkillDialog.dialog}
      {specializationDialog.dialog}
    </Stack>
  )
}
