import { createWorkflow, useWorkflow } from "#/components/ui/workflow/createWorkflow.tsx"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { WeaponData } from "#/system/model/items/weaponData.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

export enum AttackWorkflowStep {
  SelectWeapon = "SelectWeapon",
  SelectSkill = "SelectSkill",
  MeleeModifiers = "MeleeModifiers",
  RangedModifiers = "RangedModifiers",
  Totals = "Totals",
}

export const AttackWorkflowStepLabels: Record<AttackWorkflowStep, string> = {
  [AttackWorkflowStep.SelectWeapon]: "Select Weapon",
  [AttackWorkflowStep.SelectSkill]: "Select Skill",
  [AttackWorkflowStep.MeleeModifiers]: "Select Modifiers",
  [AttackWorkflowStep.RangedModifiers]: "Select Modifiers",
  [AttackWorkflowStep.Totals]: "Attack Totals",
}

export interface AttackWorkflowData {
  weaponId: UUID | null
  selectedSkill: SkillKey | null
  selectedFiremode: string | null
  modifiers: Record<string, number>
}

export const AttackWorkflow = createWorkflow<AttackWorkflowData, AttackWorkflowStep>()

export const useAttackWorkflow = () => useWorkflow(AttackWorkflow)

export const createAttackWorkflowData = (opts: { weapon: WeaponData }): AttackWorkflowData => {
  return {
    weaponId: opts.weapon.id,
    selectedSkill: opts.weapon.skill,
    selectedFiremode: null,
    modifiers: {},
  }
}

/** The weapon the workflow's `data.weaponId` currently points at. Every step but `SelectWeapon` needs it. */
export const useActiveAttackWeapon = (): WeaponData => {
  const workflow = useAttackWorkflow()
  if (!workflow.data.weaponId) throw new Error("Invalid workflow state: no weapon selected")

  return useRunnerSelector(ItemSelectors.selectById, { itemId: workflow.data.weaponId }) as WeaponData
}
