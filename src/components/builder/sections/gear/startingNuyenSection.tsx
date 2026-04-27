import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
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
import { selectSettledDice, selectWasRolled, useDiceRollerSelector } from "#/system/dice/diceRoller.selectors.ts"
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

  const diceRoller = useDiceRoller(numDice)
  const dice = useDiceRollerSelector(diceRoller, selectSettledDice)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const diceSum = dice.reduce((sum, die) => sum + die.value, 0)

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
              roller={diceRoller}
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

        <ButtonGroup fullWidth>
          <Button size="small" variant="outlined" onClick={() => diceRoller.rollAll()}>
            {hasRolled ? "Reroll" : "Roll"}
          </Button>

          {hasRolled && (
            <Button size="small" variant="outlined" onClick={() => diceRoller.reset()}>
              Reset
            </Button>
          )}
        </ButtonGroup>

        {bonus > 0 && (
          <Typography color="text.secondary">
            + {bonus} bonus from {formatNuyen(unspentNuyen)} unspent (max + {maxBonus})
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
