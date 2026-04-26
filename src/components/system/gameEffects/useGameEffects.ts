import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import type { EffectByType, GameEffectData } from "#/system/gameEffects/gameEffectData.ts"

/**
 * Hook to retrieve all game effects of a specific type from the character sheet.
 * This scans qualities, gear, spells, complex forms, and adept powers.
 */
export function useGameEffects<T extends keyof EffectByType>(type: T): EffectByType[T][] {
  return useCharacterSheet(
    (sheet) => {
      const allEffects: GameEffectData[] = []

      for (const quality of sheet.qualities) {
        if (quality.effects) {
          allEffects.push(...quality.effects)
        }
      }

      for (const gearItem of Object.values(sheet.gear)) {
        if (gearItem.effects && gearItem.equipped === true) {
          allEffects.push(...gearItem.effects)
        }
      }

      for (const spell of sheet.spells) {
        if (spell.effects && spell.sustained === true) {
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

      return allEffects.filter((effect) => effect.type === type) as EffectByType[T][]
    },
    (a, b) => a.length === b.length && a.every((val, index) => val === b[index]),
  )
}
