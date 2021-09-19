import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { useCharacter } from '../../Character/CharacterProvider'
import { formatNuyen, useNuyenBalance } from '../../System/Nuyen'
import { BalanceLogTable } from '../../UI/BalanceLogTable'
import { Stat, StatBlock } from '../../UI/StatBlock'

export const NuyenPage: FC = () => {
  const character = useCharacter()
  const nuyenBalance = useNuyenBalance()
  if (!character) return null

  return (
    <Paper>
      <StatBlock>
        <Stat name={'Total Balance'} value={formatNuyen(nuyenBalance)} />
      </StatBlock>
      <BalanceLogTable log={character.nuyen} formatValue={formatNuyen} />
    </Paper>
  )
}
