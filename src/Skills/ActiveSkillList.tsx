import { Box, Paper, Stack, Typography } from "@mui/material"
import { FC } from "react"

import { DamageType } from "../System/Damage/DamageType"
import { DicePool } from "../UI/DicePool"
import { ActiveSkills, formatSkill } from "./ActiveSkills"
import { CharacterActiveSkill } from "./CharacterSkill"

interface SkillListProps {
  charSkills: CharacterActiveSkill[]
}

export const ActiveSkillList: FC<SkillListProps> = ({ charSkills }) => {
  return (
    <Stack gap={1} direction="row" sx={{ flexWrap: "wrap" }}>
      {charSkills.map((skill) => (
        <ActiveSkillRow key={skill.id} charSkill={skill} />
      ))}
    </Stack>
  )
}

interface SkillListRowProps {
  charSkill: CharacterActiveSkill
}

const ActiveSkillRow: FC<SkillListRowProps> = ({ charSkill }) => {
  const activeSkill = ActiveSkills[charSkill.id]

  return (
    <Box sx={{ width: 200 }}>
      <div>
        <Typography sx={{ color: "primary.main", display: "inline" }}>
          {formatSkill(charSkill.id)}
        </Typography>
        <Typography sx={{ paddingLeft: 1, display: "inline" }}>
          {charSkill.rank}
        </Typography>
      </div>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Stack gap={1}>
          <DicePool
            name={formatSkill(activeSkill.id)}
            poolKey={`activeSkill.${activeSkill.name}.${activeSkill.attr}`}
            attrs={[activeSkill.attr]}
            skills={[activeSkill.id]}
            dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
          />

          {activeSkill.altAttr && (
            <DicePool
              name={formatSkill(activeSkill.id)}
              poolKey={`activeSkill.${activeSkill.name}.${activeSkill.altAttr}`}
              attrs={[activeSkill.altAttr]}
              skills={[activeSkill.id]}
              dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
            />
          )}
        </Stack>

        <Typography variant="caption">
          {charSkill.specialization && (
            <div> S. {charSkill.specialization} (+2)</div>
          )}
          {charSkill.expertise && <div> E. {charSkill.expertise} (+3)</div>}
        </Typography>
      </Paper>
    </Box>
  )
}
