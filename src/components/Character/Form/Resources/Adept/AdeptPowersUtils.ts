import { AwakeningType } from "#/lib/system/types/awakeningType.ts"

export const isAdept = (awakeningType: AwakeningType) => {
  return (
    awakeningType === AwakeningType.Adept ||
    awakeningType === AwakeningType.MysticAdept
  )
}
