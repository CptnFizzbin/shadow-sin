import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { ImprovementQueuedLearnRow } from "#/components/runner/karma/improvements/improvementQueuedLearnRow.tsx"
import { ImprovementsConfig } from "#/components/runner/karma/improvements/improvementsConfig.ts"
import { useSpendKarmaDialogContext } from "#/components/runner/karma/spendKarmaDialogContext.tsx"
import { KarmaValue } from "#/components/runner/karma/viewer/karmaValue.tsx"
import { getSkillsInGroup } from "#/components/skills/builder/activeSkills/skillGroupUtils.ts"
import { useActiveSkillDialog } from "#/components/skills/viewer/activeSkills/dialogs/activeSkillFormDialog.tsx"
import { useImprovementSelector } from "#/hooks/improvements/useImprovementSelector.ts"
import { selectAllImprovements, selectImprovementsTotalCost } from "#/services/improvements/improvementSelectors.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { getImprovementCost } from "#/system/formulas/karma/improvements/improvementUtils.ts"
import { getActiveSkillCap, hasAptitudeFor } from "#/system/model/karma/improvements/improvementCaps.ts"
import type { LearnActiveSkillEntry, SkillIncreaseEntry } from "#/system/model/karma/improvements/improvementEntry.ts"
import { isLearnActiveSkillEntry, isSkillIncreaseEntry } from "#/system/model/karma/improvements/improvementEntry.ts"
import { ImprovementType } from "#/system/model/karma/improvements/improvementType.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"

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
  const sheet = useRunnerSelector(ViewerStateSelectors.selectRunner)
  const activeSkills = useRunnerSelector(SkillsSelectors.selectActiveSkills)
  const skillGroups = useRunnerSelector(SkillsSelectors.selectSkillGroups)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
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

      {activeSkillDialog.outlet}
    </Stack>
  )
}
