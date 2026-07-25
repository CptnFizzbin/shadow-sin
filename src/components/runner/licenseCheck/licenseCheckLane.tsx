import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import { selectAllDice, useDiceRollerSelector } from "#/system/dice/diceRoller.selectors.ts"
import { DiceRoller } from "#/system/dice/diceRoller.ts"
import type { DieState } from "#/system/dice/dieState.ts"
import type { ItemData } from "#/system/itemData.ts"

import { isRealCredential, rollOpposedTest } from "./licenseCheckDice.ts"
import type { VerificationCheck, VerificationLane, VerificationOutcome } from "./licenseCheckTypes.ts"

const RESOLVED_HOLD_MS = 500

const kindLabel: Record<VerificationCheck["kind"], string> = {
  "sin": "SIN",
  "licensed-gear": "Licensed",
  "unlicensed-gear": "Unlicensed",
  "forbidden-gear": "Forbidden",
}

interface LicenseCheckLaneProps {
  lane: VerificationLane
  gear: Record<string, ItemData>
  scannerRating: number
  ratingPlusRating: boolean
  onLaneComplete: (outcomes: VerificationOutcome[]) => void
}

function DiceGroup({ label, dice }: { label: string, dice: DieState[] }) {
  if (dice.length === 0) return null

  // Settled dice sort low → high; while still rolling, keep pool order so dice don't jump around.
  const ordered = dice.every((die) => die.value !== null) ? [...dice].sort((a, b) => (a.value ?? 0) - (b.value ?? 0)) : dice

  return (
    <Stack direction="row" sx={{ gap: 0.75, alignItems: "center" }}>
      <Typography variant="caption" color="text.secondary" sx={{ width: 56, flexShrink: 0 }}>{label}</Typography>
      <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
        {ordered.map((die, index) => {
          const isHit = die.value !== null && die.value >= 5
          return (
            <Stack
              key={index}
              sx={{
                width: 20,
                height: 20,
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                borderColor: isHit ? "success.main" : "divider",
                borderRadius: 0.5,
                color: isHit ? "success.main" : "text.secondary",
                fontSize: "0.7rem",
                fontWeight: isHit ? "bold" : "normal",
              }}
            >
              {die.value ?? "?"}
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}

function ChecklistChip({ label, state }: { label: string, state: "queued" | "active" | "clear" | "flagged" }) {
  const color = state === "clear" ? "success" : state === "flagged" ? "error" : state === "active" ? "info" : "default"

  return (
    <Chip
      size="small"
      label={label}
      color={color}
      variant={state === "queued" ? "outlined" : "filled"}
      sx={{ height: 20, fontSize: "0.65rem" }}
    />
  )
}

export const LicenseCheckLane: FC<LicenseCheckLaneProps> = ({
  lane,
  gear,
  scannerRating,
  ratingPlusRating,
  onLaneComplete,
}) => {
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

    async function resolveCheck(): Promise<VerificationOutcome> {
      if (check.kind === "unlicensed-gear" || check.kind === "forbidden-gear") {
        return { itemId: check.itemId, status: "flagged" }
      }

      const rating = check.credentialRating
      if (rating === undefined || isRealCredential(rating)) {
        return { itemId: check.itemId, status: "clear" }
      }

      credentialRoller.reset()
      scannerRoller.reset()
      const { credentialHits, scannerHits, status } = await rollOpposedTest(
        credentialRoller,
        scannerRoller,
        rating,
        scannerRating,
        ratingPlusRating,
      )
      return { itemId: check.itemId, status, credentialHits, scannerHits }
    }

    resolveCheck().then((outcome) => {
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

  const currentCheck = lane.checks[currentIndex]
  const slotBorderColor = currentOutcome
    ? (currentOutcome.status === "clear" ? "success.main" : "error.main")
    : "divider"

  return (
    <Stack sx={{ gap: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, padding: 1 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <Typography sx={{ fontWeight: "bold" }}>{lane.title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {lane.checks.length}
          {" "}
          item
          {lane.checks.length === 1 ? "" : "s"}
        </Typography>
      </Stack>

      <Stack
        sx={{
          gap: 0.5,
          border: "1px dashed",
          borderColor: slotBorderColor,
          borderRadius: 1,
          padding: 1,
          minHeight: 72,
          justifyContent: "center",
        }}
      >
        {currentCheck
          ? (
              <>
                <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }} noWrap>
                    {gear[currentCheck.itemId]?.name ?? currentCheck.itemId}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{kindLabel[currentCheck.kind]}</Typography>
                </Stack>

                <DiceGroup label="You" dice={credentialDice} />
                <DiceGroup label="Scanner" dice={scannerDice} />

                <Typography
                  variant="caption"
                  color={currentOutcome ? (currentOutcome.status === "clear" ? "success.main" : "error.main") : "text.secondary"}
                >
                  {currentOutcome ? (currentOutcome.status === "clear" ? "Clear" : "Flagged") : "Scanning…"}
                </Typography>
              </>
            )
          : (
              <Typography variant="body2" color="success.main">Done</Typography>
            )}
      </Stack>

      <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
        {lane.checks.map((check, index) => {
          const state = index < currentIndex
            ? (outcomes[index]?.status ?? "clear")
            : (index === currentIndex ? "active" : "queued")
          return (
            <ChecklistChip
              key={check.itemId}
              label={gear[check.itemId]?.name ?? check.itemId}
              state={state}
            />
          )
        })}
      </Stack>
    </Stack>
  )
}
