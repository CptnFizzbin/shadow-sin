import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiArrowLeftLine, RiCheckLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { selectCurrentKarma } from "#/components/runner/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/runner/karma/useKarmaStore.ts"
import { useRunnerData } from "#/components/runner/sheet/runnerDataProvider.tsx"
import {
  useActiveSkillGroupDialog,
} from "#/components/runner/skills/activeSkills/dialogs/activeSkillGroupFormDialog.tsx"
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

import { ImprovementQueuedLearnRow } from "./improvementQueuedLearnRow.tsx"
import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

interface ImprovementSkillGroupListProps {
  onBack: () => void
}

export const ImprovementSkillGroupList: FC<ImprovementSkillGroupListProps> = ({ onBack }) => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const karmaStore = useKarmaStore()
  const skillGroups = useRunnerData((sheet) => sheet.skills.skillGroups)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
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
      <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
        <IconButton size="small" onClick={onBack} aria-label="Back to categories">
          <RiArrowLeftLine size={16} />
        </IconButton>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", flex: 1 }}>
          Skill Groups
        </Typography>
      </Stack>

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
                            <Chip
                              label={`${karmaCost}k`}
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

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={openLearnDialog}
        sx={{ alignSelf: "flex-start" }}
      >
        Learn New Group
      </Button>

      {activeSkillGroupDialog.dialog}
    </Stack>
  )
}
