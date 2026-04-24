import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

/**
 * Hook to retrieve all game effects of a specific type from the character sheet.
 * This scans qualities, gear, spells, complex forms, and adept powers.
 */
export function useGameEffects<TEffect extends GameEffectData>(type: GameEffectType): TEffect[] {
  return useCharacterSheet((sheet) => {
    const allEffects: GameEffectData[] = []

    for (const quality of sheet.qualities) {
      if (quality.effects) {
        allEffects.push(...quality.effects)
      }
    }

    for (const gearItem of Object.values(sheet.gear)) {
      if (gearItem.effects && gearItem.equipped !== false) {
        allEffects.push(...gearItem.effects)
      }
    }

    for (const spell of sheet.spells) {
      if (spell.effects) {
        allEffects.push(...spell.effects)
      }
    }

    for (const complexForm of sheet.complexForms) {
      if (complexForm.effects) {
        allEffects.push(...complexForm.effects)
      }
    }

    for (const power of sheet.adeptPowers) {
      if (power.effects) {
        allEffects.push(...power.effects)
      }
    }

    return allEffects.filter((effect) => effect.type === type) as TEffect[]
  })
}
