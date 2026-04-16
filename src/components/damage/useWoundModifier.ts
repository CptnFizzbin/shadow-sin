import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { getWoundInterval } from "#/components/damage/damageUtils.ts"
import { DamageTrackKey } from "#/lib/system/damageTrackKey.ts"

export function useDamageTrack(track: "physical" | "stun") {
  return useCharacterSheet((state) => {
    const damage = state.damage
    return damage[track]
  })
}

export function useWoundModifier() {
  return useCharacterSheet((sheet) => {
    const physicalInterval = getWoundInterval(sheet, DamageTrackKey.physical)
    const stunInterval = getWoundInterval(sheet, DamageTrackKey.stun)
    return (
      Math.floor(sheet.damage.physical / physicalInterval)
      + Math.floor(sheet.damage.stun / stunInterval)
    )
  })
}
