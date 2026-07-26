import Button from "@mui/material/Button"
import type { FC } from "react"
import { useMemo, useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ItemData } from "#/system/itemData.ts"

import { buildLicenseCheckResult } from "./licenseCheckAlerts.ts"
import { buildVerificationChecks } from "./licenseCheckChecks.ts"
import type { LicenseCheckState } from "./licenseCheckContext.tsx"
import { LicenseCheckProvider } from "./licenseCheckContext.tsx"
import { LicenseCheckResultView } from "./licenseCheckResultView.tsx"
import { LicenseCheckScanView } from "./licenseCheckScanView.tsx"
import { LicenseCheckSetupView } from "./licenseCheckSetupView.tsx"
import type { LicenseCheckResult, VerificationCheck, VerificationOutcome } from "./licenseCheckTypes.ts"

type LicenseCheckStep = "setup" | "scanning" | "result"

type LicenseCheckDialogProps = ControlledDialogProps<void>

const LicenseCheckDialog: FC<LicenseCheckDialogProps> = ({ ctrl }) => {
  const allGear = useRunnerStoreSelector(Selectors.gear.selectGear)
  const ratingPlusRating = useRunnerStoreSelector(
    Selectors.houseRules.select("items.licenseCheck.ratingPlusRating"),
  )
  const [selectedGear, setSelectedGear] = useState<ItemData[]>(Object.values(allGear))
  const licenseCheckState = useMemo((): LicenseCheckState => {
    return {
      items: selectedGear,
      setItems: (items) => setSelectedGear(items),
      addItem: (item) => setSelectedGear((items) => {
        return [...items, item]
      }),
      removeItem: (item) => setSelectedGear((items) => {
        return items.filter((i) => i.id !== item.id)
      }),
    }
  }, [selectedGear])

  const [step, setStep] = useState<LicenseCheckStep>("setup")
  const [scannerRating, setScannerRating] = useState(3)
  const [checks, setChecks] = useState<VerificationCheck[]>([])
  const [result, setResult] = useState<LicenseCheckResult | null>(null)

  const handleStartScan = () => {
    // Built fresh here from the Setup checklist's current checked selection, flattened and
    // shuffled into one queue the worker pool pulls from — unchecked items are never scanned.
    setChecks(buildVerificationChecks(allGear, selectedGear))
    setStep("scanning")
  }

  const handleScanComplete = (outcomes: VerificationOutcome[]) => {
    setResult(buildLicenseCheckResult(scannerRating, allGear, checks, outcomes))
    setStep("result")
  }

  return (
    <LicenseCheckProvider value={licenseCheckState}>
      <ControlledDialog ctrl={ctrl} maxWidth="lg" onClosed={() => setSelectedGear(Object.values(allGear))}>
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
              checks={checks}
              gear={allGear}
              scannerRating={scannerRating}
              ratingPlusRating={ratingPlusRating}
              onComplete={handleScanComplete}
            />
          )}
          {step === "result" && result && <LicenseCheckResultView result={result} gear={allGear} />}
        </Dialog.Content>

        <Dialog.Actions>
          {step === "setup"
            ? (
                <>
                  <Button onClick={() => ctrl.close()}>Cancel</Button>
                  <Button variant="contained" onClick={handleStartScan}>Start Scan</Button>
                </>
              )
            : (
                <Button variant="contained" onClick={() => ctrl.close()}>Close</Button>
              )}
        </Dialog.Actions>
      </ControlledDialog>
    </LicenseCheckProvider>
  )
}

export const useLicenseCheckDialog = () =>
  useDialog<void, void>((ctrl) => <LicenseCheckDialog ctrl={ctrl} />)
