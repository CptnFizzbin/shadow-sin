import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import { FC } from 'react'

import { useAllGear } from '../../Gear/GearContext'
import { useQualities } from '../../Qualities/QualityData'
import { useAttribute } from '../../System/AttributeProvider'
import { DamageTrack } from '../../System/Damage/DamageTrack'
import { DamageType } from '../../System/Damage/DamageType'
import { CharacterDefRatingStat } from '../../System/DefenseRating'
import { collectGearEffects, Effect, isConditionTrackBonus, isInitBonus } from '../../System/Effect'
import { CharacterColdVrInit, CharacterHotVrInit, InitiativeStat } from '../../System/Initiative'
import { StatBlock } from '../../UI/StatBlock'
import { CharacterAttr } from '../CharacterAttr'

export const CombatArea: FC = () => {
  const theme = useTheme()
  const mdScreenOrLarger = useMediaQuery(theme.breakpoints.up('md'))
  const gear = useAllGear()

  const body = useAttribute<number>(CharacterAttr.body) || 0
  const reaction = useAttribute<number>(CharacterAttr.reaction) || 0
  const intuition = useAttribute<number>(CharacterAttr.intuition) || 0
  const willpower = useAttribute<number>(CharacterAttr.willpower) || 0

  const physicalTrackBonus = useQualities()
    .filter(quality => quality.effects)
    .flatMap(quality => quality.effects as Effect[])
    .filter(isConditionTrackBonus)
    .filter(effect => effect.track === 'physical')
    .reduce((sum, effect) => sum + effect.bonus, 0)
  const physicalMax = Math.ceil(body / 2) + 8 + physicalTrackBonus

  const stunTrackBonus = useQualities()
    .filter(quality => quality.effects)
    .flatMap(quality => quality.effects as Effect[])
    .filter(isConditionTrackBonus)
    .filter(effect => effect.track === 'stun')
    .reduce((sum, effect) => sum + effect.bonus, 0)
  const stunMax = Math.ceil(willpower / 2) + 8 + stunTrackBonus

  const initDice = collectGearEffects(gear)
    .filter(isInitBonus)
    .reduce((sum, effect) => sum + effect.dice, 1)

  return (
    <Stack
      gap={1}
      padding={1}
      direction={mdScreenOrLarger ? 'column' : 'row'}
      alignContent="flex-start"
      justifyContent={mdScreenOrLarger ? 'flex-start' : 'space-between'}
      sx={{ flexWrap: 'wrap' }}
    >
      <Box>
        <Typography variant={'h6'}>Combat</Typography>
        <StatBlock vertical>
          <InitiativeStat name="Init" base={reaction + intuition} dice={initDice} />
          <CharacterHotVrInit />
          <CharacterColdVrInit />
          <CharacterDefRatingStat />
        </StatBlock>
      </Box>

      <Stack gap={1} direction={mdScreenOrLarger ? 'column' : 'row'}>
        <DamageTrack type={DamageType.charPhysical} max={physicalMax} label="Physical" />
        <DamageTrack type={DamageType.charStun} max={stunMax} label="Stun" />
      </Stack>
    </Stack>
  )
}
