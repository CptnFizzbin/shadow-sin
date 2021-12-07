import { faWifi } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Paper } from '@mui/material'
import React, { FC } from 'react'

import { useSkills } from '../Character/CharacterProvider'
import { GearData } from '../Gear/GearData'
import { formatAttr } from '../System/Attribute'
import { useAttributes } from '../System/AttributeProvider'
import { useDamagePenalty } from '../System/Damage/DamageProvider'
import { DamageType } from '../System/Damage/DamageType'
import { collectEffects, isDicePoolBonus } from '../System/Effect'
import { ActiveSkillData, hasExpertise, hasSpecialty } from '../System/Skill/ActiveSkill/ActiveSkillData'

export interface DiceGroup {
  name: string
  size: number | undefined
  default?: number
  wireless?: boolean
}

export const DicePools: FC = ({
  children,
}) => {
  return <Paper variant="outlined" sx={{ padding: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
    {children}
  </Paper>
}

export interface DicePoolData {
  name: string
  poolKey?: string
  skills?: string[]
  attrs?: string[]
  bonuses?: DiceGroup[]
  dmgPenaltyTypes?: DamageType[]
}

export const skillSpecialtyBonus = (
  skill: ActiveSkillData | undefined,
  specialtyName: string | undefined,
): DiceGroup | null => {
  if (!skill || !specialtyName)
    return null

  if (hasSpecialty(skill, specialtyName))
    return { name: 'Specialty', size: 2 }

  if (hasExpertise(skill, specialtyName))
    return { name: 'Expertise', size: 3 }

  return null
}

export const collectEffectBonuses = (
  gear: GearData[],
  poolKey: string,
) => {
  return collectEffects(gear)
    .filter(isDicePoolBonus)
    .filter(effect => effect.poolType === poolKey)
    .map(effect => ({ name: effect.name, size: effect.bonus, wireless: effect.wireless }) as DiceGroup)
}

type DicePoolProps = {
  name: string
  groups?: DiceGroup[]
  dmgPenaltyTypes?: DamageType[]
} & DicePoolData

export const DicePool: FC<DicePoolProps> = ({
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
      .map(([name, rank]) => ({ name: name, size: rank })),
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
        <DiceGroupDisplay
          key={group.name}
          name={group.name}
          size={group.size || group.default || 0}
          wireless={group.wireless}
        />
      ))}
    </Box>
  )
}

interface DiceGroupDisplayProps {
  name: string
  size: number
  total?: boolean
  wireless?: boolean
}

const DiceGroupDisplay: FC<DiceGroupDisplayProps> = ({
  name,
  size,
  total,
  wireless = false,
}) => {
  const sizeStyles = { display: 'inline-block', padding: 0.5, width: 30, textAlign: 'center' } as const
  const nameStyles = { display: 'inline-block', padding: 0.5, marginRight: 1 } as const

  return (
    <Box sx={{ display: 'flex', fontSize: total ? 14 : 12, backgroundColor: total ? '#424242' : undefined }}>
      <Box sx={sizeStyles}>{size}</Box>
      <Box sx={nameStyles}>{name}</Box>
      {wireless && <Box sx={nameStyles}><FontAwesomeIcon icon={faWifi} /></Box>}
    </Box>
  )
}
