import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import Grid from "@mui/material/Grid"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import {
  computeDrainValue,
  formatDrainFormula,
} from "#/components/Character/Spells/spell-drain-formula.ts"
import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { useAttr } from "#/components/Character/character-utils.ts"
import { useDamageApi } from "#/components/Damage/use-damage-api.ts"
import { DicePool } from "#/components/DicePool/dice-pool.tsx"
import {
  useDiceAttributeGroup,
  useDiceSkillGroup,
  useWoundDiceGroup,
} from "#/components/DicePool/use-dice-group.ts"
import { Label } from "#/components/UI/Text/label.tsx"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import type { SpellData } from "#/lib/system/magic/spell-data.ts"
import { SkillKey } from "#/lib/system/skill-key.ts"

const SpellcastingDicePool: FC = () => {
  const spellcastingGroup = useDiceSkillGroup(SkillKey.spellcasting)
  const woundGroup = useWoundDiceGroup()

  return (
    <DicePool
      name="Spellcasting"
      groups={[spellcastingGroup, woundGroup]}
    />
  )
}

interface DrainResistanceDicePoolProps {
  drainAttribute: AttributeKey
}

const DrainResistanceDicePool: FC<DrainResistanceDicePoolProps> = ({ drainAttribute }) => {
  const willpowerGroup = useDiceAttributeGroup(AttributeKey.willpower)
  const drainAttrGroup = useDiceAttributeGroup(drainAttribute)
  const woundGroup = useWoundDiceGroup()

  return (
    <DicePool
      name="Drain Resistance"
      groups={[willpowerGroup, drainAttrGroup, woundGroup]}
    />
  )
}

interface SpellCastContentProps {
  spell: SpellData
  initialForce: number
  magicAttr: number
  drainAttribute: AttributeKey
  onClose: () => void
}

const SpellCastContent: FC<SpellCastContentProps> = ({
  spell,
  initialForce,
  magicAttr,
  drainAttribute,
  onClose,
}) => {
  const [force, setForce] = useState<number>(initialForce)

  const maxForce = Math.max(1, magicAttr * 2)
  const forceOverMax = force > magicAttr
  const drainDv = computeDrainValue(force, spell)
  const drainIsPhysical = forceOverMax

  const damageApi = useDamageApi()

  const handleApplyDrain = (amount: number) => {
    if (amount <= 0) return
    if (drainIsPhysical) {
      damageApi.physical.setValue(Math.min(damageApi.physical.max, damageApi.physical.current + amount))
    } else {
      damageApi.stun.setValue(Math.min(damageApi.stun.max, damageApi.stun.current + amount))
    }
    onClose()
  }

  const drainAmountOptions = Array.from({ length: drainDv + 1 }, (_, i) => i)

  return (
    <Stack gap={1.5}>
      {/* Spell stats */}
      <Grid container spacing={1} columns={3}>
        <Grid size={1}>
          <Label label="Category" variant="outlined" />
          <Typography variant="body2" textAlign="center">
            {spell.category}
          </Typography>
        </Grid>
        <Grid size={1}>
          <Label label="Type" variant="outlined" />
          <Typography variant="body2" textAlign="center">
            {spell.type}
          </Typography>
        </Grid>
        <Grid size={1}>
          <Label label="Range" variant="outlined" />
          <Typography variant="body2" textAlign="center">
            {spell.range}
          </Typography>
        </Grid>
        <Grid size={1}>
          <Label label="Duration" variant="outlined" />
          <Typography variant="body2" textAlign="center">
            {spell.duration}
          </Typography>
        </Grid>
        {spell.dealsDamage && (
          <Grid size={1}>
            <Label label="Damage" variant="outlined" />
            <Typography variant="body2" textAlign="center">
              {spell.damage}
            </Typography>
          </Grid>
        )}
        <Grid size={1}>
          <Label label="Drain" variant="outlined" />
          <Typography variant="body2" textAlign="center">
            {formatDrainFormula(spell.drainValueMod)}
          </Typography>
        </Grid>
      </Grid>

      {spell.description && (
        <Typography variant="body2" color="text.secondary">
          {spell.description}
        </Typography>
      )}

      <Divider />

      {/* Cast section */}
      <Box
        sx={{
          border: "1px solid",
          borderColor: forceOverMax ? "error.main" : "divider",
          borderRadius: 1,
          padding: 1,
          bgcolor: forceOverMax ? "error.dark" : undefined,
        }}
      >
        <Stack gap={1}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Label label="Cast" variant="text" sx={{ flexShrink: 0 }} />
            {forceOverMax && (
              <Typography variant="caption" color="error.light">
                Force exceeds Magic — drain is Physical
              </Typography>
            )}
          </Stack>

          {/* Force selector */}
          <FormControl size="small" fullWidth>
            <InputLabel id="spell-force-label">Force</InputLabel>
            <Select
              labelId="spell-force-label"
              id="spell-force-select"
              value={force}
              label="Force"
              onChange={(e) => setForce(Number(e.target.value))}
            >
              {Array.from({ length: maxForce }, (_, i) => i + 1).map((forceValue) => (
                <MenuItem key={forceValue} value={forceValue}>
                  {forceValue}
                  {forceValue === magicAttr ? " (MAG)" : ""}
                  {forceValue > magicAttr ? " ⚠️" : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Dice pools */}
          <Grid container spacing={1} columns={2}>
            <Grid size={1}>
              <SpellcastingDicePool />
            </Grid>
            <Grid size={1}>
              <DrainResistanceDicePool drainAttribute={drainAttribute} />
            </Grid>
          </Grid>

          <Divider />

          {/* Quick apply drain */}
          <Stack gap={0.5}>
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

      <Button onClick={onClose} color="secondary" size="small">
        Close
      </Button>
    </Stack>
  )
}

interface SpellCastDialogProps {
  spell: SpellData
  open: boolean
  onClose: () => void
  onClosed?: () => void
}

export const SpellCastDialog: FC<SpellCastDialogProps> = ({ spell, open, onClose, onClosed }) => {
  const magicAttr = useAttr(AttributeKey.magic)
  const tradition = useCharacterSheet((sheet) => sheet.tradition)
  const drainAttribute = tradition?.drainAttribute ?? AttributeKey.willpower

  return (
    <Dialog open={open} onClose={onClose} onTransitionExited={onClosed} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 0 }}>{spell.name}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <SpellCastContent
          key={`${spell.id}-${open}`}
          spell={spell}
          initialForce={Math.max(1, magicAttr)}
          magicAttr={magicAttr}
          drainAttribute={drainAttribute}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
