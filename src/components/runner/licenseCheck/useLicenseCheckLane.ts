import { useEffect, useMemo, useRef, useState } from "react"

import { selectAllDice, useDiceRollerSelector } from "#/system/dice/diceRoller.selectors.ts"
import { DiceRoller } from "#/system/dice/diceRoller.ts"
import type { DieState } from "#/system/dice/dieState.ts"

import { resolveVerificationCheck } from "./licenseCheckDice.ts"
import type { VerificationCheck, VerificationLane, VerificationOutcome } from "./licenseCheckTypes.ts"

const RESOLVED_HOLD_MS = 500

interface UseLicenseCheckLaneArgs {
  lane: VerificationLane
  scannerRating: number
  ratingPlusRating: boolean
  onLaneComplete: (outcomes: VerificationOutcome[]) => void
}

interface UseLicenseCheckLaneResult {
  currentCheck: VerificationCheck | undefined
  currentIndex: number
  currentOutcome: VerificationOutcome | null
  outcomes: VerificationOutcome[]
  credentialDice: DieState[]
  scannerDice: DieState[]
}

/** Runs a lane's checks strictly in sequence, one Opposed Test at a time, and reports each outcome as it settles. */
export function useLicenseCheckLane({
  lane,
  scannerRating,
  ratingPlusRating,
  onLaneComplete,
}: UseLicenseCheckLaneArgs): UseLicenseCheckLaneResult {
  const credentialRoller = useMemo(() => new DiceRoller(), [])
  const scannerRoller = useMemo(() => new DiceRoller(), [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentOutcome, setCurrentOutcome] = useState<VerificationOutcome | null>(null)
  const [outcomes, setOutcomes] = useState<VerificationOutcome[]>([])

  const onLaneCompleteRef = useRef(onLaneComplete)
  useEffect(() => {
    onLaneCompleteRef.current = onLaneComplete
  })

  const credentialDice = useDiceRollerSelector(credentialRoller, selectAllDice)
  const scannerDice = useDiceRollerSelector(scannerRoller, selectAllDice)

  useEffect(() => {
    if (currentIndex >= lane.checks.length) {
      onLaneCompleteRef.current(outcomes)
      return
    }

    let cancelled = false
    const check = lane.checks[currentIndex]

    resolveVerificationCheck(check, credentialRoller, scannerRoller, scannerRating, ratingPlusRating).then((outcome) => {
      if (cancelled) return
      setCurrentOutcome(outcome)

      setTimeout(() => {
        if (cancelled) return
        setOutcomes((prev) => [...prev, outcome])
        setCurrentOutcome(null)
        setCurrentIndex((index) => index + 1)
      }, RESOLVED_HOLD_MS)
    })

    return () => {
      cancelled = true
    }
  }, [currentIndex, lane.checks, credentialRoller, scannerRoller, scannerRating, ratingPlusRating, outcomes])

  return {
    currentCheck: lane.checks[currentIndex],
    currentIndex,
    currentOutcome,
    outcomes,
    credentialDice,
    scannerDice,
  }
}
