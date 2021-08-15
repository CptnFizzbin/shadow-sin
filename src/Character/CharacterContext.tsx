import { createContext, FC, useContext } from 'react'

import { Attribute } from './Attribute'
import { Character } from './Character'
import { Skill, SkillId } from './Skill'

const defaultCharacter: Character = {
  name: 'unknown',
  metaType: 'human',
  karma: 0,
  nuyen: 0,

  attributes: {
    body: 1,
    agility: 1,
    reaction: 1,
    strength: 1,
    willpower: 1,
    logic: 1,
    intuition: 1,
    charisma: 1,
    edge: 1,
    essence: 6,
  },
  skills: [],
  gear: [],
}

interface CharacterContextData {
  character: Character

  setCharacter (character: Character): void
}

const CharacterContext = createContext<CharacterContextData>({
  character: defaultCharacter,
  setCharacter () {
    console.error('Default Character is read only')
  },
})

interface CharacterProviderProps {
  character: Character

  onChange (character: Character): void
}

export const CharacterProvider: FC<CharacterProviderProps> = ({
  character,
  onChange,
  children,
}) => {

  return (
    <CharacterContext.Provider value={{ character, setCharacter: onChange }}>
      {children}
    </CharacterContext.Provider>
  )
}

export const useCharacter = (): CharacterContextData => {
  return useContext(CharacterContext)
}

export const useAttribute = (attr: Attribute): number | undefined => {
  const { character } = useContext(CharacterContext)
  return character.attributes[attr]
}

export const useSkill = (skillId: SkillId): Skill | undefined => {
  const { character } = useContext(CharacterContext)
  return character.skills.find(skill => skill.id === skillId)
}
