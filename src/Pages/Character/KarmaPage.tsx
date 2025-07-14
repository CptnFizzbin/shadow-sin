import { Paper } from "@mui/material"
import { FC } from "react"

import { useCharacterData } from "../../Character/CharacterProvider"
import { BalanceLogTable } from "../../UI/BalanceLogTable"

export const KarmaPage: FC = () => {
  const character = useCharacterData()
  if (!character) return null

  return (
    <Paper>
      <BalanceLogTable log={character.karma} />
    </Paper>
  )
}
