import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import {
  useActiveSkillDiceGroup,
  useAttrDiceGroup,
  useDefaultingDiceGroup,
  useWoundDiceGroup,
} from "#/components/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const ResistBodyDicePool = () => {
  return (
    <DicePool
      name="Resist Damage"
      groups={[useAttrDiceGroup(AttributeKey.body)]}
    />
  )
}

export const ResistWillpowerDicePool = () => {
  return (
    <DicePool
      name="Resist Damage"
      groups={[useAttrDiceGroup(AttributeKey.willpower)]}
    />
  )
}

export const RangedDefenseDicePool = () => {
  return (
    <DicePool
      name="Ranged Defense"
      groups={[
        useAttrDiceGroup(AttributeKey.reaction),
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
        useAttrDiceGroup(AttributeKey.reaction),
        useActiveSkillDiceGroup(SkillKey.dodge),
        useDefaultingDiceGroup(SkillKey.dodge),
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
        useAttrDiceGroup(AttributeKey.reaction),
        useActiveSkillDiceGroup(weaponSkill),
        useDefaultingDiceGroup(weaponSkill),
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
        useAttrDiceGroup(AttributeKey.reaction),
        useActiveSkillDiceGroup(SkillKey.unarmedCombat),
        useDefaultingDiceGroup(SkillKey.unarmedCombat),
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
        useAttrDiceGroup(AttributeKey.reaction),
        useActiveSkillDiceGroup(SkillKey.dodge),
        useDefaultingDiceGroup(SkillKey.dodge),
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
        useAttrDiceGroup(AttributeKey.reaction),
        useActiveSkillDiceGroup(weaponSkill),
        useDefaultingDiceGroup(weaponSkill),
        useActiveSkillDiceGroup(SkillKey.dodge),
        useDefaultingDiceGroup(SkillKey.dodge),
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
        useAttrDiceGroup(AttributeKey.reaction),
        useActiveSkillDiceGroup(SkillKey.unarmedCombat),
        useDefaultingDiceGroup(SkillKey.unarmedCombat),
        useActiveSkillDiceGroup(SkillKey.dodge),
        useDefaultingDiceGroup(SkillKey.dodge),
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
        useAttrDiceGroup(AttributeKey.reaction),
        useActiveSkillDiceGroup(SkillKey.dodge),
        useActiveSkillDiceGroup(SkillKey.dodge),
        useDefaultingDiceGroup(SkillKey.dodge),
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
        useAttrDiceGroup(AttributeKey.body),
        useActiveSkillDiceGroup(SkillKey.counterspelling),
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
        useAttrDiceGroup(AttributeKey.willpower),
        useActiveSkillDiceGroup(SkillKey.counterspelling),
        useWoundDiceGroup(),
      ]}
    />
  )
}
