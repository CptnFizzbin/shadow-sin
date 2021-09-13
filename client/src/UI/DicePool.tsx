import { Box, Paper } from '@material-ui/core'
import { FC } from 'react'

import { useSkills } from '../Character/CharacterProvider'
import { formatAttr } from '../System/Attribute'
import { useAttributes } from '../System/AttributeProvider'
import { useDamagePenalty } from '../System/Damage/DamageProvider'
import { DamageType } from '../System/Damage/DamageType'
import { formatSkill } from '../System/Skill/SkillData'

export const toDiceGroup = (input: DiceGroupLike): DiceGroup => {
  return {
    name: input.name,
    size: input.size || input.rank || input.value || 0,
  }
}

export interface DiceGroupLike {
  name: string
  size?: number
  rank?: number
  value?: number
}

export interface DiceGroup {
  name: string
  size: number | undefined
  default?: number
}

export const DicePools: FC = ({
  children,
}) => {
  return <Paper variant="outlined" sx={{ padding: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
    {children}
  </Paper>
}

export interface PoolBonus {
  value: number
  name: string
}

export interface DicePoolData {
  key: string
  name: string
  skills?: string[]
  attrs?: string[]
  bonuses?: DiceGroup[]
  dmgPenaltyTypes?: DamageType[]
}

type DicePoolProps = {
  name: string
  groups?: DiceGroup[]
  dmgPenaltyTypes?: DamageType[]
} & DicePoolData

export const DicePool: FC<DicePoolProps> = ({
  key,
  name,
  skills = [],
  attrs = [],
  bonuses = [],
  groups = [],
  dmgPenaltyTypes = [],
}) => {
  const skillList = useSkills(skills)
  const attrList = useAttributes(attrs)
  const dmgPenalty = useDamagePenalty(dmgPenaltyTypes)

  groups = [
    ...groups,
    ...Object.entries(skillList)
      .map(([skillId, rank]) => ({ name: formatSkill(skillId), size: rank })),
    ...Object.entries(attrList)
      .filter(([_, value]) => typeof value === 'number')
      .map(([attrType, value]) => ({ name: formatAttr(attrType), size: value as number })),
    ...bonuses,
  ]

  if (dmgPenalty > 0) {
    groups = [...groups, { name: 'Dmg. Penalty', size: dmgPenalty * -1 }]
  }

  const total = Math.max(0, groups.map(g => g.size || g.default || 0).reduce((a, b) => a + b, 0))

  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column' }}>
      <DiceGroupDisplay name={name} size={total} total />
      {groups.map(group => (
        <DiceGroupDisplay key={group.name} name={group.name} size={group.size || group.default || 0} />
      ))}
    </Box>
  )
}

interface DiceGroupDisplayProps {
  name: string
  size: number
  total?: boolean
}

const DiceGroupDisplay: FC<DiceGroupDisplayProps> = ({
  name,
  size,
  total,
}) => {
  const sizeStyles = { display: 'inline-block', padding: 0.5, width: 30, textAlign: 'center' } as const
  const nameStyles = { display: 'inline-block', padding: 0.5, marginRight: 1 } as const

  return (
    <Box sx={{ display: 'flex', fontSize: total ? 14 : 12, backgroundColor: total ? '#424242' : undefined }}>
      <Box sx={sizeStyles}>{size}</Box>
      <Box sx={nameStyles}>{name}</Box>
    </Box>
  )
}
