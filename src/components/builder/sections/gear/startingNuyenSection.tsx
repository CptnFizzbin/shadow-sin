import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import {
  GearNuyenPerBuildPoint,
  useGearTotalCost,
} from "#/components/builder/buildPoints/hooks/useGearBuildPoints.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import { useDiceRoller } from "#/components/system/dice/useDiceRoller.ts"
import { formatNuyen, Nuyen } from "#/components/ui/nuyen.tsx"
import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"

export const StartingNuyenSection: FC = () => {
  const lifestyle = useCharacterSheet((state) => state.profile.lifestyle?.quality ?? LifestyleType.Street)
  const { numDice, mult } = Lifestyles[lifestyle].starting

  const totalNuyen = useGearTotalCost()
  // Unspent nuyen is the leftover from the last BP purchased.
  // e.g. spent 24,700¥ → buys 5 BP (25,000¥) → 300¥ unspent → +3 bonus
  const bpsPurchased = Math.ceil(totalNuyen / GearNuyenPerBuildPoint)
  const nuyenAllocated = bpsPurchased * GearNuyenPerBuildPoint
  const unspentNuyen = totalNuyen === 0 ? 0 : nuyenAllocated - totalNuyen
  const maxBonus = numDice * 3
  const bonus = Math.min(Math.floor(unspentNuyen / 100), maxBonus)

  const [diceResult, rollDice] = useDiceRoller(numDice, 1000)

  const hasRolled = diceResult.values.some((value) => value > 0)
  const diceSum = diceResult.values.reduce((sum, value) => sum + value, 0)
  const rolledTotal = hasRolled ? (diceSum + bonus) * mult : null

  const minResult = (numDice + bonus) * mult
  const maxResult = (numDice * 6 + bonus) * mult

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Divider />

      <Stack sx={{ gap: 1 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="subtitle2">Starting Nuyen</Typography>
          <Chip label={`Lifestyle: ${lifestyle}`} size="small" variant="outlined" />
        </Stack>

        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
            <DiceResult
              results={diceResult}
              highlightHits={false}
              highlightGlitches={false}
            />
            {bonus > 0 && (
              <Typography color="text.secondary">
                + {bonus}
              </Typography>
            )}
            <Typography color="text.secondary">
              × <Nuyen amount={mult} />
            </Typography>
          </Stack>
          {hasRolled && rolledTotal !== null
            ? (
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {formatNuyen(rolledTotal)}
                </Box>
              )
            : (
                <Typography color="text.secondary">
                  {formatNuyen(minResult)} – {formatNuyen(maxResult)}
                </Typography>
              )}
        </Stack>

        <Button size="small" variant="outlined" onClick={rollDice}>
          {hasRolled ? "Reroll" : "Roll"}
        </Button>

        {bonus > 0 && (
          <Typography color="text.secondary">
            + {bonus} bonus from {formatNuyen(unspentNuyen)} unspent (max + {maxBonus})
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
