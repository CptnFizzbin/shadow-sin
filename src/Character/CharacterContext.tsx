import { createContext, FC, useContext } from 'react'

import { Attribute } from './Attribute'
import { CharacterData } from './CharacterData'
import { SkillData, SkillId } from './Skill/SkillData'

const defaultCharacter: CharacterData = {
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
  character: CharacterData

  setCharacter (character: CharacterData): void
}

const CharacterContext = createContext<CharacterContextData>({
  character: defaultCharacter,
  setCharacter () {
    console.error('Default CharacterData is read only')
  },
})

interface CharacterProviderProps {
  character: CharacterData

  onChange (character: CharacterData): void
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

export const useAttribute = (attr: Attribute, defaultVal = 1): number => {
  const { character } = useContext(CharacterContext)
  return character.attributes[attr] || defaultVal
}

export const useSkill = (skillId: SkillId): SkillData | undefined => {
  const { character } = useContext(CharacterContext)
  return character.skills.find(skill => skill.id === skillId)
}
