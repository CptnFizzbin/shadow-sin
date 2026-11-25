import { AwakeningType } from "./awakeningType.ts"

export const isMagician = (awakeningType: AwakeningType) => {
  return (
    awakeningType === AwakeningType.Magician
    || awakeningType === AwakeningType.MysticAdept
  )
}
