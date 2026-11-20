import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { featureFlagNamespaces } from "#/system/model/featureFlags/featureFlagsData.ts"
import type { FeatureFlagOverrides } from "#/system/model/featureFlags/featureFlagsRegistry.ts"
import { featureFlagsRegistry } from "#/system/model/featureFlags/featureFlagsRegistry.ts"

export namespace FeatureFlagSelectors {
  /** The Runner's value for the feature flag `key`: its stored override, else the registry's `defaultValue`. */
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    SelectorOptions.key.featureFlag,
    (runner, key) => {
      const flag = featureFlagsRegistry[key]
      const overrides: FeatureFlagOverrides<typeof flag.type> | undefined =
        runner._data_.featureFlags[featureFlagNamespaces[flag.type]]
      return overrides?.[key] ?? flag.defaultValue
    },
  )
}
