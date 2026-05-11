import AddIcon from "@mui/icons-material/Add"
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { SkillRatingMax } from "#/system/skills/skillUtils.ts"

import { useSpendKarmaDialogContext } from "./forms/spendKarmaDialogContext.tsx"
import { selectQueuedActiveSkills, useImprovementsSelector } from "./improvements.selectors.ts"
import { calcActiveSkillKarmaCost } from "./improvementsKarmaCost.ts"
import type { IncreaseSkillEntry } from "./types/increaseSkillEntry.ts"

export const IncreaseSkillTab: FC = () => {
  const { improvementsStore } = useSpendKarmaDialogContext()
  const [selectedIncreaseSkillKey, setSelectedIncreaseSkillKey] = useState<SkillKey | "">("")
  const activeSkills = useCharacterSheetSelector((sheet) => sheet.skills.activeSkills)
  const skillGroups = useCharacterSheetSelector((sheet) => sheet.skills.skillGroups)

  const queuedSkills = useImprovementsSelector(selectQueuedActiveSkills)

  const allIncreaseSkills: IncreaseSkillEntry[] = [
    ...activeSkills
      .filter((skill) => skill.rating < SkillRatingMax)
      .map((skill) => ({ key: skill.name, currentRating: skill.rating })),
    ...skillGroups.flatMap((group) => {
      return getSkillsInGroup(group.name)
        .filter((skillKey) => !activeSkills.find((skill) => skill.name === skillKey))
        .map((skillKey) => ({
          key: skillKey,
          currentRating: group.rating,
          groupToBreak: group.name,
        }))
    }),
  ]

  const availableIncreaseSkills = allIncreaseSkills.filter(
    (entry) => !queuedSkills.has(entry.key),
  )

  const selectedIncreaseSkillEntry = availableIncreaseSkills.find(
    (entry) => entry.key === selectedIncreaseSkillKey,
  )

  const handleAdd = () => {
    if (!selectedIncreaseSkillEntry) return
    const nextRating = selectedIncreaseSkillEntry.currentRating + 1
    improvementsStore.improveActiveSkill(selectedIncreaseSkillEntry.key, nextRating)
    setSelectedIncreaseSkillKey("")
  }

  if (availableIncreaseSkills.length === 0) {
    return (
      <Typography color="text.secondary">
        No skills available to increase. Learn a new skill first, or all skills are already at
        max rating ({SkillRatingMax}).
      </Typography>
    )
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Skill</InputLabel>
        <Select
          value={selectedIncreaseSkillKey}
          label="Skill"
          onChange={(event) => setSelectedIncreaseSkillKey(event.target.value as SkillKey | "")}
        >
          {availableIncreaseSkills.map((entry) => {
            const newRating = entry.currentRating + 1
            const cost = calcActiveSkillKarmaCost(newRating)
            return (
              <MenuItem key={entry.key} value={entry.key}>
                <Stack
                  direction="row"
                  sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}
                >
                  <Typography>{entry.key}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "small" }}>
                    {entry.currentRating} → {newRating}
                    {entry.groupToBreak ? ` (breaks ${entry.groupToBreak})` : ""}
                    &nbsp;·&nbsp; {cost} karma
                  </Typography>
                </Stack>
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>

      {selectedIncreaseSkillEntry?.groupToBreak && (
        <Alert severity="info">
          Increasing <strong>{selectedIncreaseSkillEntry.key}</strong> individually will break the{" "}
          <strong>{selectedIncreaseSkillEntry.groupToBreak}</strong> skill group. All member skills
          will be set to the current group rating of {selectedIncreaseSkillEntry.currentRating} as
          individual skills.
        </Alert>
      )}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        disabled={!selectedIncreaseSkillKey}
        onClick={handleAdd}
        fullWidth
      >
        Add Skill
      </Button>
    </Stack>
  )
}
