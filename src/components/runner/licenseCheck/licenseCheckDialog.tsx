import Button from "@mui/material/Button"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { buildLicenseCheckResult } from "./licenseCheckAlerts.ts"
import { buildVerificationLanes } from "./licenseCheckLanes.ts"
import { LicenseCheckResultView } from "./licenseCheckResultView.tsx"
import { LicenseCheckScanView } from "./licenseCheckScanView.tsx"
import { LicenseCheckSetupView } from "./licenseCheckSetupView.tsx"
import type { LicenseCheckResult, VerificationLane, VerificationOutcome } from "./licenseCheckTypes.ts"

type LicenseCheckStep = "setup" | "scanning" | "result"

type LicenseCheckDialogProps = ControlledDialogProps<void>

const LicenseCheckDialog: FC<LicenseCheckDialogProps> = ({ ctrl }) => {
  const allGear = useRunnerStoreSelector(Selectors.gear.selectGear)
  const ratingPlusRating = useRunnerStoreSelector(
    Selectors.houseRules.select("items.licenseCheck.ratingPlusRating"),
  )

  const [step, setStep] = useState<LicenseCheckStep>("setup")
  const [scannerRating, setScannerRating] = useState(3)
  const [lanes, setLanes] = useState<VerificationLane[]>([])
  const [result, setResult] = useState<LicenseCheckResult | null>(null)

  const handleStartScan = () => {
    // Built fresh here (never including stashed items) rather than reusing the Setup screen's
    // own "Show all items" display lanes, which may include stashed items for review only.
    setLanes(buildVerificationLanes(allGear))
    setStep("scanning")
  }

  const handleScanComplete = (outcomes: VerificationOutcome[]) => {
    setResult(buildLicenseCheckResult(scannerRating, lanes, outcomes))
    setStep("result")
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="lg">
      <Dialog.Title>License Check</Dialog.Title>

      <Dialog.Content dividers>
        {step === "setup" && (
          <LicenseCheckSetupView
            gear={allGear}
            scannerRating={scannerRating}
            onScannerRatingChange={setScannerRating}
          />
        )}
        {step === "scanning" && (
          <LicenseCheckScanView
            lanes={lanes}
            gear={allGear}
            scannerRating={scannerRating}
            ratingPlusRating={ratingPlusRating}
            onComplete={handleScanComplete}
          />
        )}
        {step === "result" && result && <LicenseCheckResultView result={result} gear={allGear} />}
      </Dialog.Content>

      <Dialog.Actions>
        {step === "setup" && (
          <>
            <Button onClick={() => ctrl.close()}>Cancel</Button>
            <Button variant="contained" onClick={handleStartScan}>Start Scan</Button>
          </>
        )}
        {step === "result" && (
          <Button variant="contained" onClick={() => ctrl.close()}>Close</Button>
        )}
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useLicenseCheckDialog = () =>
  useDialog<void, void>((ctrl) => <LicenseCheckDialog ctrl={ctrl} />)
