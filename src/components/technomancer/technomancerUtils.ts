import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const ComplexFormBpPerRating = 1
export const SpriteBpPerTask = 1

export const isTechnomancer = (awakeningType: AwakeningType): boolean => {
  return awakeningType === AwakeningType.Technomancer
}
