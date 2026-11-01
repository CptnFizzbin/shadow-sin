import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { WeaponCard } from "#/components/entities/items/types/weapons/weaponCard.tsx"
import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { CombatPoolSelectors } from "#/state/runner/dicePool/combatPools.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

import { AttackTestResolution } from "./attackTestResolution.tsx"
import { useActiveAttackWeapon, useAttackWorkflow } from "./attackWorkflow.ts"

/** Total step: rolls the Attack Test and resolves Net Hits / Total DV against defenseCalculator hits. */
export const AttackWorkflowStepAttackTotal: FC = () => {
  const workflow = useAttackWorkflow()
  const weapon = useActiveAttackWeapon()
  if (!workflow.data.selectedSkill) throw new Error("Invalid workflow stated. Expected skill to be selected.")

  const skill = useRunnerSelector(SkillsSelectors.selectActiveSkill, { skillName: workflow.data.selectedSkill })

  const attrKey = weapon.attribute ?? skill.attr
  const affectedByEncumbrance = attrKey === AttributeKey.agility || attrKey === AttributeKey.reaction

  const modifierGroups = Object.entries(workflow.data.modifiers).map(([label, value]): DiceGroup => {
    return { name: label, size: value }
  })

  const attackPool = useRunnerSelector(CombatPoolSelectors.selectAttackTest, {
    attr: attrKey,
    skill: skill.name,
    includeEncumbrance: affectedByEncumbrance,
    extraGroups: modifierGroups,
  })

  return (
    <Stack sx={{ gap: 1.5 }}>
      <WeaponCard.DicePool pool={attackPool} />

      <AttackTestResolution poolSize={attackPool.size} damageValue={weapon.dmg} />
    </Stack>
  )
}
