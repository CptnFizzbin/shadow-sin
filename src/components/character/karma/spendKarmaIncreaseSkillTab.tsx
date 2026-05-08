import Alert from "@mui/material/Alert"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { SkillKey } from "#/system/skills/skillKey.ts"
import { SkillRatingMax } from "#/system/skills/skillUtils.ts"

import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"

const increaseSkillKarmaCost = (newRating: number) => 2 * newRating

export const SpendKarmaIncreaseSkillTab: FC = () => {
  const {
    availableIncreaseSkills,
    selectedIncreaseSkillKey,
    setSelectedIncreaseSkillKey,
    selectedIncreaseSkillEntry,
  } = useSpendKarmaDialogContext()

  if (availableIncreaseSkills.length === 0) {
    return (
      <Typography color="text.secondary">
        No skills available to increase. Learn a new skill first, or all skills are already at
        max rating ({SkillRatingMax}).
      </Typography>
    )
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Skill</InputLabel>
        <Select
          value={selectedIncreaseSkillKey}
          label="Skill"
          onChange={(e) => setSelectedIncreaseSkillKey(e.target.value as SkillKey)}
        >
          {availableIncreaseSkills.map((entry) => {
            const newRating = entry.currentRating + 1
            const cost = increaseSkillKarmaCost(newRating)
            return (
              <MenuItem key={entry.key} value={entry.key}>
                <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}>
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
    </Stack>
  )
}
