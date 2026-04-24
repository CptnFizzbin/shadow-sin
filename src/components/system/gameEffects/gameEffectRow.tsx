import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"
import * as React from "react"

import { getDefaultTarget, getTargetOptions } from "#/components/system/gameEffects/gameEffectUtils.ts"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { GameEffectTypeOptions } from "#/system/gameEffects/gameEffectTypeOptions.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

const CUSTOM_SENTINEL = "__custom__"

function isCustomSpec(skillName: SkillKey, specialization: string): boolean {
  const info = skillList[skillName]
  const fixedSpecs = (info?.specializations ?? []).filter((s): s is string => typeof s === "string")
  return specialization !== "" && !fixedSpecs.includes(specialization)
}

interface GameEffectRowProps {
  effect: GameEffectData
  onChange: (updated: GameEffectData) => void
  onRemove: () => void
}

export const GameEffectRow: FC<GameEffectRowProps> = ({ effect, onChange, onRemove }) => {
  const targetOptions = getTargetOptions(effect.type)

  const shouldUseCustomMode =
    effect.type === GameEffectType.skillSpecializationMod
    && !!effect.target
    && !!effect.subTarget
    && Object.values(SkillKey).includes(effect.target as SkillKey)
    && isCustomSpec(effect.target as SkillKey, effect.subTarget)

  const [customModeActive, setCustomModeActive] = React.useState<boolean>(() => shouldUseCustomMode)

  React.useEffect(() => {
    setCustomModeActive(shouldUseCustomMode)
  }, [shouldUseCustomMode])

  const selectedSkillName = effect.target as SkillKey
  const selectedSkillInfo = selectedSkillName ? skillList[selectedSkillName] : undefined
  const allSpecs = selectedSkillInfo?.specializations ?? []
  const fixedSpecs = allSpecs.filter((s): s is string => typeof s === "string")
  const customEntries = allSpecs.filter(
    (s): s is { custom: true, placeholder: string } =>
      typeof s === "object"
      && s !== null
      && "custom" in s
      && s.custom === true
      && "placeholder" in s
      && typeof s.placeholder === "string",
  )
  const hasFixed = fixedSpecs.length > 0
  const hasCustom = customEntries.length > 0

  const customPlaceholder = customEntries
    .map((entry) => entry.placeholder)
    .filter((p, i, arr) => arr.indexOf(p) === i)
    .join(" / ")

  const dropdownValue = customModeActive ? CUSTOM_SENTINEL : (effect.subTarget ?? "")
  const showCustomTextField = hasCustom && (customModeActive || !hasFixed)

  return (
    <Stack sx={{ gap: 1 }}>
      {/* Top Row: Type and Delete Button */}
      <Stack direction="row" sx={{ gap: 1, alignItems: "flex-start" }}>
        <FormControl size="small" sx={{ flexGrow: 1 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={effect.type}
            label="Type"
            onChange={(e) => {
              const newType = e.target.value
              onChange({ ...effect, type: newType, target: getDefaultTarget(newType), subTarget: undefined })
              setCustomModeActive(false)
            }}
          >
            {GameEffectTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          size="small"
          onClick={onRemove}
          sx={{ mt: 0.5 }}
          aria-label="Remove effect"
          title="Remove effect"
        >
          <RiDeleteBin6Line size={16} />
        </IconButton>
      </Stack>

      {/* Second Row: Extra Fields (Target, Specialization) and Value */}
      <Stack
        sx={{
          gap: 1,
          alignItems: "stretch",
          pl: 2,
          ml: 1,
          borderLeft: "2px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap", alignItems: "flex-start" }}>
          {targetOptions !== null && (
            <FormControl size="small" sx={{ flex: "1 1 120px" }}>
              <InputLabel>Target</InputLabel>
              <Select
                value={effect.target ?? ""}
                label="Target"
                onChange={(e) => {
                  onChange({ ...effect, target: e.target.value, subTarget: undefined })
                  setCustomModeActive(false)
                }}
              >
                {targetOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {effect.type === GameEffectType.skillSpecializationMod && (
            <Stack sx={{ flex: "1 1 120px", gap: 1 }}>
              {hasFixed && (
                <FormControl size="small" fullWidth>
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    value={dropdownValue}
                    label="Specialization"
                    onChange={(e) => {
                      const value = e.target.value as string
                      if (value === CUSTOM_SENTINEL) {
                        setCustomModeActive(true)
                        onChange({ ...effect, subTarget: "" })
                      } else {
                        setCustomModeActive(false)
                        onChange({ ...effect, subTarget: value })
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select specialization...</em>
                    </MenuItem>
                    {fixedSpecs.map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                    {hasCustom && (
                      <MenuItem value={CUSTOM_SENTINEL}>
                        <em>Custom...</em>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              )}

              {showCustomTextField && (
                <MuiTextField
                  label={hasFixed ? "Custom Specialization" : "Specialization"}
                  placeholder={customPlaceholder}
                  value={effect.subTarget ?? ""}
                  onChange={(e) => onChange({ ...effect, subTarget: e.target.value })}
                  size="small"
                  fullWidth
                  autoFocus={customModeActive && hasFixed}
                />
              )}

              {!hasFixed && !hasCustom && (
                <FormControl size="small" fullWidth disabled>
                  <InputLabel>Specialization</InputLabel>
                  <Select value="" label="Specialization">
                    <MenuItem value="">
                      <em>None available</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            </Stack>
          )}

          <MuiTextField
            label="Value"
            type="number"
            size="small"
            sx={{ width: 80 }}
            value={effect.value}
            onChange={(e) => {
              const numVal = (e.target as HTMLInputElement).valueAsNumber
              if (!Number.isNaN(numVal)) {
                onChange({ ...effect, value: numVal })
              }
            }}
            slotProps={{ htmlInput: { step: 1 } }}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
