import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { selectCurrentKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import {
  useActiveSkillDialog,
} from "#/components/character/skills/activeSkills/dialogs/activeSkillFormDialog.tsx"
import type {
  LearnActiveSkillEntry,
  SkillIncreaseEntry,
  SkillSpecializationEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  isLearnActiveSkillEntry,
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

import { ImprovementActiveSkillRow } from "./improvementActiveSkillRow.tsx"
import { ImprovementQueuedLearnRow } from "./improvementQueuedLearnRow.tsx"
import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

interface SkillRow {
  name: SkillKey
  rating: number
  isGrouped: boolean
}

// onBack kept for interface compatibility during dialog migration; not rendered
interface ImprovementActiveSkillListProps {
  onBack?: () => void
}

export const ImprovementActiveSkillList: FC<ImprovementActiveSkillListProps> = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const karmaStore = useKarmaStore()
  const activeSkills = useCharacterSheet((sheet) => sheet.skills.activeSkills)
  const skillGroups = useCharacterSheet((sheet) => sheet.skills.skillGroups)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
  const activeSkillDialog = useActiveSkillDialog()

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedSkillIncreases = allImprovements
    .filter(isSkillIncreaseEntry)
    .filter((entry) => entry.skillType === "ActiveSkill")
  const queuedSpecs = allImprovements
    .filter(isSkillSpecializationEntry)
    .filter((entry) => entry.skillType === "ActiveSkill")
  const queuedLearns = allImprovements.filter(isLearnActiveSkillEntry)

  const groupedSkillRows: SkillRow[] = skillGroups.flatMap((group) =>
    getSkillsInGroup(group.name).map((skillKey) => ({
      name: skillKey,
      rating: group.rating,
      isGrouped: true,
    })),
  )

  const standaloneRows: SkillRow[] = activeSkills.map((skill) => ({
    name: skill.name,
    rating: skill.rating,
    isGrouped: false,
  }))

  const allSkillRows: SkillRow[] = [...standaloneRows, ...groupedSkillRows]

  const handleToggleImprove = (skill: SkillRow) => {
    const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skill.name) ?? null
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
    } else {
      const newEntry: Omit<SkillIncreaseEntry, "id"> = {
        type: ImprovementType.skillIncrease,
        skillType: "ActiveSkill",
        skill: skill.name,
        baseRating: skill.rating,
        newRating: skill.rating + 1,
      }
      improvementStore.add(newEntry)
    }
  }

  const handleToggleSpec = (skill: SkillRow) => {
    const queuedEntry = queuedSpecs.find((entry) => entry.skill === skill.name) ?? null
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
    } else {
      const newEntry: Omit<SkillSpecializationEntry, "id"> = {
        type: ImprovementType.skillSpecialization,
        skillType: "ActiveSkill",
        skill: skill.name,
        specialization: "New Spec",
      }
      improvementStore.add(newEntry)
    }
  }

  const openLearnDialog = async () => {
    const skillsCoveredByGroups = new Set<string>(
      skillGroups.flatMap((group) => getSkillsInGroup(group.name)),
    )
    const disabledSkills = new Set<string>([
      ...activeSkills.map((skill) => skill.name),
      ...skillsCoveredByGroups,
      ...queuedLearns.map((entry) => entry.skill.name),
    ])
    const saved = await activeSkillDialog.open({ disabledSkills })
    if (!saved) return
    const newEntry: Omit<LearnActiveSkillEntry, "id"> = {
      type: ImprovementType.learnActiveSkill,
      skill: saved,
    }
    improvementStore.add(newEntry)
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="overline" color="text.secondary">Active Skills</Typography>

      {skillGroups.length > 0 && (
        <Alert severity="info" sx={{ py: 0.25 }}>
          <Typography variant="caption">
            Skills marked ⚠ belong to groups — improving them individually will break the group.
          </Typography>
        </Alert>
      )}

      {allSkillRows.length > 0 && (
        <Paper variant="outlined">
          <List disablePadding>
            {allSkillRows.map((skill, index) => (
              <ImprovementActiveSkillRow
                key={`${skill.name}-${String(skill.isGrouped)}`}
                skillName={skill.name}
                rating={skill.rating}
                isGrouped={skill.isGrouped}
                isLastRow={index === allSkillRows.length - 1 && queuedLearns.length === 0}
                remainingKarma={remainingKarma}
                isImproveQueued={queuedSkillIncreases.some((entry) => entry.skill === skill.name)}
                isSpecQueued={queuedSpecs.some((entry) => entry.skill === skill.name)}
                onToggleImprove={() => handleToggleImprove(skill)}
                onToggleSpec={() => handleToggleSpec(skill)}
              />
            ))}
            {queuedLearns.map((entry, index) => (
              <ImprovementQueuedLearnRow
                key={entry.id}
                primary={entry.skill.name}
                secondary={`New skill · Rating ${entry.skill.rating}`}
                cost={getImprovementCost(entry)}
                isLastRow={index === queuedLearns.length - 1}
                onRemove={() => improvementStore.remove(entry.id)}
              />
            ))}
          </List>
        </Paper>
      )}

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={openLearnDialog}
        sx={{ alignSelf: "flex-start" }}
      >
        Learn New Skill
      </Button>
    </Stack>
  )
}
