import React, { FC } from "react"

import { CharacterInfo } from "../../Character/CharacterInfo/CharacterInfo"
import { useCharacterData } from "../../Character/CharacterProvider"

export const CharacterInfoPage: FC = () => {
  const character = useCharacterData()

  if (!character) return null

  return <CharacterInfo />
}
