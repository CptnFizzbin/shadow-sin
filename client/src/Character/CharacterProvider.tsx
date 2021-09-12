import { createContext, FC, useContext } from 'react'

import { isAugment } from '../Gear/Augments/AugmentData'
import { isAttrBonus, isSkillBonus } from '../Gear/Effect'
import { GearProvider, useAllGear } from '../Gear/GearContext'
import { collectGearEffects } from '../Gear/GearData'
import { AttrList } from '../System/Attribute'
import { AttributeProvider } from '../System/AttributeProvider'
import { DamageProvider } from '../System/Damage/DamageProvider'
import { DamageType } from '../System/Damage/DamageType'
import { ActiveSkillData, SkillData, SkillId, SkillType } from '../System/Skill/SkillData'
import { CharacterAttr, CharacterData } from './CharacterData'

const CharacterContext = createContext<CharacterData | null>(null)

interface CharacterProviderProps {
  character: CharacterData
}

export const CharacterProvider: FC<CharacterProviderProps> = ({
  character,
  children,
}) => {
  const attributes: AttrList = {}

  const attrBonuses = collectGearEffects(character.gear)
    .filter(isAttrBonus)

  attributes[CharacterAttr.essence] = character.gear
    .filter(isAugment)
    .reduce((essence, gear) => essence - gear.essenceCost, 6)

  Object.entries(character.attributes).forEach(([attr, value]) => {
    attributes[attr] = attrBonuses
      .filter(effect => effect.attr === attr)
      .reduce((sum, effect) => sum + effect.bonus, value)
  })

  return (
    <CharacterContext.Provider value={character}>
      <AttributeProvider attributes={attributes}>
        <GearProvider gear={character.gear}>
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

export const useCharacter = (): CharacterData | null => {
  return useContext(CharacterContext)
}

export function useActiveSkill<T extends SkillData> (skillId: SkillId): T | undefined {
  const character = useContext(CharacterContext)
  const gear = useAllGear()
  if (!character) return undefined

  const skill = character.skills
    .filter(skill => skill.type === SkillType.active)
    .map(skill => skill as ActiveSkillData)
    .find(skill => skill.skillId === skillId)

  if (!skill) return undefined

  const rank = collectGearEffects(gear)
    .filter(isSkillBonus)
    .filter(effect => effect.skill === skillId)
    .reduce((sum, effect) => sum + effect.bonus, skill.rank)

  return { ...skill, rank } as T
}
