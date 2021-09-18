import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { useCharacter } from '../../Character/CharacterProvider'
import { formatNuyen } from '../../System/Nuyen'
import { BalanceLogTable } from '../../UI/BalanceLogTable'

export const NuyenPage: FC = () => {
  const character = useCharacter()
  if (!character) return null

  return (
    <Paper>
      <BalanceLogTable log={character.nuyen} formatValue={formatNuyen} />
    </Paper>
  )
}
