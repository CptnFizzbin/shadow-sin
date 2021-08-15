import { FC, useState } from 'react'

import { Character } from './Character/Character'
import { CharacterProvider } from './Character/CharacterContext'
import { Artemis } from './data/Artemis'
import { GearProvider } from './Gear/GearContext'
import { GearData } from './Gear/GearData'

export const AppDataProvider: FC = ({
  children,
}) => {
  const [character, setCharacter] = useState<Character>(Artemis)

  const onGearChange = (gear: GearData[]) => {
    setCharacter({
      ...character,
      gear,
    })
  }

  return (
    <CharacterProvider character={character} onChange={setCharacter}>
      <GearProvider gear={character.gear} onChange={onGearChange}>
        {children}
      </GearProvider>
    </CharacterProvider>
  )
}
