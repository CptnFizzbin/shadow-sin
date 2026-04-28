import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { MiniDamageTrack } from "#/components/character/combat/miniDamageTrack.tsx"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { selectPhysicalCurrent, selectPhysicalMax, selectStunCurrent, selectStunMax } from "#/components/system/damage/damageSelectors.ts"
import { useDamageStore } from "#/components/system/damage/useDamageStore.ts"
import { useWoundModifier } from "#/components/system/damage/useWoundModifier.ts"
import { useGameEffects } from "#/components/system/gameEffects/useGameEffects.ts"
import { InitiativeSection } from "#/components/system/initiative/initiativeSection.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

export const CombatHud: FC = () => {
  const damageStore = useDamageStore()
  const physicalCurrent = useStore(damageStore, selectPhysicalCurrent)
  const physicalMax = useStore(damageStore, selectPhysicalMax)
  const stunCurrent = useStore(damageStore, selectStunCurrent)
  const stunMax = useStore(damageStore, selectStunMax)
  const woundMod = useWoundModifier()

  const initBonuses = useGameEffects(GameEffectType.initiativeBonus)
  const extraPassEffects = useGameEffects(GameEffectType.extraInitiativePasses)
  const extraDiceEffects = useGameEffects(GameEffectType.extraInitiativeDice)

  const totalInitBonus = initBonuses.reduce((sum, e) => sum + e.value, 0)
  const totalExtraPasses = extraPassEffects.reduce((sum, e) => sum + e.value, 0)
  const totalExtraDice = extraDiceEffects.reduce((sum, e) => sum + e.value, 0)

  const activeSources = useCharacterSheet(
    (sheet) => {
      const sources: string[] = []
      for (const spell of sheet.spells) {
        if (spell.sustained && spell.effects?.length) sources.push(spell.name)
      }
      for (const gear of Object.values(sheet.gear)) {
        if (gear.equipped && gear.effects?.length) sources.push(gear.name)
      }
      return sources
    },
    (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
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
                <Chip key={source} label={source} color="info" size="small" variant="outlined" />
              ))}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  )
}
