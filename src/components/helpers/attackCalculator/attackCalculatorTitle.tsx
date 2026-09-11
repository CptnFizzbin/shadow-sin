import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { RiArrowLeftLine } from "@remixicon/react"
import type { FC } from "react"

import { AttackWorkflowStep, useActiveAttackWeapon, useAttackWorkflow } from "./attackWorkflow.ts"

/**
 * The Attack Calculator dialog's title: the active weapon's name with a back arrow to the weapon
 * hub, or "Attack Calculator" while the hub itself (`AttackWorkflowStep.SelectWeapon`) is showing.
 * Must render under `AttackWorkflow.Provider`.
 */
export const AttackCalculatorTitle: FC = () => {
  const workflow = useAttackWorkflow()
  const weapon = useActiveAttackWeapon()

  if (workflow.currentStep === AttackWorkflowStep.SelectWeapon) return "Attack Calculator"

  return (
    <Stack direction="row" sx={{ alignItems: "center" }}>
      <IconButton aria-label="Back to weapons" onClick={() => workflow.back()}>
        <RiArrowLeftLine size={20} />
      </IconButton>
      <Box sx={{ flex: 1 }}>{weapon.name}</Box>
      {/* Spacer mirrors the back button so the title stays centered. */}
      <Box sx={{ width: 36 }} />
    </Stack>
  )
}
