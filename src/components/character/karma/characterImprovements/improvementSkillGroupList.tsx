import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowLeftLine, RiCheckLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { selectCurrentKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import type { SkillGroupIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { isSkillGroupIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"

import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

interface ImprovementSkillGroupListProps {
  onBack: () => void
}

export const ImprovementSkillGroupList: FC<ImprovementSkillGroupListProps> = ({ onBack }) => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const karmaStore = useKarmaStore()
  const skillGroups = useCharacterSheet((sheet) => sheet.skills.skillGroups)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedGroupIncreases = allImprovements.filter(isSkillGroupIncreaseEntry)

  if (skillGroups.length === 0) {
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
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          No skill groups found on this character.
        </Typography>
      </Stack>
    )
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

      <Paper variant="outlined">
        <List disablePadding>
          {skillGroups.map((skillGroup, index) => {
            const karmaCost = (skillGroup.rating + 1) * 2
            const queuedEntry = queuedGroupIncreases.find(
              (entry) => entry.group === skillGroup.name,
            ) ?? null
            const canAfford = queuedEntry !== null || karmaCost <= remainingKarma

            const handleToggle = () => {
              if (queuedEntry) {
                improvementStore.remove(queuedEntry.id)
              } else {
                const newEntry: Omit<SkillGroupIncreaseEntry, "id"> = {
                  type: ImprovementType.skillGroupIncrease,
                  group: skillGroup.name,
                  baseRating: skillGroup.rating,
                  newRating: skillGroup.rating + 1,
                }
                improvementStore.add(newEntry)
              }
            }

            return (
              <ListItem
                key={skillGroup.name}
                disablePadding
                divider={index < skillGroups.length - 1}
                secondaryAction={(
                  <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                    <Chip
                      label={`${karmaCost}k`}
                      size="small"
                      color={queuedEntry ? "success" : canAfford ? "default" : "warning"}
                    />
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
                  disabled={!canAfford && !queuedEntry}
                  selected={queuedEntry !== null}
                  onClick={handleToggle}
                  sx={{ minHeight: 52 }}
                >
                  <ListItemText
                    primary={`${skillGroup.name} (Group)`}
                    secondary={`${skillGroup.rating} → ${skillGroup.rating + 1}`}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Paper>
    </Stack>
  )
}
