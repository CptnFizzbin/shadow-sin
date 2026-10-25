import Button from "@mui/material/Button"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"

import { EarnKarmaStep } from "./earnKarmaStep.tsx"
import { EditKarmaStep } from "./editKarmaStep.tsx"
import { KarmaExchangeStep } from "./karmaExchangeStep.tsx"
import { ManageKarmaMenu } from "./manageKarmaMenu.tsx"
import type { ManageKarmaOptionKey } from "./manageKarmaOptions.ts"
import type { ManageKarmaStepProps } from "./manageKarmaStepProps.ts"
import { SpendKarmaStep } from "./spendKarmaStep.tsx"

interface ManageKarmaStepContentProps extends ManageKarmaStepProps {
  step: ManageKarmaOptionKey
}

const ManageKarmaStepContent: FC<ManageKarmaStepContentProps> = ({ step, ...stepProps }) => {
  switch (step) {
    case "earn":
      return <EarnKarmaStep {...stepProps} />
    case "buy":
      return <KarmaExchangeStep direction="buy" {...stepProps} />
    case "spend":
      return <SpendKarmaStep {...stepProps} />
    case "sell":
      return <KarmaExchangeStep direction="sell" {...stepProps} />
    case "edit":
      return <EditKarmaStep {...stepProps} />
  }
}

/**
 * Wizard for every change to a Runner's karma: opens on a menu of workflows (earn, buy, spend,
 * sell, edit), and each workflow can step back to that menu.
 */
export const ManageKarmaDialog: FC<ControlledDialogProps> = ({ ctrl }) => {
  const [step, setStep] = useState<ManageKarmaOptionKey | null>(null)
  const [hasLeftMenu, setHasLeftMenu] = useState(false)

  const handleSelectOption = (option: ManageKarmaOptionKey) => {
    setStep(option)
    setHasLeftMenu(true)
  }

  if (step !== null) {
    return <ManageKarmaStepContent step={step} ctrl={ctrl} onBack={() => setStep(null)} />
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" disableEnterTransition={hasLeftMenu}>
      <Dialog.Title>Manage Karma</Dialog.Title>
      <Dialog.Content>
        <ManageKarmaMenu onSelectOption={handleSelectOption} />
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Close</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useManageKarmaDialog = () => useDialog<void>((ctrl) => <ManageKarmaDialog ctrl={ctrl} />)
