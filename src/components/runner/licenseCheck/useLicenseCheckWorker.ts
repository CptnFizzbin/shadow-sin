import { milliseconds } from "date-fns"
import { useEffect, useMemo, useRef, useState } from "react"

import { selectAllDice, useDiceRollerSelector } from "#/system/dice/diceRoller.selectors.ts"
import { DiceRoller } from "#/system/dice/diceRoller.ts"
import type { DieState } from "#/system/dice/dieState.ts"

import { resolveVerificationCheck } from "./licenseCheckDice.ts"
import type { VerificationQueue } from "./licenseCheckQueue.ts"
import type { VerificationCheck, VerificationOutcome } from "./licenseCheckTypes.ts"

const RESOLVED_HOLD_MS = milliseconds({ seconds: 1 })

interface UseLicenseCheckWorkerArgs {
  queue: VerificationQueue
  scannerRating: number
  ratingPlusRating: boolean
  onOutcome: (outcome: VerificationOutcome) => void
  onIdle: () => void
}

interface UseLicenseCheckWorkerResult {
  currentCheck: VerificationCheck | null
  currentOutcome: VerificationOutcome | null
  credentialDice: DieState[]
  scannerDice: DieState[]
}

/**
 * One worker in the scan's pool: claims a check off the shared queue, runs its Opposed Test, holds
 * the result on screen, then claims the next one — repeating until the queue is empty.
 */
export function useLicenseCheckWorker({
  queue,
  scannerRating,
  ratingPlusRating,
  onOutcome,
  onIdle,
}: UseLicenseCheckWorkerArgs): UseLicenseCheckWorkerResult {
  const credentialRoller = useMemo(() => new DiceRoller(), [])
  const scannerRoller = useMemo(() => new DiceRoller(), [])

  const [currentCheck, setCurrentCheck] = useState<VerificationCheck | null>(() => queue.next() ?? null)
  const [currentOutcome, setCurrentOutcome] = useState<VerificationOutcome | null>(null)

  const onOutcomeRef = useRef(onOutcome)
  useEffect(() => {
    onOutcomeRef.current = onOutcome
  })
  const onIdleRef = useRef(onIdle)
  useEffect(() => {
    onIdleRef.current = onIdle
  })

  const credentialDice = useDiceRollerSelector(credentialRoller, selectAllDice)
  const scannerDice = useDiceRollerSelector(scannerRoller, selectAllDice)

  useEffect(() => {
    if (!currentCheck) {
      onIdleRef.current()
      return
    }

    let cancelled = false

    resolveVerificationCheck(currentCheck, credentialRoller, scannerRoller, scannerRating, ratingPlusRating).then((outcome) => {
      if (cancelled) return
      setCurrentOutcome(outcome)

      setTimeout(() => {
        if (cancelled) return
        onOutcomeRef.current(outcome)
        setCurrentOutcome(null)
        setCurrentCheck(queue.next() ?? null)
      }, RESOLVED_HOLD_MS)
    })

    return () => {
      cancelled = true
    }
  }, [currentCheck, credentialRoller, scannerRoller, scannerRating, ratingPlusRating, queue])

  return { currentCheck, currentOutcome, credentialDice, scannerDice }
}
