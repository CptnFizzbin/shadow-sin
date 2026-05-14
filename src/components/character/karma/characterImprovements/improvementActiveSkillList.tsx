import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { selectCurrentKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import type { SkillIncreaseEntry, SkillSpecializationEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  isSkillIncreaseEntry,
  isSkillSpecializationEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { ImprovementActiveSkillRow } from "./improvementActiveSkillRow.tsx"
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

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedSkillIncreases = allImprovements
    .filter(isSkillIncreaseEntry)
    .filter((entry) => entry.skillType === "ActiveSkill")
  const queuedSpecs = allImprovements
    .filter(isSkillSpecializationEntry)
    .filter((entry) => entry.skillType === "ActiveSkill")

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

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="overline" color="text.secondary">Active Skills</Typography>

      {skillGroups.length > 0 && (
        <Alert severity="info" sx={{ py: 0.25 }}>
          <Typography variant="caption">
            Skills marked ⚠ belong to groups — improving them individually will break the group.
          </Typography>
        </Alert>
      )}

      {allSkillRows.map((skill) => (
        <ImprovementActiveSkillRow
          key={`${skill.name}-${String(skill.isGrouped)}`}
          skillName={skill.name}
          rating={skill.rating}
          isGrouped={skill.isGrouped}
          remainingKarma={remainingKarma}
          isImproveQueued={queuedSkillIncreases.some((entry) => entry.skill === skill.name)}
          isSpecQueued={queuedSpecs.some((entry) => entry.skill === skill.name)}
          onToggleImprove={() => handleToggleImprove(skill)}
          onToggleSpec={() => handleToggleSpec(skill)}
        />
      ))}
    </Stack>
  )
}
