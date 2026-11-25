import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { darken, lighten } from "@mui/material/styles"
import type { FC } from "react"
import { useState } from "react"

import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { withTheme } from "#/integrations/mui/muiUtils.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { TraditionSelectors } from "#/state/runner/tradition/tradition.selector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"
import type { SpellData } from "#/system/model/magic/spellData.ts"

import { DrainResistanceDicePool } from "./drainResistanceDicePool.tsx"
import { computeDrainValue } from "./spellDrainFormula.ts"
import { SpellcastingDicePool } from "./spellcastingDicePool.tsx"
import { SustainingFocusSelect } from "./sustainingFocusSelect.tsx"

interface SpellCastSectionProps {
  spell: SpellData
  onClose: () => void
  /** The Sustaining Foci free to hold the Spell; the focus picker shows only when there are some. */
  sustainingFoci?: FocusData[]
  /** The focus chosen to hold the Spell, which caps its Force. */
  sustainingFocus?: FocusData
  onSustainingFocusChange?: (focusId: string | null) => void
  /** Disables the focus picker, as while the Spell is already being sustained. */
  sustainingFocusLocked?: boolean
}

export const SpellCastSection: FC<SpellCastSectionProps> = ({
  spell,
  onClose,
  sustainingFoci = [],
  sustainingFocus,
  onSustainingFocusChange,
  sustainingFocusLocked,
}) => {
  const magicAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.magic })
  const tradition = useRunnerSelector(TraditionSelectors.select)
  const drainAttribute = tradition?.drainAttribute ?? AttributeKey.willpower

  const [chosenForce, setForce] = useState<number>(Math.max(1, magicAttr))
  const [drainResistanceHits, setDrainResistanceHits] = useState<number>(0)

  const maxForce = Math.max(1, Math.min(magicAttr * 2, sustainingFocus?.force ?? Infinity))
  // Choosing a focus can lower the cap below the Force already picked, so clamp rather than reset it.
  const force = Math.min(chosenForce, maxForce)
  const isOvercasting = force > magicAttr
  const drainDv = computeDrainValue(force, spell)
  const drainIsPhysical = isOvercasting
  const drainAmount = Math.max(0, drainDv - drainResistanceHits)

  const dispatch = useRunnerStoreDispatch()
  const physical = useRunnerSelector(DamageSelectors.track.physical)
  const stun = useRunnerSelector(DamageSelectors.track.stun)

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
      <Stack>
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Cast" variant="text" />
          {isOvercasting && (
            <Typography color="error.main">
              Force exceeds Magic — drain is Physical
            </Typography>
          )}
        </Stack>

        {sustainingFoci.length > 0 && onSustainingFocusChange && (
          <SustainingFocusSelect
            foci={sustainingFoci}
            value={sustainingFocus?.id ?? null}
            onChange={onSustainingFocusChange}
            disabled={sustainingFocusLocked}
          />
        )}

        <CounterInput
          id="spell-force-select"
          label="Force"
          size="small"
          fullWidth
          min={1}
          max={maxForce}
          value={force}
          onChange={(newValue) => setForce(newValue ?? 1)}
          helperText={[
            `Magic ${magicAttr}`,
            isOvercasting && "overcasting",
            sustainingFocus && `capped by ${sustainingFocus.name} (Force ${sustainingFocus.force})`,
          ].filter(Boolean).join(" — ")}
        />

        <Grid container spacing={1} columns={2}>
          <Grid size={1}>
            <SpellcastingDicePool spellCategory={spell.category} />
          </Grid>
          <Grid size={1}>
            <DrainResistanceDicePool drainAttribute={drainAttribute} />
          </Grid>
        </Grid>

        <Divider />

        <Stack sx={{ gap: 0.5 }}>
          <Label
            label={`Drain — DV ${drainDv} ${drainIsPhysical ? "Physical" : "Stun"}`}
            variant="text"
            color={drainIsPhysical ? "error.main" : "text.secondary"}
          />
          <CounterInput
            id="drain-resistance-hits-select"
            label="Resistance Hits"
            size="small"
            fullWidth
            min={0}
            value={drainResistanceHits}
            onChange={(newValue) => setDrainResistanceHits(newValue ?? 0)}
          />
          <Button
            variant="outlined"
            color={drainIsPhysical ? "error" : "primary"}
            fullWidth
            disabled={drainAmount <= 0}
            onClick={() => handleApplyDrain(drainAmount)}
          >
            Apply {drainAmount} drain
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
