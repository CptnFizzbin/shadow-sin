import Button from "@mui/material/Button"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { LicenseCheckProvider, useLicenseCheck } from "#/contexts/runner/licenseCheckContext.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"

import { LicenseCheckResultView } from "./licenseCheckResultView.tsx"
import { LicenseCheckScanView } from "./licenseCheckScanView.tsx"
import { LicenseCheckSetupView } from "./licenseCheckSetupView.tsx"

type LicenseCheckDialogProps = ControlledDialogProps<void>

// Inner component that consumes LicenseCheckProvider context
const LicenseCheckDialogInner: FC<LicenseCheckDialogProps> = ({ ctrl }) => {
  const { step, result, startScan, reset } = useLicenseCheck()

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="lg" onClosed={reset}>
      <Dialog.Title>License Check</Dialog.Title>

      <Dialog.Content dividers>
        {step === "setup" && <LicenseCheckSetupView />}
        {step === "scanning" && <LicenseCheckScanView />}
        {step === "result" && result && <LicenseCheckResultView />}
      </Dialog.Content>

      <Dialog.Actions>
        {step === "setup"
          ? (
              <>
                <Button onClick={() => ctrl.close()}>Cancel</Button>
                <Button variant="contained" onClick={startScan}>Start Scan</Button>
              </>
            )
          : (
              <Button variant="contained" onClick={() => ctrl.close()}>Close</Button>
            )}
      </Dialog.Actions>
    </ControlledDialog>
  )
}

const LicenseCheckDialog: FC<LicenseCheckDialogProps> = ({ ctrl }) => (
  <LicenseCheckProvider>
    <LicenseCheckDialogInner ctrl={ctrl} />
  </LicenseCheckProvider>
)

export const useLicenseCheckDialog = () =>
  useDialog<void, void>((ctrl) => <LicenseCheckDialog ctrl={ctrl} />)
