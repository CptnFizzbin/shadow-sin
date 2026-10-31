import type { FC } from "react"

import { flattenDiceGroups } from "#/components/system/dicePool/diceGroup.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { useArmorDiceGroup } from "#/hooks/items/types/armor/useArmorDiceGroup.tsx"
import {
  useActiveSkillDiceGroup,
  useAttrDiceGroup,
  useEncumbranceDiceGroup,
} from "#/hooks/system/dicePool/useDiceGroup.ts"
import { useDicePool } from "#/hooks/system/dicePool/useDicePool.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { ArmorRatingType } from "#/system/model/items/armorData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

export const ResistDamageDicePool: FC<{ type: "P" | "S", armor: ArmorRatingType }> = ({ type, armor }) => {
  return (
    <DicePool
      pool={useDicePool({
        id: `resist.damage.${armor}.${type}`,
        label: `Resist ${armor} (${type})`,
        groups: flattenDiceGroups([
          useAttrDiceGroup(type === "P" ? AttributeKey.body : AttributeKey.willpower),
          useArmorDiceGroup(armor),
        ]),
      })}
    />
  )
}

export const ResistDirectManaSpellDicePool = () => {
  return (
    <DicePool
      pool={useDicePool({
        id: "resist.spell.mana",
        label: "Resist Mana Spell",
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.willpower),
        ]),
      })}
    />
  )
}

export const ResistDirectPhysicalSpellDicePool = () => {
  return (
    <DicePool
      pool={useDicePool({
        id: "resist.spell.physical",
        label: "Resist Physical Spell",
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.body),
        ]),
      })}
    />
  )
}

export const RangedDefenseDicePool = () => {
  return (
    <DicePool
      pool={useDicePool({
        id: "defense.ranged",
        label: "Ranged Defense",
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.reaction),
          useEncumbranceDiceGroup(),
        ]),
      })}
    />
  )
}

export const RangedFullDefenseDicePool = () => {
  return (
    <DicePool
      pool={useDicePool({
        id: "defense.ranged.full",
        label: "Ranged Full Defense",
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.reaction),
          useActiveSkillDiceGroup(SkillKey.dodge, { defaulting: true }),
          useEncumbranceDiceGroup(),
        ]),
      })}
    />
  )
}

export const MeleeParryDicePool: FC<{ weaponSkill: SkillKey }> = ({
  weaponSkill,
}) => {
  return (
    <DicePool
      pool={useDicePool({
        id: `defense.melee.parry.${weaponSkill}`,
        label: `${weaponSkill} Parry`,
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.reaction),
          useActiveSkillDiceGroup(weaponSkill),
          useEncumbranceDiceGroup(),
        ]),
      })}
    />
  )
}

export const MeleeBlockDicePool = () => {
  return (
    <DicePool
      pool={useDicePool({
        id: "defense.melee.block",
        label: "Melee Block",
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.reaction),
          useActiveSkillDiceGroup(SkillKey.unarmedCombat),
          useEncumbranceDiceGroup(),
        ]),
      })}
    />
  )
}

export const MeleeDodgeDicePool = () => {
  return (
    <DicePool
      pool={useDicePool({
        id: "defense.melee.dodge",
        label: "Melee Dodge",
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.reaction),
          useActiveSkillDiceGroup(SkillKey.dodge),
          useEncumbranceDiceGroup(),
        ]),
      })}
    />
  )
}

export const MeleeFullParryDicePool: FC<{ weaponSkill: SkillKey }> = ({
  weaponSkill,
}) => {
  return (
    <DicePool
      pool={useDicePool({
        id: `defense.melee.fullParry.${weaponSkill}`,
        label: `${weaponSkill} Full Parry`,
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.reaction),
          useActiveSkillDiceGroup(weaponSkill),
          useActiveSkillDiceGroup(SkillKey.dodge),
          useEncumbranceDiceGroup(),
        ]),
      })}
    />
  )
}

export const MeleeFullBlockDicePool = () => {
  return (
    <DicePool
      pool={useDicePool({
        id: "defense.melee.fullBlock",
        label: "Melee Full Block",
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.reaction),
          useActiveSkillDiceGroup(SkillKey.unarmedCombat),
          useActiveSkillDiceGroup(SkillKey.dodge),
          useEncumbranceDiceGroup(),
        ]),
      })}
    />
  )
}

export const MeleeFullDodgeDicePool = () => {
  return (
    <DicePool
      pool={useDicePool({
        id: "defense.melee.fullDodge",
        label: "Melee Full Dodge",
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.reaction),
          useActiveSkillDiceGroup(SkillKey.dodge),
          useActiveSkillDiceGroup(SkillKey.dodge),
          useEncumbranceDiceGroup(),
        ]),
      })}
    />
  )
}

export const PhysicalSpellDefenseDicePool = () => {
  return (
    <DicePool
      pool={useDicePool({
        id: "defense.spell.physical",
        label: "Physical Spell Defense",
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.body),
          useActiveSkillDiceGroup(SkillKey.counterspelling),
        ]),
      })}
    />
  )
}

export const ManaSpellDefenseDicePool = () => {
  return (
    <DicePool
      pool={useDicePool({
        id: "defense.spell.mana",
        label: "Mana Spell Defense",
        groups: flattenDiceGroups([
          useAttrDiceGroup(AttributeKey.willpower),
          useActiveSkillDiceGroup(SkillKey.counterspelling),
        ]),
      })}
    />
  )
}
