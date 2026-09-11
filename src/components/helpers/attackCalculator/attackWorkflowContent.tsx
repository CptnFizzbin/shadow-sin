import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { WeaponType } from "#/system/gear/weaponData.ts"

import {
  AttackWorkflow,
  AttackWorkflowStep,
  AttackWorkflowStepLabels,
  useActiveAttackWeapon,
  useAttackWorkflow,
} from "./attackWorkflow.ts"
import { AttackWorkflowStepAttackTotal } from "./attackWorkflowStep.attackTotal.tsx"
import { AttackWorkflowStepMeleeModifiers } from "./attackWorkflowStep.meleeModifiers.tsx"
import { AttackWorkflowStepRangedModifiers } from "./attackWorkflowStep.rangedModifiers.tsx"
import { AttackWorkflowStepSelectSkill } from "./attackWorkflowStep.selectSkill.tsx"
import { AttackWorkflowStepSelectWeapon } from "./attackWorkflowStep.selectWeapon.tsx"

/**
 * The Attack Calculator wizard's shell: the weapon hub, and — once a weapon's wizard is drilled
 * into — the step counter header, each step rendered via `AttackWorkflow.Step`, and the Back/Next
 * footer. Must render under `AttackWorkflow.Provider`. The header/footer are specific to the
 * 3-step per-weapon wizard (Skill, Modifiers, Totals); the hub (`AttackWorkflowStep.SelectWeapon`)
 * has neither — its own "Back to weapons" affordance lives on the dialog title
 * (`AttackCalculatorTitle`) instead.
 *
 * `AttackWorkflowStep.MeleeModifiers`/`RangedModifiers` are two `currentStep` values for the same
 * visible "Modifiers" step — the wizard's actual on-screen step count stays 3 (Skill, Modifiers,
 * Totals) regardless of which one is active for this weapon.
 */
export const AttackWorkflowContent: FC = () => {
  const workflow = useAttackWorkflow()
  const weapon = useActiveAttackWeapon()

  const isMelee = weapon.weaponType === WeaponType.melee
  const isLastStep = workflow.currentStep === AttackWorkflowStep.Totals

  const getNextStep = () => {
    switch (workflow.currentStep) {
      case AttackWorkflowStep.SelectWeapon:
        return AttackWorkflowStep.SelectSkill

      case AttackWorkflowStep.SelectSkill:
        return isMelee
          ? AttackWorkflowStep.MeleeModifiers
          : AttackWorkflowStep.RangedModifiers

      case AttackWorkflowStep.MeleeModifiers:
      case AttackWorkflowStep.RangedModifiers:
        return AttackWorkflowStep.Totals

      case AttackWorkflowStep.Totals:
        return AttackWorkflowStep.Totals
    }
  }

  return (
    <Stack sx={{ justifyContent: "space-between", height: "100%" }}>
      <Stack>
        <Label variant="contained" role="heading" aria-label="Step Name">
          {AttackWorkflowStepLabels[workflow.currentStep]}
        </Label>

        <AttackWorkflow.Step step={AttackWorkflowStep.SelectWeapon}>
          <AttackWorkflowStepSelectWeapon />
        </AttackWorkflow.Step>

        <AttackWorkflow.Step step={AttackWorkflowStep.SelectSkill}>
          <AttackWorkflowStepSelectSkill />
        </AttackWorkflow.Step>

        <AttackWorkflow.Step step={AttackWorkflowStep.MeleeModifiers}>
          <AttackWorkflowStepMeleeModifiers />
        </AttackWorkflow.Step>

        <AttackWorkflow.Step step={AttackWorkflowStep.RangedModifiers}>
          <AttackWorkflowStepRangedModifiers />
        </AttackWorkflow.Step>

        <AttackWorkflow.Step step={AttackWorkflowStep.Totals}>
          <AttackWorkflowStepAttackTotal />
        </AttackWorkflow.Step>
      </Stack>

      <Stack sx={{ paddingBottom: 1 }}>
        <Divider />

        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Button
            disabled={workflow.isFirstStep}
            onClick={() => workflow.back()}
          >
            Back
          </Button>

          {!isLastStep && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => workflow.next(getNextStep())}
            >
              Next
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
