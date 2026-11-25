import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import type { FC } from "react"

import { SpendKarmaDialogProvider } from "#/components/runner/karma/spendKarmaDialogContext.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { ManageKarmaActions } from "./manageKarmaActions.tsx"
import { ManageKarmaMenu } from "./manageKarmaMenu.tsx"
import { ManageKarmaStepEarn } from "./manageKarmaStep.earn.tsx"
import { ManageKarmaStepEdit } from "./manageKarmaStep.edit.tsx"
import { ManageKarmaStepExchange } from "./manageKarmaStep.exchange.tsx"
import { ManageKarmaStepSpend } from "./manageKarmaStep.spend.tsx"
import { ManageKarmaTitle } from "./manageKarmaTitle.tsx"
import { createManageKarmaData, ManageKarmaStep, ManageKarmaWorkflow, useManageKarmaWorkflow } from "./manageKarmaWorkflow.ts"

/** Must render under `ManageKarmaWorkflow.Provider` and `SpendKarmaDialogProvider`. */
const ManageKarmaDialogContent: FC<ControlledDialogProps> = ({ ctrl }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))
  const workflow = useManageKarmaWorkflow()
  const isOnMenu = workflow.currentStep === ManageKarmaStep.Menu

  return (
    <ControlledDialog
      ctrl={ctrl}
      maxWidth="sm"
      // Only Spend Karma's long category lists need the whole screen on a phone.
      fullScreen={isNarrowViewport && workflow.currentStep === ManageKarmaStep.Spend}
      // Backdrop/Escape close only on the menu, so a half-filled step isn't lost by a stray click.
      onClose={isOnMenu ? undefined : false}
    >
      <Dialog.Title>
        <ManageKarmaTitle />
      </Dialog.Title>

      <Dialog.Content>
        <ManageKarmaWorkflow.Step step={ManageKarmaStep.Menu}>
          <ManageKarmaMenu />
        </ManageKarmaWorkflow.Step>
        <ManageKarmaWorkflow.Step step={ManageKarmaStep.Earn}>
          <ManageKarmaStepEarn />
        </ManageKarmaWorkflow.Step>
        <ManageKarmaWorkflow.Step step={ManageKarmaStep.Buy}>
          <ManageKarmaStepExchange direction="buy" />
        </ManageKarmaWorkflow.Step>
        <ManageKarmaWorkflow.Step step={ManageKarmaStep.Spend}>
          <ManageKarmaStepSpend />
        </ManageKarmaWorkflow.Step>
        <ManageKarmaWorkflow.Step step={ManageKarmaStep.Sell}>
          <ManageKarmaStepExchange direction="sell" />
        </ManageKarmaWorkflow.Step>
        <ManageKarmaWorkflow.Step step={ManageKarmaStep.Edit}>
          <ManageKarmaStepEdit />
        </ManageKarmaWorkflow.Step>
      </Dialog.Content>

      <Dialog.Actions>
        <ManageKarmaActions ctrl={ctrl} />
      </Dialog.Actions>
    </ControlledDialog>
  )
}

/**
 * Wizard for every change to a Runner's karma: opens on a menu of workflows (earn, buy, spend,
 * sell, edit), and each workflow can step back to that menu.
 */
export const ManageKarmaDialog: FC<ControlledDialogProps> = ({ ctrl }) => {
  const karma = useRunnerSelector(KarmaSelectors.select)

  return (
    <ManageKarmaWorkflow.Provider initialStep={ManageKarmaStep.Menu} initialData={createManageKarmaData(karma)}>
      <SpendKarmaDialogProvider>
        <ManageKarmaDialogContent ctrl={ctrl} />
      </SpendKarmaDialogProvider>
    </ManageKarmaWorkflow.Provider>
  )
}

export const useManageKarmaDialog = () => useDialog<void>((ctrl) => <ManageKarmaDialog ctrl={ctrl} />)
