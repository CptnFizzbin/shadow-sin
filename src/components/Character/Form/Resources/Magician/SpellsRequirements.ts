import { AwakeningType } from "#/lib/system/types/awakeningType.ts"

export const SpellsBpPerSpell = 3

export const isMagician = (awakeningType: AwakeningType) => {
  return (
    awakeningType === AwakeningType.Magician ||
    awakeningType === AwakeningType.MysticAdept
  )
}
