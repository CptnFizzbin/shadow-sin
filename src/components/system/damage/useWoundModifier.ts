import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { selectWoundInterval } from "#/components/system/damage/damageUtils.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

export function useWoundModifier() {
  return useCharacterSheet((sheet) => {
    const physicalInterval = selectWoundInterval(DamageTrackKey.physical)(sheet)
    const stunInterval = selectWoundInterval(DamageTrackKey.stun)(sheet)
    return (
      Math.floor(sheet.damage.physical / physicalInterval)
      + Math.floor(sheet.damage.stun / stunInterval)
    )
  })
}
