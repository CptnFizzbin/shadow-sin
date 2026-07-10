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
import {
  getActiveSkillCap,
  hasAptitudeFor,
} from "#/system/karma/improvements/improvementCaps.ts"
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
import { skillList } from "#/system/skills/skillList.ts"

import { ImprovementActiveSkillRow } from "./improvementActiveSkillRow.tsx"
import { ImprovementQueuedLearnRow } from "./improvementQueuedLearnRow.tsx"
import { useSpecializationPickerDialog } from "./specializationPickerDialog.tsx"
import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

function getActiveSkillSpecOptions(skill: SkillKey) {
  const specs = skillList[skill]?.specializations ?? []
  return {
    fixedOptions: specs.filter((s): s is string => typeof s === "string"),
    customPlaceholders: specs
      .filter((s): s is { custom: true, placeholder: string } => typeof s === "object" && s !== null)
      .map((s) => s.placeholder),
  }
}

interface SkillRow {
  name: SkillKey
  rating: number
  isGrouped: boolean
  cap: number
  hasAptitude: boolean
}

// onBack kept for interface compatibility during dialog migration; not rendered
interface ImprovementActiveSkillListProps {
  onBack?: () => void
}

export const ImprovementActiveSkillList: FC<ImprovementActiveSkillListProps> = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const karmaStore = useKarmaStore()
  const sheet = useCharacterSheet((s) => s)
  const activeSkills = useCharacterSheet((s) => s.skills.activeSkills)
  const skillGroups = useCharacterSheet((s) => s.skills.skillGroups)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
  const activeSkillDialog = useActiveSkillDialog()
  const specializationDialog = useSpecializationPickerDialog()

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
      cap: getActiveSkillCap(sheet, skillKey),
      hasAptitude: hasAptitudeFor(sheet, skillKey),
    })),
  )

  const standaloneRows: SkillRow[] = activeSkills.map((skill) => ({
    name: skill.name,
    rating: skill.rating,
    isGrouped: false,
    cap: getActiveSkillCap(sheet, skill.name),
    hasAptitude: hasAptitudeFor(sheet, skill.name),
  }))

  const allSkillRows: SkillRow[] = [...standaloneRows, ...groupedSkillRows]

  const handleToggleImprove = (skill: SkillRow) => {
    const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skill.name) ?? null
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
      return
    }
    if (skill.rating >= skill.cap) return
    const newRating = skill.rating + 1
    const newEntry: Omit<SkillIncreaseEntry, "id"> = {
      type: ImprovementType.skillIncrease,
      skillType: "ActiveSkill",
      skill: skill.name,
      baseRating: skill.rating,
      newRating,
      ...(skill.hasAptitude && newRating > 6 ? { boostedByAptitude: true } : {}),
    }
    improvementStore.add(newEntry)
  }

  const handleToggleSpec = async (skill: SkillRow) => {
    const queuedEntry = queuedSpecs.find((entry) => entry.skill === skill.name) ?? null
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
      return
    }
    const specialization = await specializationDialog.open({
      skillLabel: skill.name,
      ...getActiveSkillSpecOptions(skill.name),
    })
    if (!specialization) return
    const newEntry: Omit<SkillSpecializationEntry, "id"> = {
      type: ImprovementType.skillSpecialization,
      skillType: "ActiveSkill",
      skill: skill.name,
      specialization,
    }
    improvementStore.add(newEntry)
  }

  const handleEditSpec = async (skill: SkillRow) => {
    const queuedEntry = queuedSpecs.find((entry) => entry.skill === skill.name) ?? null
    if (!queuedEntry) return
    const specialization = await specializationDialog.open({
      skillLabel: skill.name,
      ...getActiveSkillSpecOptions(skill.name),
      initialValue: queuedEntry.specialization,
    })
    if (!specialization) return
    const replacement: Omit<SkillSpecializationEntry, "id"> = {
      type: ImprovementType.skillSpecialization,
      skillType: "ActiveSkill",
      skill: skill.name,
      specialization,
    }
    improvementStore.remove(queuedEntry.id)
    improvementStore.add(replacement)
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
            {allSkillRows.map((skill, index) => {
              const queuedSpec = queuedSpecs.find((entry) => entry.skill === skill.name)
              return (
                <ImprovementActiveSkillRow
                  key={`${skill.name}-${String(skill.isGrouped)}`}
                  skillName={skill.name}
                  rating={skill.rating}
                  cap={skill.cap}
                  hasAptitude={skill.hasAptitude}
                  isGrouped={skill.isGrouped}
                  isLastRow={index === allSkillRows.length - 1 && queuedLearns.length === 0}
                  remainingKarma={remainingKarma}
                  isImproveQueued={queuedSkillIncreases.some((entry) => entry.skill === skill.name)}
                  isSpecQueued={!!queuedSpec}
                  queuedSpecName={queuedSpec?.specialization}
                  onToggleImprove={() => handleToggleImprove(skill)}
                  onToggleSpec={() => handleToggleSpec(skill)}
                  onEditSpec={() => handleEditSpec(skill)}
                />
              )
            })}
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

      {activeSkillDialog.dialog}
      {specializationDialog.dialog}
    </Stack>
  )
}
