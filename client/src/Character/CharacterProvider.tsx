import { createContext, FC, useContext } from 'react'

import { AugmentAttr } from '../Gear/Augments/AugmentAttr'
import { isAugment } from '../Gear/Augments/AugmentData'
import { GearProvider, useAllGear } from '../Gear/GearContext'
import { calculateAttributes } from '../System/Attribute'
import { AttributeProvider } from '../System/AttributeProvider'
import { DamageProvider } from '../System/Damage/DamageProvider'
import { DamageType } from '../System/Damage/DamageType'
import { collectGearEffects, isSkillBonus } from '../System/Effect'
import { ActiveSkillData, isActiveSkill, SkillList } from '../System/Skill/ActiveSkill/ActiveSkillData'
import { ActiveSkill } from '../System/Skill/ActiveSkill/ActiveSkillId'
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

export function useSkills (skillIds?: string[]): SkillList {
  const character = useCharacterData()
  const skillList: SkillList = {}

  if (character) {
    character.skills
      .filter(isActiveSkill)
      .filter(skill => skillIds ? skillIds.includes(skill.name) : true)
      .forEach(skill => skillList[skill.name] = skill.rank)
  }

  return skillList
}

export function useActiveSkill (skillId: ActiveSkill): ActiveSkillData | undefined {
  const character = useCharacterData()
  const gear = useAllGear()
  if (!character) return undefined

  const skill = character.skills
    .filter(isActiveSkill)
    .find(skill => skill.name === skillId)

  if (!skill) return undefined

  const rank = collectGearEffects(gear)
    .filter(isSkillBonus)
    .filter(effect => effect.skill === skillId)
    .reduce((sum, effect) => sum + effect.bonus, skill.rank)

  return { ...skill, rank }
}
