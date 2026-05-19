import { z } from "zod"

import type { FeatureFlagValue } from "./featureFlag.ts"
import type { OptionalRuleKey, optionalRulesRegistry } from "./optionalRulesRegistry.ts"

/**
 * Sparse set of optional rule overrides for a Runner or GameConfig.
 * An absent field means "use the SR4e default" from {@link optionalRulesRegistry}.
 */
export type OptionalRulesData = {
  [K in OptionalRuleKey]?: FeatureFlagValue<(typeof optionalRulesRegistry)[K]>
}
/**
 * Zod schema for {@link OptionalRulesData}.
 * Keep in sync with {@link optionalRulesRegistry}.
 */
export const OptionalRulesDataSchema = z.object({
  encumbranceEnabled: z.boolean().optional(),
}) satisfies z.ZodType<OptionalRulesData>
