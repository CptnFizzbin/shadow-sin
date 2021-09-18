import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { useCharacter } from '../../Character/CharacterProvider'
import { BalanceLogTable } from '../../UI/BalanceLogTable'

export const KarmaPage: FC = () => {
  const character = useCharacter()
  if (!character) return null

  return (
    <Paper>
      <BalanceLogTable log={character.karma} />
    </Paper>
  )
}
