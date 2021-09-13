import { Typography, useMediaQuery, useTheme } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { collectGearEffects, isInitBonus } from '../../Gear/Effect'
import { useAllGear } from '../../Gear/GearContext'
import { useAttribute } from '../../System/AttributeProvider'
import { DamageTrack } from '../../System/Damage/DamageTrack'
import { DamageType } from '../../System/Damage/DamageType'
import { CharacterDefRatingStat } from '../../System/DefenseRating'
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

  const physicalMax = Math.ceil(body / 2) + 8
  const stunMax = Math.ceil(willpower / 2) + 8

  const initDice = collectGearEffects(gear)
    .filter(isInitBonus)
    .reduce((sum, effect) => sum + effect.dice, 1)

  return <Box sx={{ display: 'flex', flexDirection: mdScreenOrLarger ? 'column' : 'row', padding: 1, gap: 1 }}>
    <Box>
      <Typography variant={'h6'}>Combat</Typography>
      <StatBlock vertical>
        {/* NOTE: pg. 67 => changed by augments */}
        <InitiativeStat name="Init" base={reaction + intuition} dice={initDice} />
        <CharacterHotVrInit />
        <CharacterColdVrInit />
        <CharacterDefRatingStat />
      </StatBlock>
    </Box>

    <Box>
      <DamageTrack type={DamageType.charPhysical} max={physicalMax} label="Physical" />
    </Box>

    <Box>
      <DamageTrack type={DamageType.charStun} max={stunMax} label="Stun" />
    </Box>
  </Box>
}
