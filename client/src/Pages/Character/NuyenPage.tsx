import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { useCharacter } from '../../Character/CharacterProvider'
import { useAllGear } from '../../Gear/GearContext'
import { formatNuyen, useNuyenBalance } from '../../System/Nuyen'
import { BalanceLogTable } from '../../UI/BalanceLogTable'
import { Stat, StatBlock } from '../../UI/StatBlock'

export const NuyenPage: FC = () => {
  const character = useCharacter()
  const nuyenBalance = useNuyenBalance()
  const gear = useAllGear()
  if (!character) return null

  const gearTotal = gear
    .filter(gear => typeof gear.cost === 'number')
    .map(gear => gear.cost as number)
    .reduce((sum, cost) => sum + cost, 0)

  return (
    <Paper>
      <StatBlock>
        <Stat name={'Total Balance'} value={formatNuyen(nuyenBalance)} />
        <Stat name={'Gear Total'} value={formatNuyen(gearTotal)} />
        <Stat name={'Net Worth'} value={formatNuyen(gearTotal + nuyenBalance)} />
      </StatBlock>
      <BalanceLogTable log={character.nuyen} formatValue={formatNuyen} />
    </Paper>
  )
}
