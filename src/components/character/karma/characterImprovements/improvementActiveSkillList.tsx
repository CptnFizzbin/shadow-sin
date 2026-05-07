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
import type { SkillIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { isSkillIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"

import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

interface ImprovementActiveSkillListProps {
  onBack: () => void
}

export const ImprovementActiveSkillList: FC<ImprovementActiveSkillListProps> = ({ onBack }) => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const karmaStore = useKarmaStore()
  const activeSkills = useCharacterSheet((sheet) => sheet.skills.activeSkills)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedSkillIncreases = allImprovements.filter(isSkillIncreaseEntry)

  if (activeSkills.length === 0) {
    return (
      <Stack sx={{ gap: 1.5 }}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={onBack} aria-label="Back to categories">
            <RiArrowLeftLine size={16} />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", flex: 1 }}>
            Active Skills
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          No active skills found on this character.
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
          Active Skills
        </Typography>
      </Stack>

      <Paper variant="outlined">
        <List disablePadding>
          {activeSkills.map((skill, index) => {
            const karmaCost = (skill.rating + 1) * 2
            const queuedEntry = queuedSkillIncreases.find(
              (entry) => entry.skill === skill.name,
            ) ?? null
            const canAfford = queuedEntry !== null || karmaCost <= remainingKarma

            const handleToggle = () => {
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

            return (
              <ListItem
                key={skill.name}
                disablePadding
                divider={index < activeSkills.length - 1}
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
                    primary={skill.name}
                    secondary={`${skill.rating} → ${skill.rating + 1}`}
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
