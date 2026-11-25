import { AwakeningType } from "./awakeningType.ts"

export const isTechnomancer = (awakeningType: AwakeningType): boolean => {
  return awakeningType === AwakeningType.Technomancer
}
