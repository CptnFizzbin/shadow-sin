import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillGroupRatingMax } from "#/system/skills/skillUtils.ts"

import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"

const skillGroupKarmaCost = (newRating: number) => 2 * newRating

export const SpendKarmaSkillGroupTab: FC = () => {
  const {
    availableSkillGroups,
    selectedSkillGroupKey,
    setSelectedSkillGroupKey,
  } = useSpendKarmaDialogContext()

  if (availableSkillGroups.length === 0) {
    return (
      <Typography color="text.secondary">
        No skill groups available to increase. Skill groups have a maximum rating
        of {SkillGroupRatingMax}.
      </Typography>
    )
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Skill Group</InputLabel>
      <Select
        value={selectedSkillGroupKey}
        label="Skill Group"
        onChange={(e) => setSelectedSkillGroupKey(e.target.value as SkillGroupKey)}
      >
        {availableSkillGroups.map((group) => {
          const newRating = group.rating + 1
          const cost = skillGroupKarmaCost(newRating)
          return (
            <MenuItem key={group.name} value={group.name}>
              <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}>
                <Typography>{group.name}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: "small" }}>
                  {group.rating} → {newRating} &nbsp;·&nbsp; {cost} karma
                </Typography>
              </Stack>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
