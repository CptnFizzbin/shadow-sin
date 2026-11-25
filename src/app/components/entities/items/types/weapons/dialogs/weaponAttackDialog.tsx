import Button from "@mui/material/Button"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import type { FC } from "react"

import { AttackCalculatorTitle } from "#/app/components/entities/items/attackCalculator/attackCalculatorTitle.tsx"
import {
  AttackWorkflow,
  AttackWorkflowStep,
  createAttackWorkflowData,
} from "#/app/components/entities/items/attackCalculator/attackWorkflow.ts"
import { AttackWorkflowContent } from "#/app/components/entities/items/attackCalculator/attackWorkflowContent.tsx"
import type { WeaponData } from "#/data/items/weaponData.ts"
import type { ControlledDialogProps } from "#/forms/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/forms/dialog/dialog.tsx"
import { useDialog } from "#/forms/dialog/useDialog.tsx"

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
