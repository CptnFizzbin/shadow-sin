import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { CombatPoolSelectors } from "#/state/runner/dicePool/combatPools.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ArmorRatingType } from "#/system/model/items/armorData.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"

export const ResistDamageDicePool: FC<{ type: "P" | "S", armor: ArmorRatingType }> = ({ type, armor }) => {
  const pool = useRunnerSelector(CombatPoolSelectors.selectResistDamageTest, { damageType: type, armor })
  return <DicePool pool={{ ...pool, label: `Resist ${armor} (${type})` }} />
}

export const ResistDirectManaSpellDicePool = () => (
  <DicePool pool={useRunnerSelector(CombatPoolSelectors.selectResistManaSpellTest)} />
)

export const ResistDirectPhysicalSpellDicePool = () => (
  <DicePool pool={useRunnerSelector(CombatPoolSelectors.selectResistPhysicalSpellTest)} />
)

export const RangedDefenseDicePool = () => (
  <DicePool pool={useRunnerSelector(CombatPoolSelectors.selectRangedDefenseTest)} />
)

export const RangedFullDefenseDicePool = () => (
  <DicePool pool={useRunnerSelector(CombatPoolSelectors.selectRangedFullDefenseTest)} />
)

export const MeleeParryDicePool: FC<{ weaponSkill: SkillKey }> = ({ weaponSkill }) => {
  const pool = useRunnerSelector(CombatPoolSelectors.selectMeleeParryTest, { skill: weaponSkill })
  return <DicePool pool={{ ...pool, label: `${weaponSkill} Parry` }} />
}

export const MeleeBlockDicePool = () => (
  <DicePool pool={useRunnerSelector(CombatPoolSelectors.selectMeleeBlockTest)} />
)

export const MeleeDodgeDicePool = () => (
  <DicePool pool={useRunnerSelector(CombatPoolSelectors.selectMeleeDodgeTest)} />
)

export const MeleeFullParryDicePool: FC<{ weaponSkill: SkillKey }> = ({ weaponSkill }) => {
  const pool = useRunnerSelector(CombatPoolSelectors.selectMeleeFullParryTest, { skill: weaponSkill })
  return <DicePool pool={{ ...pool, label: `${weaponSkill} Full Parry` }} />
}

export const MeleeFullBlockDicePool = () => (
  <DicePool pool={useRunnerSelector(CombatPoolSelectors.selectMeleeFullBlockTest)} />
)

export const MeleeFullDodgeDicePool = () => (
  <DicePool pool={useRunnerSelector(CombatPoolSelectors.selectMeleeFullDodgeTest)} />
)

export const PhysicalSpellDefenseDicePool = () => (
  <DicePool pool={useRunnerSelector(CombatPoolSelectors.selectPhysicalSpellDefenseTest)} />
)

export const ManaSpellDefenseDicePool = () => (
  <DicePool pool={useRunnerSelector(CombatPoolSelectors.selectManaSpellDefenseTest)} />
)
