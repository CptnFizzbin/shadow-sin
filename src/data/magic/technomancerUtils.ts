import { AwakeningType } from "#/system/model/magic/awakeningType.ts"

export const isTechnomancer = (awakeningType: AwakeningType): boolean => {
  return awakeningType === AwakeningType.Technomancer
}
