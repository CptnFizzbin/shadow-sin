import { createContext, FC, useContext } from 'react'

import { AugmentAttr } from '../Gear/Augments/AugmentAttr'
import { isAugment } from '../Gear/Augments/AugmentData'
import { GearProvider } from '../Gear/GearContext'
import { ActiveSkillId, ActiveSkills, CharacterActiveSkill, isActiveSkill, SkillList, SkillType } from '../Skills'
import { calculateAttributes } from '../System/Attribute'
import { AttributeProvider } from '../System/AttributeProvider'
import { DamageProvider } from '../System/Damage/DamageProvider'
import { DamageType } from '../System/Damage/DamageType'
import { collectCharacterEffects, isSkillAdj } from '../System/Effect'
import { Character } from './Character'
import { CharacterAttr } from './CharacterAttr'
import { CharacterData } from './CharacterData'

const CharacterContext = createContext<Character | null>(null)

interface CharacterProviderProps {
  character: Character
}

export const CharacterProvider: FC<CharacterProviderProps> = ({
  character,
  children,
}) => {
  const characterData = character.data

  const attributes = calculateAttributes(characterData.attributes, characterData.gear)

  attributes[CharacterAttr.essence] = characterData.gear
    .filter(isAugment)
    .map(augment => augment.attributes[AugmentAttr.essenceCost])
    .reduce((essence, essenceCost) => essence - essenceCost, 6)

  return (
    <CharacterContext.Provider value={character}>
      <AttributeProvider attributes={attributes}>
        <GearProvider gear={characterData.gear}>
          <DamageProvider type={DamageType.charPhysical} id={character.id}>
            <DamageProvider type={DamageType.charStun} id={character.id}>
              {children}
            </DamageProvider>
          </DamageProvider>
        </GearProvider>
      </AttributeProvider>
    </CharacterContext.Provider>
  )
}

export const useCharacter = (): Character | null => {
  return useContext(CharacterContext)
}

export const useCharacterData = (): CharacterData | null => {
  return useCharacter()?.data || null
}

export function useActiveSkills (skills: ActiveSkillId[]): SkillList {
  const character = useCharacterData()
  if (!character) return {}

  const skillList: SkillList = {}

  skills.forEach(skill => {
    const charSkill = getActiveSkill(skill, character)
    if (charSkill) { skillList[charSkill.id] = charSkill }
  })

  return skillList
}

export function useActiveSkill (skill: ActiveSkillId): CharacterActiveSkill | undefined {
  const character = useCharacterData()
  if (!character) return undefined

  return getActiveSkill(skill, character)
}

export function getActiveSkill (skillId: ActiveSkillId, character: CharacterData): CharacterActiveSkill | undefined {
  const activeSkill = ActiveSkills[skillId]

  const charSkill = character.skills
    .filter(isActiveSkill)
    .find(charSkill => charSkill.id === skillId)

  if (charSkill) {
    const rank = collectCharacterEffects(character)
      .filter(isSkillAdj)
      .filter(effect => effect.skill === skillId)
      .reduce((sum, effect) => sum + effect.value, charSkill.rank)

    return { ...charSkill, rank }
  } else if (activeSkill.untrained) {
    return { type: SkillType.active, id: skillId, rank: -1 }
  } else {
    return undefined
  }
}
