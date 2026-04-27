import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiCloseLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useManualStatusEntries, useManualStatusStore } from "#/components/system/manualStatus/useManualStatusStore.ts"
import { CounterField } from "#/components/ui/counter/counterField.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { AttributeKey, AttributeLabels, AttributeOrder } from "#/system/attributeKey.ts"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { ManualStatus } from "#/system/manualStatus.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

type SupportedEffectType =
  | GameEffectType.attrMod
  | GameEffectType.skillMod
  | GameEffectType.initiativeBonus
  | GameEffectType.extraInitiativePasses
  | GameEffectType.extraInitiativeDice

const EFFECT_TYPE_LABELS: Record<SupportedEffectType, string> = {
  [GameEffectType.attrMod]: "Attribute modifier",
  [GameEffectType.skillMod]: "Skill modifier",
  [GameEffectType.initiativeBonus]: "Initiative bonus",
  [GameEffectType.extraInitiativePasses]: "Extra initiative passes",
  [GameEffectType.extraInitiativeDice]: "Extra initiative dice",
}

const NEEDS_ATTR_TARGET = new Set<SupportedEffectType>([GameEffectType.attrMod])
const NEEDS_SKILL_TARGET = new Set<SupportedEffectType>([GameEffectType.skillMod])

function singleEffectLabel(effect: GameEffectData): string {
  const sign = effect.value > 0 ? "+" : ""
  switch (effect.type) {
    case GameEffectType.attrMod:
      return `${sign}${effect.value} ${effect.target ?? ""}`
    case GameEffectType.skillMod:
      return `${sign}${effect.value} ${effect.target ?? ""}`
    case GameEffectType.initiativeBonus:
      return `${sign}${effect.value} Init`
    case GameEffectType.extraInitiativePasses:
      return `+${effect.value} IP`
    case GameEffectType.extraInitiativeDice:
      return `+${effect.value} Init Dice`
    default:
      return `${sign}${effect.value}`
  }
}

interface AddFormState {
  label: string
  effectType: SupportedEffectType
  attrTarget: AttributeKey
  skillTarget: SkillKey
  value: number
}

const DEFAULT_FORM: AddFormState = {
  label: "",
  effectType: GameEffectType.attrMod,
  attrTarget: AttributeKey.body,
  skillTarget: SkillKey.pistols,
  value: 1,
}

function buildEffect(form: AddFormState): GameEffectData {
  if (NEEDS_ATTR_TARGET.has(form.effectType)) {
    return { type: form.effectType, target: form.attrTarget, value: form.value }
  }
  if (NEEDS_SKILL_TARGET.has(form.effectType)) {
    return { type: form.effectType, target: form.skillTarget, value: form.value }
  }
  return { type: form.effectType, value: form.value }
}

export const ManualStatusPanel: FC = () => {
  const store = useManualStatusStore()
  const entries = useManualStatusEntries(store)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AddFormState>(DEFAULT_FORM)

  const handleAdd = () => {
    if (!form.label.trim()) return
    const status: ManualStatus = {
      id: crypto.randomUUID(),
      label: form.label.trim(),
      effect: buildEffect(form),
    }
    store.add(status)
    setForm(DEFAULT_FORM)
    setShowForm(false)
  }

  const handleCancel = () => {
    setForm(DEFAULT_FORM)
    setShowForm(false)
  }

  const needsAttrTarget = NEEDS_ATTR_TARGET.has(form.effectType)
  const needsSkillTarget = NEEDS_SKILL_TARGET.has(form.effectType)

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Label label="Modifiers" />
        <Stack direction="row" sx={{ gap: 0.5 }}>
          {entries.length > 0 && (
            <Button size="small" color="error" onClick={() => store.clear()}>
              Clear all
            </Button>
          )}
          {!showForm && (
            <IconButton size="small" onClick={() => setShowForm(true)}>
              <RiAddLine size={18} />
            </IconButton>
          )}
        </Stack>
      </Stack>

      {entries.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          {entries.map((entry) => (
            <Stack
              key={entry.id}
              direction="row"
              sx={{ alignItems: "center", gap: 1 }}
            >
              <Typography sx={{ flexGrow: 1 }} variant="body2">
                {entry.label}
              </Typography>
              <Chip
                label={singleEffectLabel(entry.effect)}
                size="small"
                color="warning"
                variant="outlined"
              />
              <IconButton size="small" onClick={() => store.remove(entry.id)}>
                <RiCloseLine size={16} />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}

      {showForm && (
        <>
          {entries.length > 0 && <Divider />}
          <Stack sx={{ gap: 1.5 }}>
            <TextField
              label="Label"
              size="small"
              fullWidth
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="e.g. Increase Body (3 hits)"
            />

            <FormControl size="small" fullWidth>
              <InputLabel>Effect type</InputLabel>
              <Select
                label="Effect type"
                value={form.effectType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    effectType: e.target.value as SupportedEffectType,
                  }))}
              >
                {(Object.keys(EFFECT_TYPE_LABELS) as SupportedEffectType[]).map((t) => (
                  <MenuItem key={t} value={t}>
                    {EFFECT_TYPE_LABELS[t]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {needsAttrTarget && (
              <FormControl size="small" fullWidth>
                <InputLabel>Attribute</InputLabel>
                <Select
                  label="Attribute"
                  value={form.attrTarget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, attrTarget: e.target.value as AttributeKey }))}
                >
                  {AttributeOrder.map((key) => (
                    <MenuItem key={key} value={key}>
                      {AttributeLabels[key]} ({key})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {needsSkillTarget && (
              <FormControl size="small" fullWidth>
                <InputLabel>Skill</InputLabel>
                <Select
                  label="Skill"
                  value={form.skillTarget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, skillTarget: e.target.value as SkillKey }))}
                >
                  {Object.values(SkillKey).map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <CounterField
              label="Value"
              size="small"
              value={form.value}
              onChange={(v) => setForm((f) => ({ ...f, value: v ?? 1 }))}
              min={-10}
              max={10}
            />

            <Stack direction="row" sx={{ gap: 1, justifyContent: "flex-end" }}>
              <Button size="small" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleAdd}
                disabled={!form.label.trim()}
              >
                Add
              </Button>
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  )
}
