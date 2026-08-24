import { useMemo, useState } from "react"

import { buildLicenseCheckResult } from "#/components/runner/licenseCheck/licenseCheckAlerts.ts"
import { buildVerificationChecks } from "#/components/runner/licenseCheck/licenseCheckChecks.ts"
import type {
  LicenseCheckResult,
  VerificationCheck,
  VerificationOutcome,
} from "#/components/runner/licenseCheck/licenseCheckTypes.ts"
import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ItemData } from "#/system/itemData.ts"

export type LicenseCheckStep = "setup" | "scanning" | "result"

export interface LicenseCheckState {
  step: LicenseCheckStep

  scannerRating: number
  setScannerRating: (rating: number) => void

  items: ItemData[]
  setItems: (items: ItemData[]) => void
  addItem: (item: ItemData) => void
  removeItem: (item: ItemData) => void

  checks: VerificationCheck[]
  result: LicenseCheckResult | null

  startScan: () => void
  completeScan: (outcomes: VerificationOutcome[]) => void
  reset: () => void
}

/**
 * Owns every piece of state the License Check dialog's steps share — setup selection, the
 * in-progress scan's queue, and the settled result — so views read it from `LicenseCheckProvider`
 * instead of receiving it as drilled props.
 */
export function useLicenseCheckState(): LicenseCheckState {
  const allGear = useRunnerSelector(ItemSelectors.selectAll)

  const [step, setStep] = useState<LicenseCheckStep>("setup")
  const [scannerRating, setScannerRating] = useState(3)
  const [items, setItems] = useState<ItemData[]>(() => Object.values(allGear))
  const [checks, setChecks] = useState<VerificationCheck[]>([])
  const [result, setResult] = useState<LicenseCheckResult | null>(null)

  return useMemo((): LicenseCheckState => ({
    step,

    scannerRating,
    setScannerRating,

    items,
    setItems,
    addItem: (item) => setItems((current) => [...current, item]),
    removeItem: (item) => setItems((current) => current.filter((i) => i.id !== item.id)),

    checks,
    result,

    startScan: () => {
      // Built fresh here from the Setup checklist's current checked selection, flattened and
      // shuffled into one queue the worker pool pulls from — unchecked items are never scanned.
      setChecks(buildVerificationChecks(allGear, items))
      setStep("scanning")
    },
    completeScan: (outcomes) => {
      setResult(buildLicenseCheckResult(scannerRating, allGear, checks, outcomes))
      setStep("result")
    },
    reset: () => {
      setStep("setup")
      setItems(Object.values(allGear))
    },
  }), [step, scannerRating, items, checks, result, allGear])
}
