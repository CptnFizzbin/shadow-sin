import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import type { FC } from "react"

import { useActiveSkillRating } from "#/components/runner/runnerUtils.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { getSkillCandidates } from "./weaponSkillCandidates.ts"

interface SkillSelectSectionProps {
  weapon: WeaponData
  selectedSkill: SkillKey
  onSelectSkill: (skill: SkillKey) => void
}

const SkillOptionRow: FC<{ skill: SkillKey, selected: boolean, onSelect: () => void }> = ({
  skill,
  selected,
  onSelect,
}) => {
  const rating = useActiveSkillRating(skill)

  return (
    <ListItemButton selected={selected} onClick={onSelect}>
      <ListItemText primary={skill} secondary={rating > 0 ? `Rating ${rating}` : "Defaulting"} />
    </ListItemButton>
  )
}

export const SkillSelectSection: FC<SkillSelectSectionProps> = ({ weapon, selectedSkill, onSelectSkill }) => {
  const candidates = getSkillCandidates(weapon, selectedSkill)

  return (
    <Paper>
      <List disablePadding>
        {candidates.map((skill) => (
          <SkillOptionRow
            key={skill}
            skill={skill}
            selected={skill === selectedSkill}
            onSelect={() => onSelectSkill(skill)}
          />
        ))}
      </List>
    </Paper>
  )
}
