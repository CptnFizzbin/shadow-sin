import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { useArmorDiceGroup } from "#/lib/hooks/items/types/armor/useArmorDiceGroup.tsx"
import {
  useActiveSkillDiceGroup,
  useAttrDiceGroup,
  useEncumbranceDiceGroup,
  useWoundDiceGroup,
} from "#/lib/hooks/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { ArmorRatingType } from "#/system/gear/armorData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const ResistDamageDicePool: FC<{ type: "P" | "S", armor: ArmorRatingType }> = ({ type, armor }) => {
  return (
    <DicePool
      name={`Resist ${armor} (${type})`}
      groups={[
        useAttrDiceGroup(type === "P" ? AttributeKey.body : AttributeKey.willpower),
        useArmorDiceGroup(armor),
      ]}
    />
  )
}

export const ResistDirectManaSpellDicePool = () => {
  return (
    <DicePool
      name="Resist Mana Spell"
      groups={[
        useAttrDiceGroup(AttributeKey.willpower),
        useWoundDiceGroup(),
      ]}
    />
  )
}

export const ResistDirectPhysicalSpellDicePool = () => {
  return (
    <DicePool
      name="Resist Physical Spell"
      groups={[
        useAttrDiceGroup(AttributeKey.body),
        useWoundDiceGroup(),
      ]}
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
        useEncumbranceDiceGroup(),
      ]}
    />
  )
}

export const RangedFullDefenseDicePool = () => {
  return (
    <DicePool
      name="Ranged Full Defense"
      includeWound
      groups={[
        useAttrDiceGroup(AttributeKey.reaction),
        useActiveSkillDiceGroup(SkillKey.dodge, { defaulting: true }),
        useEncumbranceDiceGroup(),
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
        useWoundDiceGroup(),
        useEncumbranceDiceGroup(),
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
        useWoundDiceGroup(),
        useEncumbranceDiceGroup(),
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
        useWoundDiceGroup(),
        useEncumbranceDiceGroup(),
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
        useActiveSkillDiceGroup(SkillKey.dodge),
        useWoundDiceGroup(),
        useEncumbranceDiceGroup(),
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
        useActiveSkillDiceGroup(SkillKey.dodge),
        useWoundDiceGroup(),
        useEncumbranceDiceGroup(),
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
        useWoundDiceGroup(),
        useEncumbranceDiceGroup(),
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
