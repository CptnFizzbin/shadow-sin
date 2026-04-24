import { AwakeningType } from "#/system/awakeningType.ts"

export const SpellsBpPerSpell = 3

export const isMagician = (awakeningType: AwakeningType) => {
  return (
    awakeningType === AwakeningType.Magician
    || awakeningType === AwakeningType.MysticAdept
  )
}

export const isAwakened = (awakeningType: AwakeningType) => {
  return (
    awakeningType === AwakeningType.Magician
    || awakeningType === AwakeningType.MysticAdept
    || awakeningType === AwakeningType.Adept
  )
}
