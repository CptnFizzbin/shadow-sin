import { Box, Paper, Stack, Typography } from '@mui/material'
import { FC } from 'react'

import { DamageType } from '../System/Damage/DamageType'
import { DicePool } from '../UI/DicePool'
import { ActiveSkills } from './ActiveSkills'
import { CharacterActiveSkill } from './CharacterSkill'

interface SkillListProps {
  charSkills: CharacterActiveSkill[]
}

export const ActiveSkillList: FC<SkillListProps> = ({
  charSkills,
}) => {
  return (
    <Stack gap={1} direction="row" sx={{ flexWrap: 'wrap' }}>
      {charSkills.map(skill => (
        <ActiveSkillRow key={skill.id} charSkill={skill} />
      ))}
    </Stack>
  )
}

interface SkillListRowProps {
  charSkill: CharacterActiveSkill
}

const ActiveSkillRow: FC<SkillListRowProps> = ({
  charSkill,
}) => {
  const activeSkill = ActiveSkills[charSkill.id]

  return (
    <Box sx={{ width: 175 }}>
      <div>
        <Typography sx={{ color: 'primary.main', display: 'inline' }}>{charSkill.id}</Typography>
        <Typography sx={{ paddingLeft: 1, display: 'inline' }}>{charSkill.rank}</Typography>
      </div>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Stack gap={1}>
          <DicePool
            name={activeSkill.name}
            poolKey={`activeSkill.${activeSkill.name}.${activeSkill.attr}`}
            attrs={[activeSkill.attr]}
            skills={[activeSkill.name]}
            dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
          />

          {activeSkill.altAttr && (
            <DicePool
              name={activeSkill.name}
              poolKey={`activeSkill.${activeSkill.name}.${activeSkill.altAttr}`}
              attrs={[activeSkill.altAttr]}
              skills={[activeSkill.name]}
              dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
            />
          )}
        </Stack>

        <Typography variant="caption">
          {charSkill.specialization && <> S. {charSkill.specialization} (+2)</>}
          {charSkill.expertise && <> E. {charSkill.expertise} (+3)</>}
        </Typography>
      </Paper>
    </Box>
  )
}
