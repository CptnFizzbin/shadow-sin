import Button from "@mui/material/Button"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import type { FC } from "react"

import { AttackCalculatorTitle } from "#/components/helpers/attackCalculator/attackCalculatorTitle.tsx"
import {
  AttackWorkflow,
  AttackWorkflowStep,
  createAttackWorkflowData,
} from "#/components/helpers/attackCalculator/attackWorkflow.ts"
import { AttackWorkflowContent } from "#/components/helpers/attackCalculator/attackWorkflowContent.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { WeaponData } from "#/system/gear/weaponData.ts"

interface WeaponAttackDialogProps extends ControlledDialogProps<void> {
  weapon: WeaponData
}

const WeaponAttackDialog: FC<WeaponAttackDialogProps> = ({ ctrl, weapon }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))

  const initialData = createAttackWorkflowData({ weapon })

  return (
    <AttackWorkflow.Provider
      initialStep={AttackWorkflowStep.SelectSkill}
      initialData={initialData}
      previousSteps={[AttackWorkflowStep.SelectWeapon]}
    >
      <ControlledDialog ctrl={ctrl} maxWidth="sm" fullScreen={isNarrowViewport}>
        <Dialog.Title>
          <AttackCalculatorTitle />
        </Dialog.Title>

        <Dialog.Content>
          <AttackWorkflowContent />
        </Dialog.Content>

        <Dialog.Actions>
          <Button onClick={() => ctrl.close()}>Close</Button>
        </Dialog.Actions>
      </ControlledDialog>
    </AttackWorkflow.Provider>
  )
}

type UseWeaponAttackDialogProps = Omit<WeaponAttackDialogProps, keyof ControlledDialogProps<void>>

export const useWeaponAttackDialog = () => useDialog<void, UseWeaponAttackDialogProps>(
  (ctrl, props) => <WeaponAttackDialog ctrl={ctrl} {...props} />,
)
