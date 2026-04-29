import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { selectPhysicalCurrent, selectPhysicalMax, selectStunCurrent, selectStunMax } from "#/components/system/damage/damageSelectors.ts"
import { useDamageStore } from "#/components/system/damage/useDamageStore.ts"
import { useWoundModifier } from "#/components/system/damage/useWoundModifier.ts"
import { useGameEffects } from "#/components/system/gameEffects/useGameEffects.ts"
import { InitiativeSection } from "#/components/system/initiative/initiativeSection.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

import { MiniDamageTrack } from "./miniDamageTrack.tsx"

function effectLabel(effects: GameEffectData[]): string {
  const parts: string[] = []
  for (const e of effects) {
    if (e.type === GameEffectType.initiativeBonus) {
      parts.push(`${e.value > 0 ? "+" : ""}${e.value} Init`)
    } else if (e.type === GameEffectType.extraInitiativePasses) {
      parts.push(`+${e.value} IP`)
    } else if (e.type === GameEffectType.extraInitiativeDice) {
      parts.push(`+${e.value} Init Dice`)
    } else if (e.type === GameEffectType.attrMod && e.target) {
      parts.push(`${e.value > 0 ? "+" : ""}${e.value} ${e.target}`)
    } else if (e.type === GameEffectType.skillMod && e.target) {
      parts.push(`${e.value > 0 ? "+" : ""}${e.value} ${e.target}`)
    } else if (e.type === GameEffectType.generalPenalty) {
      parts.push(`${e.value > 0 ? "+" : ""}${e.value} all pools`)
    }
  }
  return parts.join(", ")
}

export const CombatHud: FC = () => {
  const damageStore = useDamageStore()
  const physicalCurrent = useSelector(damageStore, selectPhysicalCurrent)
  const physicalMax = useSelector(damageStore, selectPhysicalMax)
  const stunCurrent = useSelector(damageStore, selectStunCurrent)
  const stunMax = useSelector(damageStore, selectStunMax)
  const woundMod = useWoundModifier()

  const initBonuses = useGameEffects(GameEffectType.initiativeBonus)
  const extraPassEffects = useGameEffects(GameEffectType.extraInitiativePasses)
  const extraDiceEffects = useGameEffects(GameEffectType.extraInitiativeDice)

  const totalInitBonus = initBonuses.reduce((sum, e) => sum + e.value, 0)
  const totalExtraPasses = extraPassEffects.reduce((sum, e) => sum + e.value, 0)
  const totalExtraDice = extraDiceEffects.reduce((sum, e) => sum + e.value, 0)

  const activeSources = useCharacterSheetSelector(
    (sheet) => {
      const sources: { id: string, label: string }[] = []
      for (const spell of sheet.spells) {
        if (spell.sustained && spell.effects?.length) {
          const summary = effectLabel(spell.effects)
          sources.push({ id: spell.id, label: summary ? `${spell.name} (${summary})` : spell.name })
        }
      }
      for (const gear of Object.values(sheet.gear)) {
        if (gear.equipped && gear.effects?.length) {
          const summary = effectLabel(gear.effects)
          sources.push({ id: gear.id, label: summary ? `${gear.name} (${summary})` : gear.name })
        }
      }
      return sources
    },
    (a, b) => a.length === b.length && a.every((v, i) => v.id === b[i].id && v.label === b[i].label),
  )

  const hasStatus =
    woundMod > 0
    || totalInitBonus !== 0
    || totalExtraPasses > 0
    || totalExtraDice > 0
    || activeSources.length > 0

  return (
    <Stack sx={{ gap: 1.5 }}>
      <InitiativeSection />

      <Divider />

      {/* Wounds */}
      <Stack sx={{ gap: 0.5 }}>
        <Label label="Wounds" />
        <MiniDamageTrack label="P" current={physicalCurrent} max={physicalMax} />
        <MiniDamageTrack label="S" current={stunCurrent} max={stunMax} />
      </Stack>

      {/* Active effects / auras */}
      {hasStatus && (
        <>
          <Divider />
          <Stack sx={{ gap: 0.5 }}>
            <Label label="Status" />
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
              {woundMod > 0 && (
                <Chip label={`Wounds −${woundMod}`} color="error" size="small" variant="outlined" />
              )}
              {totalInitBonus !== 0 && (
                <Chip
                  label={`Init ${totalInitBonus > 0 ? "+" : ""}${totalInitBonus}`}
                  color={totalInitBonus > 0 ? "success" : "error"}
                  size="small"
                  variant="outlined"
                />
              )}
              {totalExtraPasses > 0 && (
                <Chip label={`+${totalExtraPasses} IP`} color="success" size="small" variant="outlined" />
              )}
              {totalExtraDice > 0 && (
                <Chip label={`+${totalExtraDice} Init dice`} color="success" size="small" variant="outlined" />
              )}
              {activeSources.map((source) => (
                <Chip key={source.id} label={source.label} color="info" size="small" variant="outlined" />
              ))}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  )
}
