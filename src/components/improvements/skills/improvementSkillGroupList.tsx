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
import { RiAddLine, RiCheckLine } from "@remixicon/react"
import type { FC } from "react"

import { ImprovementQueuedLearnRow } from "#/components/improvements/improvementQueuedLearnRow.tsx"
import { ImprovementsConfig } from "#/components/improvements/improvementsConfig.ts"
import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import { KarmaValue } from "#/components/runner/karma/karmaValue.tsx"
import {
  useActiveSkillGroupDialog,
} from "#/components/runner/skills/activeSkills/dialogs/activeSkillGroupFormDialog.tsx"
import { useSpendKarmaDialogContext } from "#/lib/contexts/improvements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "#/lib/hooks/improvements/useImprovementSelector.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { getSkillGroupCap } from "#/system/karma/improvements/improvementCaps.ts"
import type {
  LearnSkillGroupEntry,
  SkillGroupIncreaseEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  isLearnSkillGroupEntry,
  isSkillGroupIncreaseEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"

export const ImprovementSkillGroupList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const skillGroups = useRunnerSelector(({ skills }) => skills.skillGroups)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)
  const activeSkillGroupDialog = useActiveSkillGroupDialog()

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedGroupIncreases = allImprovements.filter(isSkillGroupIncreaseEntry)
  const queuedLearns = allImprovements.filter(isLearnSkillGroupEntry)

  const openLearnDialog = async () => {
    const disabledGroups = new Set<string>([
      ...skillGroups.map((group) => group.name),
      ...queuedLearns.map((entry) => entry.group.name),
    ])
    const saved = await activeSkillGroupDialog.open({ disabledGroups })
    if (!saved) return
    const newEntry: Omit<LearnSkillGroupEntry, "id"> = {
      type: ImprovementType.learnSkillGroup,
      group: saved,
    }
    improvementStore.add(newEntry)
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      {(skillGroups.length > 0 || queuedLearns.length > 0) && (
        <Paper variant="outlined">
          <List disablePadding>
            {skillGroups.map((skillGroup, index) => {
              const karmaCost = (skillGroup.rating + 1) * 5
              const cap = getSkillGroupCap()
              const isAtMax = skillGroup.rating >= cap
              const queuedEntry = queuedGroupIncreases.find(
                (entry) => entry.group === skillGroup.name,
              ) ?? null
              const canAfford = queuedEntry !== null || karmaCost <= remainingKarma
              const improveDisabled = isAtMax || (!canAfford && !queuedEntry)
              const isLast = index === skillGroups.length - 1 && queuedLearns.length === 0

              const handleToggle = () => {
                if (queuedEntry) {
                  improvementStore.remove(queuedEntry.id)
                  return
                }
                if (isAtMax) return
                const newEntry: Omit<SkillGroupIncreaseEntry, "id"> = {
                  type: ImprovementType.skillGroupIncrease,
                  group: skillGroup.name,
                  baseRating: skillGroup.rating,
                  newRating: skillGroup.rating + 1,
                }
                improvementStore.add(newEntry)
              }

              return (
                <ListItem
                  key={skillGroup.name}
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
                              color={queuedEntry ? "success" : canAfford ? "default" : "warning"}
                            />
                          )}
                      {queuedEntry && (
                        <RiCheckLine
                          size={14}
                          style={{ color: "var(--mui-palette-success-main)" }}
                        />
                      )}
                    </Stack>
                  )}
                >
                  <ListItemButton
                    aria-label="Improve rating"
                    disabled={improveDisabled}
                    aria-pressed={queuedEntry !== null}
                    onClick={handleToggle}
                    sx={{ minHeight: 52 }}
                  >
                    <ListItemText
                      primary={`${skillGroup.name} (Group)`}
                      secondary={isAtMax
                        ? `Rating ${skillGroup.rating}`
                        : `${skillGroup.rating} → ${skillGroup.rating + 1}`}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
            {queuedLearns.map((entry, index) => (
              <ImprovementQueuedLearnRow
                key={entry.id}
                primary={`${entry.group.name} (Group)`}
                secondary={`New group · Rating ${entry.group.rating}`}
                cost={getImprovementCost(entry)}
                isLastRow={index === queuedLearns.length - 1}
                onRemove={() => improvementStore.remove(entry.id)}
              />
            ))}
          </List>
        </Paper>
      )}

      {skillGroups.length === 0 && queuedLearns.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          No skill groups found on this runner.
        </Typography>
      )}

      <Tooltip title="Cost for rating 1 — a higher starting rating costs more">
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<RiAddLine size={14} />}
          endIcon={<KarmaValue amount={ImprovementsConfig.skills.group.karmaCost.learnNew} />}
          onClick={openLearnDialog}
          sx={{ alignSelf: "flex-start" }}
        >
          Learn New Group
        </Button>
      </Tooltip>

      {activeSkillGroupDialog.dialog}
    </Stack>
  )
}
