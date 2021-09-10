import { FC, useState } from 'react'

import { CharacterData } from './Character/CharacterData'
import { CharacterProvider } from './Character/CharacterProvider'
import { Artemis } from './data/Artemis'
import { GearProvider } from './Gear/GearContext'

export const AppDataProvider: FC = ({
  children,
}) => {
  const [character, setCharacter] = useState<CharacterData>(Artemis)

  return (
    <CharacterProvider character={character} onChange={setCharacter}>
      <GearProvider gear={character.gear}>
        {children}
      </GearProvider>
    </CharacterProvider>
  )
}
