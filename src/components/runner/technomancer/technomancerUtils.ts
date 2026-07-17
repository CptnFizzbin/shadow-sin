import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

/** @deprecated Use `BuilderConfig.technomancer.complexForms.bpCost.perRating` instead. */
export const ComplexFormBpPerRating = BuilderConfig.technomancer.complexForms.bpCost.perRating
/** @deprecated Use `BuilderConfig.technomancer.sprites.bpCost.perTask` instead. */
export const SpriteBpPerTask = BuilderConfig.technomancer.sprites.bpCost.perTask

export const isTechnomancer = (awakeningType: AwakeningType): boolean => {
  return awakeningType === AwakeningType.Technomancer
}
