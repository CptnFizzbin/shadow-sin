import { createContext, FC, useContext } from 'react'

import { GearProvider } from '../Gear/GearContext'
import { AttributeProvider } from '../System/AttributeProvider'
import { DamageProvider } from '../System/Damage/DamageProvider'
import { DamageType } from '../System/Damage/DamageType'
import { ActiveSkillData, SkillData, SkillId, SkillType } from '../System/Skill/SkillData'
import { CharacterData } from './CharacterData'

const CharacterContext = createContext<CharacterData | null>(null)

interface CharacterProviderProps {
  character: CharacterData
}

export const CharacterProvider: FC<CharacterProviderProps> = ({
  character,
  children,
}) => {
  return (
    <CharacterContext.Provider value={character}>
      <GearProvider gear={character.gear}>
        <DamageProvider type={DamageType.charPhysical} id={character.id}>
          <DamageProvider type={DamageType.charStun} id={character.id}>
            <AttributeProvider attributes={character.attributes}>
              {children}
            </AttributeProvider>
          </DamageProvider>
        </DamageProvider>
      </GearProvider>
    </CharacterContext.Provider>
  )
}

export const useCharacter = (): CharacterData | null => {
  return useContext(CharacterContext)
}

export function useActiveSkill<T extends SkillData> (skillId: SkillId): T | undefined {
  const character = useContext(CharacterContext)
  if (!character) return undefined

  const skill = character.skills
    .filter(skill => skill.type === SkillType.active)
    .map(skill => skill as ActiveSkillData)
    .find(skill => skill.skillId === skillId)
  return skill ? skill as T : undefined
}
