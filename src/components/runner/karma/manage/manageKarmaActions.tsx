import Button from "@mui/material/Button"
import type { FC } from "react"

import { SpendKarmaDialogFooter } from "#/components/runner/karma/improvements/spendKarmaDialogFooter.tsx"
import { useSpendKarmaSummary } from "#/hooks/improvements/useSpendKarmaSummary.ts"
import type { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { ManageKarmaStep, useManageKarmaWorkflow } from "./manageKarmaWorkflow.ts"
import { useKarmaExchange } from "./useKarmaExchange.ts"

interface ManageKarmaActionsProps {
  ctrl: DialogCtrl<void>
}

/**
 * The Manage Karma dialog's footer: Close on the menu, otherwise Cancel plus the current step's
 * confirm button, which applies the step and closes the dialog.
 * Must render under `ManageKarmaWorkflow.Provider` and `SpendKarmaDialogProvider`.
 */
export const ManageKarmaActions: FC<ManageKarmaActionsProps> = ({ ctrl }) => {
  const dispatch = useRunnerStoreDispatch()
  const workflow = useManageKarmaWorkflow()
  const { currentStep, data } = workflow
  const karma = useRunnerSelector(KarmaSelectors.select)
  const exchange = useKarmaExchange(currentStep === ManageKarmaStep.Buy ? "buy" : "sell", data.amount)
  const { saveImprovements } = useSpendKarmaSummary()

  const close = () => ctrl.close()

  const currentDelta = data.current - karma.current
  const totalDelta = data.total - karma.total
  const canExchange = data.amount > 0 && exchange.isAffordable

  const renderConfirm = (label: string, disabled: boolean, apply: () => void) => (
    <>
      <Button color="secondary" onClick={close}>Cancel</Button>
      <Button
        color="secondary"
        variant="contained"
        disabled={disabled}
        onClick={() => {
          apply()
          close()
        }}
      >
        {label}
      </Button>
    </>
  )

  switch (currentStep) {
    case ManageKarmaStep.Menu:
      return <Button color="secondary" onClick={close}>Close</Button>

    case ManageKarmaStep.Earn:
      return renderConfirm("Earn", data.amount < 1, () => dispatch(Actions.karma.addKarma(data.amount)))

    case ManageKarmaStep.Buy:
      return renderConfirm(
        "Buy",
        !canExchange,
        () => dispatch(Actions.karma.buyKarma(data.amount, exchange.nuyenPerKarma)),
      )

    case ManageKarmaStep.Spend:
      return (
        <SpendKarmaDialogFooter
          onCancel={close}
          onSave={() => {
            saveImprovements()
            close()
          }}
        />
      )

    case ManageKarmaStep.Sell:
      return renderConfirm(
        "Sell",
        !canExchange,
        () => dispatch(Actions.karma.sellKarma(data.amount, exchange.nuyenPerKarma)),
      )

    case ManageKarmaStep.Edit:
      return renderConfirm(
        "Save",
        currentDelta === 0 && totalDelta === 0,
        () => dispatch(Actions.karma.adjustKarma({ currentDelta, totalDelta, reason: data.reason })),
      )
  }
}
