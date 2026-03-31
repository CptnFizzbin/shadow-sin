import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import { SkillKey } from "#/lib/system/SkillKey.ts"
import { AttributeKey, AttributeLabels } from "#/lib/system/attributeKey.ts"
import { DicePools } from "#/lib/system/dicePoolData.ts"
import type { DmgTrackKey, GameEffectData } from "#/lib/system/gameEffectData.ts"
import { GameEffectType } from "#/lib/system/gameEffectData.ts"

const effectTypeOptions = [
  { label: "Dice Pool Mod", value: GameEffectType.dicePoolMod },
  { label: "Attribute Mod", value: GameEffectType.attrMod },
  { label: "Skill Mod", value: GameEffectType.skillMod },
  { label: "Extra Initiative Passes", value: GameEffectType.extraInitiativePasses },
  { label: "Pain Tolerance", value: GameEffectType.painTolerance },
]

const attributeOptions = Object.values(AttributeKey).map((key) => ({
  label: `${key} (${AttributeLabels[key]})`,
  value: key,
}))

const skillOptions = Object.values(SkillKey).map((key) => ({
  label: key,
  value: key,
}))

const dicePoolOptions = Object.values(DicePools).map((pool) => ({
  label: pool.label,
  value: pool.key,
}))

const dmgTrackOptions: { label: string, value: DmgTrackKey }[] = [
  { label: "Physical", value: "physical" },
  { label: "Stun", value: "stun" },
]

function getTargetOptions(effectType: string): { label: string, value: string }[] | null {
  switch (effectType) {
    case GameEffectType.dicePoolMod:
      return dicePoolOptions
    case GameEffectType.attrMod:
      return attributeOptions
    case GameEffectType.skillMod:
      return skillOptions
    case GameEffectType.painTolerance:
      return dmgTrackOptions
    default:
      return null
  }
}

function getDefaultTarget(effectType: string): string | undefined {
  switch (effectType) {
    case GameEffectType.dicePoolMod:
      return Object.keys(DicePools)[0]
    case GameEffectType.attrMod:
      return AttributeKey.body
    case GameEffectType.skillMod:
      return SkillKey.perception
    case GameEffectType.painTolerance:
      return "physical" satisfies DmgTrackKey
    default:
      return undefined
  }
}

interface EffectRowProps {
  effect: GameEffectData
  onChange: (updated: GameEffectData) => void
  onRemove: () => void
}

const EffectRow: FC<EffectRowProps> = ({ effect, onChange, onRemove }) => {
  const targetOptions = getTargetOptions(effect.type)

  return (
    <Stack direction="row" gap={1} alignItems="flex-start" flexWrap="wrap">
      <FormControl size="small" sx={{ flex: "2 1 120px" }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={effect.type}
          label="Type"
          onChange={(e) => {
            const newType = e.target.value
            onChange({ ...effect, type: newType, target: getDefaultTarget(newType) })
          }}
        >
          {effectTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {targetOptions !== null && (
        <FormControl size="small" sx={{ flex: "2 1 120px" }}>
          <InputLabel>Target</InputLabel>
          <Select
            value={effect.target ?? ""}
            label="Target"
            onChange={(e) => onChange({ ...effect, target: e.target.value })}
          >
            {targetOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <MuiTextField
        label="Value"
        type="number"
        size="small"
        sx={{ flex: "1 1 60px", minWidth: 60 }}
        value={effect.value}
        onChange={(e) => onChange({ ...effect, value: Number(e.target.value) })}
        slotProps={{ htmlInput: { step: 1 } }}
      />

      <IconButton size="small" onClick={onRemove} sx={{ mt: 0.5 }}>
        <RiDeleteBin6Line size={16} />
      </IconButton>
    </Stack>
  )
}

const defaultEffectsValues: { effects?: GameEffectData[] } = { effects: [] }

export const EffectsFieldGroup = withFieldGroup({
  defaultValues: defaultEffectsValues,
  render: ({ group }) => {
    return (
      <group.AppField name="effects">
        {(field) => {
          const effects = (field.state.value as GameEffectData[]) ?? []

          return (
            <Stack gap={1}>
              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">Effects</Typography>
                <Button
                  size="small"
                  startIcon={<RiAddLine size={14} />}
                  onClick={() => {
                    field.handleChange([
                      ...effects,
                      {
                        type: GameEffectType.attrMod,
                        target: AttributeKey.body,
                        value: 0,
                      },
                    ])
                  }}
                >
                  Add Effect
                </Button>
              </Stack>

              {effects.map((effect, index) => (
                <EffectRow
                  key={`${effect.type}-${effect.target ?? "none"}-${index}`}
                  effect={effect}
                  onChange={(updated) => {
                    const newEffects = [...effects]
                    newEffects[index] = updated
                    field.handleChange(newEffects)
                  }}
                  onRemove={() => {
                    field.handleChange(effects.filter((_, i) => i !== index))
                  }}
                />
              ))}
            </Stack>
          )
        }}
      </group.AppField>
    )
  },
})
