import { createContext, FC, useContext, useState } from 'react'

import { AttributeProvider } from '../System/AttributeProvider'
import { DamageProvider } from '../System/Damage/DamageContext'
import { DamageType } from '../System/Damage/DamageType'
import { SkillData, SkillId } from '../System/Skill/SkillData'
import { CharacterAttr, CharacterData } from './CharacterData'

const defaultCharacter: CharacterData = {
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
  const physicalDmgKey = 'dmg.char.physical'
  const [physicalDmg, setPhysicalDmg] = useState<number>(parseInt(localStorage.getItem(physicalDmgKey) || '0'))
  const onPhysicalChange = (value: number) => {
    setPhysicalDmg(value)
    localStorage.setItem(physicalDmgKey, value.toString())
  }

  const stunDmgKey = 'dmg.char.stun'
  const [stunDmg, setStunDmg] = useState<number>(parseInt(localStorage.getItem(stunDmgKey) || '0'))
  const onStunChange = (value: number) => {
    setStunDmg(value)
    localStorage.setItem(stunDmgKey, value.toString())
  }

  return (
    <CharacterContext.Provider value={{ character, setCharacter: onChange }}>
      <DamageProvider type={DamageType.charPhysical} value={physicalDmg} onChange={onPhysicalChange}>
        <DamageProvider type={DamageType.charStun} value={stunDmg} onChange={onStunChange}>
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

export function useSkill<T extends SkillData> (skillId: SkillId): T | undefined {
  const { character } = useContext(CharacterContext)
  const skill = character.skills.find(skill => skill.id === skillId)
  return skill ? skill as T : undefined
}
