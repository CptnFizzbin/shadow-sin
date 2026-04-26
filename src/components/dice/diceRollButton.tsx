import ClearIcon from "@mui/icons-material/Clear"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { DieIcon } from "#/components/system/dice/dieIcon.tsx"
import {
  countHits,
  isCriticalGlitch,
  isGlitch,
  rerollMisses,
  rollDice,
  rollDiceExploding,
  sumDice,
} from "#/system/dice/diceRoll.ts"

interface DiceRollButtonProps {
  count: number
  result?: number[]
  onRoll: (results: number[]) => void
  onClear?: () => void
  label?: string
  displayMode: "sum" | "hits"
  /**
   * When provided, shows an "Edge" button before rolling.
   * Uses Push the Limit: exploding 6s (Rule of Six).
   * Caller is responsible for spending the Edge point.
   */
  onEdgeBefore?: (results: number[]) => void
  /**
   * When provided, shows a "Second Chance" button after rolling.
   * Re-rolls all non-hits, preserving existing hits.
   * Caller is responsible for spending the Edge point.
   */
  onSecondChance?: (results: number[]) => void
}

export const DiceRollButton: FC<DiceRollButtonProps> = ({
  count,
  result,
  onRoll,
  onClear,
  label,
  displayMode,
  onEdgeBefore,
  onSecondChance,
}) => {
  const handleRoll = () => onRoll(rollDice(count))
  const handleEdgeBefore = () => onEdgeBefore?.(rollDiceExploding(count))

  if (!result) {
    return (
      <Stack direction="row" sx={{ gap: 0.5 }}>
        <Button variant="outlined" size="small" onClick={handleRoll}>
          {label ?? `Roll ${count}d6`}
        </Button>

        {onEdgeBefore && (
          <Button variant="outlined" size="small" color="warning" onClick={handleEdgeBefore}>
            Edge
          </Button>
        )}
      </Stack>
    )
  }

  const displayValue = displayMode === "sum" ? sumDice(result) : countHits(result)
  const criticalGlitch = isCriticalGlitch(result)
  const glitch = !criticalGlitch && isGlitch(result)

  const handleSecondChance = () => onSecondChance?.(rerollMisses(result))

  return (
    <Stack direction="row" sx={{ gap: 0.5, alignItems: "center", flexWrap: "wrap" }}>
      {result.map((value, i) => (
        <DieIcon key={i} value={value} />
      ))}

      <Typography variant="body2" sx={{ fontWeight: 700, px: 0.5 }}>
        = {displayValue}
      </Typography>

      {criticalGlitch && (
        <Typography variant="body2" color="error" sx={{ fontWeight: 700 }}>
          CRITICAL GLITCH
        </Typography>
      )}

      {glitch && (
        <Typography variant="body2" color="error">
          Glitch
        </Typography>
      )}

      {onSecondChance && (
        <Button variant="outlined" size="small" color="warning" onClick={handleSecondChance}>
          2nd Chance
        </Button>
      )}

      {onClear && (
        <IconButton size="small" onClick={onClear} aria-label="Clear roll">
          <ClearIcon fontSize="inherit" />
        </IconButton>
      )}
    </Stack>
  )
}
