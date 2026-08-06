import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { darken, lighten } from "@mui/material/styles"
import type { FC } from "react"
import { useState } from "react"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { withTheme } from "#/integrations/mui/muiUtils.ts"
import { useAttrValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { SpellData } from "#/system/magic/spellData.ts"

import { DrainResistanceDicePool } from "./drainResistanceDicePool.tsx"
import { computeDrainValue } from "./spellDrainFormula.ts"
import { SpellcastingDicePool } from "./spellcastingDicePool.tsx"

interface SpellCastSectionProps {
  spell: SpellData
  onClose: () => void
}

export const SpellCastSection: FC<SpellCastSectionProps> = ({ spell, onClose }) => {
  const magicAttr = useAttrValue(AttributeKey.magic)
  const tradition = useRunnerStoreSelector((sheet) => sheet.tradition)
  const drainAttribute = tradition?.drainAttribute ?? AttributeKey.willpower

  const [force, setForce] = useState<number>(Math.max(1, magicAttr))

  const maxForce = Math.max(1, magicAttr * 2)
  const isOvercasting = force > magicAttr
  const drainDv = computeDrainValue(force, spell)
  const drainIsPhysical = isOvercasting

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
    onClose()
  }

  const drainAmountOptions = Array.from({ length: drainDv + 1 }, (_, i) => i)

  return (
    <Box
      sx={withTheme({
        base: () => ({
          border: "1px solid",
          borderColor: isOvercasting ? "error.main" : "divider",
          borderRadius: 1,
          padding: 1,
        }),
        light: (theme) => ({
          bgcolor: isOvercasting
            ? lighten(theme.palette.error.light, 0.9)
            : undefined,
        }),
        dark: (theme) => ({
          bgcolor: isOvercasting
            ? darken(theme.palette.error.light, 0.9)
            : undefined,
        }),
      })}
    >
      <Stack sx={{ gap: 1 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Cast" variant="text" />
          {isOvercasting && (
            <Typography color="error.main">
              Force exceeds Magic — drain is Physical
            </Typography>
          )}
        </Stack>

        <CounterInput
          id="spell-force-select"
          label="Force"
          size="small"
          fullWidth
          min={1}
          max={maxForce}
          value={force}
          onChange={(newValue) => setForce(newValue ?? 1)}
          helperText={`Magic ${magicAttr}${isOvercasting ? " — overcasting" : ""}`}
        />

        <Grid container spacing={1} columns={2}>
          <Grid size={1}>
            <SpellcastingDicePool />
          </Grid>
          <Grid size={1}>
            <DrainResistanceDicePool drainAttribute={drainAttribute} />
          </Grid>
        </Grid>

        <Divider />

        <Stack sx={{ gap: 0.5 }}>
          <Label
            label={`Apply Drain — DV ${drainDv} ${drainIsPhysical ? "Physical" : "Stun"}`}
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
