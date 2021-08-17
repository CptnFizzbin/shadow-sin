import { createContext, FC, useContext } from 'react'

import { AttributeProvider } from '../System/AttributeProvider'
import { SkillData, SkillId } from '../System/Skill/SkillData'
import { CharacterAttribute } from './CharacterAttribute'
import { CharacterData } from './CharacterData'

const defaultCharacter: CharacterData = {
  name: 'unknown',
  metaType: 'human',
  karma: 0,
  nuyen: 0,

  attributes: [
    { name: CharacterAttribute.body, value: 1 },
    { name: CharacterAttribute.agility, value: 1 },
    { name: CharacterAttribute.reaction, value: 1 },
    { name: CharacterAttribute.strength, value: 1 },
    { name: CharacterAttribute.willpower, value: 1 },
    { name: CharacterAttribute.logic, value: 1 },
    { name: CharacterAttribute.intuition, value: 1 },
    { name: CharacterAttribute.charisma, value: 1 },
    { name: CharacterAttribute.edge, value: 1 },
    { name: CharacterAttribute.essence, value: 6 },
  ],
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
      <AttributeProvider attributes={character.attributes}>
        {children}
      </AttributeProvider>
    </CharacterContext.Provider>
  )
}

export const useCharacter = (): CharacterContextData => {
  return useContext(CharacterContext)
}

export function useSkill<T extends SkillData> (skillId: SkillId): T | undefined  {
  const { character } = useContext(CharacterContext)
  const skill = character.skills.find(skill => skill.id === skillId)
  return skill ? skill as T : undefined
}
