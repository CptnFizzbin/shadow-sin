import type { FC } from "react"

import { DicePool } from "#/components/DicePool/dice-pool.tsx"
import {
  useDiceAttributeGroup,
  useDiceSkillGroup,
  useWoundDiceGroup,
} from "#/components/DicePool/use-dice-group.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { SkillKey } from "#/lib/system/skill-key.ts"

export const ResistBodyDicePool = () => {
  return (
    <DicePool
      name="Resist Damage"
      groups={[useDiceAttributeGroup(AttributeKey.body)]}
    />
  )
}

export const ResistWillpowerDicePool = () => {
  return (
    <DicePool
      name="Resist Damage"
      groups={[useDiceAttributeGroup(AttributeKey.willpower)]}
    />
  )
}

export const RangedDefenseDicePool = () => {
  return (
    <DicePool
      name="Ranged Defense"
      groups={[
        useDiceAttributeGroup(AttributeKey.reaction),
        useWoundDiceGroup(),
      ]}
    />
  )
}

export const RangedFullDefenseDicePool = () => {
  return (
    <DicePool
      name="Ranged Full Defense"
      groups={[
        useDiceAttributeGroup(AttributeKey.reaction),
        useDiceSkillGroup(SkillKey.dodge),
        useWoundDiceGroup(),
      ]}
    />
  )
}

export const MeleeParryDicePool: FC<{ weaponSkill: SkillKey }> = ({
  weaponSkill,
}) => {
  return (
    <DicePool
      name={`${weaponSkill} Parry`}
      groups={[
        useDiceAttributeGroup(AttributeKey.reaction),
        useDiceSkillGroup(weaponSkill),
        useWoundDiceGroup(),
      ]}
    />
  )
}

export const MeleeBlockDicePool = () => {
  return (
    <DicePool
      name="Melee Block"
      groups={[
        useDiceAttributeGroup(AttributeKey.reaction),
        useDiceSkillGroup(SkillKey.unarmedCombat),
        useWoundDiceGroup(),
      ]}
    />
  )
}

export const MeleeDodgeDicePool = () => {
  return (
    <DicePool
      name="Melee Dodge"
      groups={[
        useDiceAttributeGroup(AttributeKey.reaction),
        useDiceSkillGroup(SkillKey.dodge),
        useWoundDiceGroup(),
      ]}
    />
  )
}

export const MeleeFullParryDicePool: FC<{ weaponSkill: SkillKey }> = ({
  weaponSkill,
}) => {
  return (
    <DicePool
      name={`${weaponSkill} Full Parry`}
      groups={[
        useDiceAttributeGroup(AttributeKey.reaction),
        useDiceSkillGroup(weaponSkill),
        useDiceSkillGroup(SkillKey.dodge),
        useWoundDiceGroup(),
      ]}
    />
  )
}

export const MeleeFullBlockDicePool = () => {
  return (
    <DicePool
      name="Melee Full Block"
      groups={[
        useDiceAttributeGroup(AttributeKey.reaction),
        useDiceSkillGroup(SkillKey.unarmedCombat),
        useDiceSkillGroup(SkillKey.dodge),
        useWoundDiceGroup(),
      ]}
    />
  )
}

export const MeleeFullDodgeDicePool = () => {
  return (
    <DicePool
      name="Melee Full Dodge"
      groups={[
        useDiceAttributeGroup(AttributeKey.reaction),
        useDiceSkillGroup(SkillKey.dodge),
        useDiceSkillGroup(SkillKey.dodge),
        useWoundDiceGroup(),
      ]}
    />
  )
}

export const PhysicalSpellDefenseDicePool = () => {
  return (
    <DicePool
      name="Physical Spell Defense"
      groups={[
        useDiceAttributeGroup(AttributeKey.body),
        useDiceSkillGroup(SkillKey.counterspelling),
        useWoundDiceGroup(),
      ]}
    />
  )
}

export const ManaSpellDefenseDicePool = () => {
  return (
    <DicePool
      name="Mana Spell Defense"
      groups={[
        useDiceAttributeGroup(AttributeKey.willpower),
        useDiceSkillGroup(SkillKey.counterspelling),
        useWoundDiceGroup(),
      ]}
    />
  )
}
