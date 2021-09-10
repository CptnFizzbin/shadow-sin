import { createContext, FC, useContext } from 'react'

import { AttributeProvider } from '../System/AttributeProvider'
import { DamageProvider } from '../System/Damage/DamageProvider'
import { DamageType } from '../System/Damage/DamageType'
import { ActiveSkillData, SkillData, SkillId, SkillType } from '../System/Skill/SkillData'
import { CharacterAttr, CharacterData } from './CharacterData'

const defaultCharacter: CharacterData = {
  id: null,
  dataVersion: 1,
  name: 'unknown',
  metaType: 'human',
  karma: 0,
  nuyen: 0,

  attributes: {
    [CharacterAttr.body]: 1,
    [CharacterAttr.agility]: 1,
    [CharacterAttr.reaction]: 1,
    [CharacterAttr.strength]: 1,
    [CharacterAttr.willpower]: 1,
    [CharacterAttr.logic]: 1,
    [CharacterAttr.intuition]: 1,
    [CharacterAttr.charisma]: 1,
    [CharacterAttr.edge]: 1,
    [CharacterAttr.essence]: 6,
  },

  skills: [],
  contacts: [],
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
      <DamageProvider type={DamageType.charPhysical} id={character.id}>
        <DamageProvider type={DamageType.charStun} id={character.id}>
          <AttributeProvider attributes={character.attributes}>
            {children}
          </AttributeProvider>
        </DamageProvider>
      </DamageProvider>
    </CharacterContext.Provider>
  )
}

export const useCharacter = (): CharacterContextData => {
  return useContext(CharacterContext)
}

export function useActiveSkill<T extends SkillData> (skillId: SkillId): T | undefined {
  const { character } = useContext(CharacterContext)
  const skill = character.skills
    .filter(skill => skill.type === SkillType.active)
    .map(skill => skill as ActiveSkillData)
    .find(skill => skill.skillId === skillId)
  return skill ? skill as T : undefined
}
