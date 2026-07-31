import { AwakeningType } from "#/system/awakeningType.ts"

export const isTechnomancer = (awakeningType: AwakeningType): boolean => {
  return awakeningType === AwakeningType.Technomancer
}
