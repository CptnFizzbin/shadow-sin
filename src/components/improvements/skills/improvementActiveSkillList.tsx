import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { ImprovementQueuedLearnRow } from "#/components/improvements/improvementQueuedLearnRow.tsx"
import { ImprovementsConfig } from "#/components/improvements/improvementsConfig.ts"
import { useSpendKarmaDialogContext } from "#/components/improvements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "#/components/improvements/useImprovementSelector.ts"
import { KarmaValue } from "#/components/runner/karma/karmaValue.tsx"
import {
  useActiveSkillDialog,
} from "#/components/runner/skills/activeSkills/dialogs/activeSkillFormDialog.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import {
  getActiveSkillCap,
  hasAptitudeFor,
} from "#/system/karma/improvements/improvementCaps.ts"
import type {
  LearnActiveSkillEntry,
  SkillIncreaseEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  isLearnActiveSkillEntry,
  isSkillIncreaseEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { ImprovementActiveSkillRow } from "./improvementActiveSkillRow.tsx"

interface SkillRow {
  name: SkillKey
  rating: number
  isGrouped: boolean
  cap: number
  hasAptitude: boolean
}

export const ImprovementActiveSkillList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const sheet = useRunnerStoreSelector((s) => s)
  const activeSkills = useRunnerStoreSelector((s) => s.skills.activeSkills)
  const skillGroups = useRunnerStoreSelector((s) => s.skills.skillGroups)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)
  const activeSkillDialog = useActiveSkillDialog()

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedSkillIncreases = allImprovements
    .filter(isSkillIncreaseEntry)
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
                cap={skill.cap}
                hasAptitude={skill.hasAptitude}
                isGrouped={skill.isGrouped}
                isLastRow={index === allSkillRows.length - 1 && queuedLearns.length === 0}
                remainingKarma={remainingKarma}
                isImproveQueued={queuedSkillIncreases.some((entry) => entry.skill === skill.name)}
                onToggleImprove={() => handleToggleImprove(skill)}
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

      <Tooltip title="Cost for rating 1 — a higher starting rating costs more">
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          endIcon={<KarmaValue amount={ImprovementsConfig.skills.active.karmaCost.learnNew} />}
          onClick={openLearnDialog}
          sx={{ alignSelf: "flex-start" }}
        >
          Learn New Skill
        </Button>
      </Tooltip>

      {activeSkillDialog.dialog}
    </Stack>
  )
}
