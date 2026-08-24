import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useEffect } from "react"

import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import { formatNuyen, Nuyen } from "#/components/ui/nuyen.tsx"
import { useGearTotalCost } from "#/hooks/builder/buildPoints/useGearBuildPoints.ts"
import { useDiceRoller } from "#/hooks/system/dice/useDiceRoller.ts"
import { Actions as BuilderActions } from "#/stores/builder/builderStore.actions.ts"
import { useBuilderStoreDispatch } from "#/stores/builder/builderStore.dispatch.ts"
import { Selectors as BuilderSelectors, useBuilderStoreSelector } from "#/stores/builder/builderStore.selectors.ts"
import { Actions as RunnerActions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors as RunnerSelectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { selectSettledDice, selectWasRolled, useDiceRollerSelector } from "#/system/dice/diceRoller.selectors.ts"
import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"

export const StartingNuyenSection: FC = () => {
  const lifestyle = useRunnerStoreSelector((state) => state.profile.lifestyle?.quality ?? LifestyleType.Street)
  const { numDice, mult } = Lifestyles[lifestyle].starting

  const totalNuyen = useGearTotalCost()
  // Unspent nuyen is the leftover from the last BP purchased.
  // e.g. spent 24,700¥ → buys 5 BP (25,000¥) → 300¥ unspent → +3 bonus
  const bpsPurchased = Math.ceil(totalNuyen / BuilderConfig.gear.nuyenPerBp)
  const nuyenAllocated = bpsPurchased * BuilderConfig.gear.nuyenPerBp
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

  const builderDispatch = useBuilderStoreDispatch()
  const startingNuyen = useBuilderStoreSelector(BuilderSelectors.nuyen.selectStartingNuyen)

  const runnerDispatch = useRunnerStoreDispatch()
  const currentNuyen = useRunnerStoreSelector(RunnerSelectors.nuyen.selectNuyenAmount)

  // Persist a completed roll so it survives navigating away from this section (and the dice
  // roller resetting) and back.
  useEffect(() => {
    if (rolledTotal !== null && rolledTotal !== startingNuyen) {
      builderDispatch(BuilderActions.nuyen.setStartingNuyen(rolledTotal))
    }
  }, [rolledTotal, startingNuyen, builderDispatch])

  // A roll this session takes priority; otherwise fall back to a roll persisted earlier.
  const resolvedNuyen = rolledTotal ?? startingNuyen ?? null
  const isResolved = resolvedNuyen !== null
  const isApplied = isResolved && currentNuyen === resolvedNuyen

  const handleReset = () => {
    if (hasRolled) diceRoller.reset()
    builderDispatch(BuilderActions.nuyen.setStartingNuyen(undefined))
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Divider />

      <Stack>
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
          {resolvedNuyen !== null
            ? (
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {formatNuyen(resolvedNuyen)}
                </Box>
              )
            : (
                <Typography color="text.secondary">
                  {formatNuyen(minResult)} – {formatNuyen(maxResult)}
                </Typography>
              )}
        </Stack>

        {isResolved && !hasRolled && (
          <Typography color="text.secondary" variant="caption">
            From an earlier roll
          </Typography>
        )}

        <ButtonGroup fullWidth>
          <Button size="small" variant="outlined" onClick={() => diceRoller.rollAll()}>
            {isResolved ? "Reroll" : "Roll"}
          </Button>

          {isResolved && (
            <Button size="small" variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          )}
        </ButtonGroup>

        {resolvedNuyen !== null && (
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            disabled={isApplied}
            onClick={() => runnerDispatch(RunnerActions.nuyen.setNuyenAmount(resolvedNuyen))}
          >
            {isApplied ? "Applied to Nuyen" : "Apply to Nuyen"}
          </Button>
        )}

        {bonus > 0 && (
          <Typography color="text.secondary">
            + {bonus} bonus from {formatNuyen(unspentNuyen)} unspent (max + {maxBonus})
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
