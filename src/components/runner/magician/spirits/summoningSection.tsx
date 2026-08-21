import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { DrainResistanceDicePool } from "#/components/runner/magician/spells/drainResistanceDicePool.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useAttrValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerSelector, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { TraditionSelectors } from "#/lib/stores/runner/tradition/traditionSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { SpiritType } from "#/system/magic/spiritData.ts"

import { SummoningDicePool } from "./summoningDicePool.tsx"

interface SummoningSectionProps {
  spiritType: SpiritType
  force: number
  isBound: boolean
}

export const SummoningSection: FC<SummoningSectionProps> = ({ spiritType, force, isBound }) => {
  const magicAttr = useAttrValue(AttributeKey.magic)
  const tradition = useRunnerSelector(TraditionSelectors.select)
  const drainAttribute = tradition?.drainAttribute ?? AttributeKey.willpower

  const isOverforce = force > magicAttr
  const drainIsPhysical = isOverforce

  const dispatch = useRunnerStoreDispatch()
  const physical = useRunnerStoreSelector(Selectors.damage.selectPhysicalTrack)
  const stun = useRunnerStoreSelector(Selectors.damage.selectStunTrack)

  const handleApplyDrain = (amount: number) => {
    if (amount <= 0) return
    if (drainIsPhysical) {
      dispatch(Actions.damage.setDamage({
        track: DamageTrackKey.physical,
        value: Math.min(physical.max, physical.current + amount),
      }))
    } else {
      dispatch(Actions.damage.setDamage({
        track: DamageTrackKey.stun,
        value: Math.min(stun.max, stun.current + amount),
      }))
    }
  }

  const drainAmountOptions = Array.from({ length: force + 1 }, (_, i) => i)

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: isOverforce ? "error.main" : "divider",
        borderRadius: 1,
        padding: 1,
        bgcolor: isOverforce
          ? "rgba(var(--mui-palette-error-mainChannel) / 0.15)"
          : undefined,
      }}
    >
      <Stack>
        <Stack sx={{ gap: 0.5 }}>
          <Label label={isBound ? "Bind" : "Summon"} variant="text" />
          {isOverforce && (
            <Typography color="error.main">
              Force exceeds Magic — drain is Physical
            </Typography>
          )}
        </Stack>

        <Grid container spacing={1} columns={2}>
          <Grid size={1}>
            <SummoningDicePool spiritType={spiritType} isBound={isBound} />
          </Grid>
          <Grid size={1}>
            <DrainResistanceDicePool drainAttribute={drainAttribute} />
          </Grid>
        </Grid>

        <Divider />

        <Stack sx={{ gap: 0.5 }}>
          <Label
            label={`Apply Drain — ${drainIsPhysical ? "Physical" : "Stun"}`}
            variant="text"
            color={drainIsPhysical ? "error.main" : "text.secondary"}
          />
          <ButtonGroup size="small" variant="outlined" fullWidth>
            {drainAmountOptions.map((amount) => (
              <Button
                key={amount}
                color={drainIsPhysical ? "error" : "primary"}
                onClick={() => handleApplyDrain(amount)}
              >
                {amount}
              </Button>
            ))}
          </ButtonGroup>
        </Stack>
      </Stack>
    </Box>
  )
}
