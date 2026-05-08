import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useEffect, useState } from "react"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { useSpendKarmaDialogContext } from "./forms/spendKarmaDialogContext.tsx"
import { ImprovementsStore } from "./improvementsStore.ts"

export const NewSkillTab: FC = () => {
  const { setPendingImprovement } = useSpendKarmaDialogContext()
  const [selectedNewSkillKey, setSelectedNewSkillKey] = useState<SkillKey | "">("")
  const activeSkills = useCharacterSheetSelector((sheet) => sheet.skills.activeSkills)
  const skillGroups = useCharacterSheetSelector((sheet) => sheet.skills.skillGroups)

  const existingSkills = new Set(activeSkills.map((skill) => skill.name))
  const coveredSkills = new Set(skillGroups.flatMap((group) => getSkillsInGroup(group.name)))
  const availableNewSkills = (Object.keys(skillList) as SkillKey[]).filter(
    (skillKey) => !existingSkills.has(skillKey) && !coveredSkills.has(skillKey),
  )

  useEffect(() => {
    if (!selectedNewSkillKey) {
      setPendingImprovement(null)
      return
    }

    const improvementsStore = new ImprovementsStore({ improvements: [] })
    improvementsStore.improveActiveSkill(selectedNewSkillKey, 1)

    setPendingImprovement({ improvementsStore })
  }, [selectedNewSkillKey, setPendingImprovement])

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
        onChange={(event) => setSelectedNewSkillKey(event.target.value as SkillKey | "")}
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
