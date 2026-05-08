import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"

export const SpendKarmaNewSkillTab: FC = () => {
  const {
    availableNewSkills,
    selectedNewSkillKey,
    setSelectedNewSkillKey,
  } = useSpendKarmaDialogContext()

  if (availableNewSkills.length === 0) {
    return (
      <Typography color="text.secondary">
        All skills are already known.
      </Typography>
    )
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Skill</InputLabel>
      <Select
        value={selectedNewSkillKey}
        label="Skill"
        onChange={(e) => setSelectedNewSkillKey(e.target.value as SkillKey)}
      >
        {[...availableNewSkills].sort().map((skillKey) => {
          const info = skillList[skillKey]
          return (
            <MenuItem key={skillKey} value={skillKey}>
              <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}>
                <Typography>{skillKey}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: "small" }}>
                  {info?.group ?? ""}
                </Typography>
              </Stack>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
