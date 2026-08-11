import { createSelector } from "reselect"

import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { ObjectUtils } from "#/lib/objectUtils.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"

const createAttrSelector = createSelector.withTypes<AttributesContextValue>()

export const selectAllAttrs = createAttrSelector([
  (attributesContext) => attributesContext.infos,
  (attributesContext) => attributesContext.values,
], (infos, values) => {
  return Object.fromEntries(
    ObjectUtils.keys(infos).map((key) => {
      // `values[key]` is the only stored value today — there's no separate augmentation-tracking
      // system yet, so `base` and `value` are identical for now. They stay distinct fields so call
      // sites can already say which one they mean, ahead of that system landing.
      const storedValue = values[key] ?? 0

      return [key, {
        min: infos[key].min,
        max: infos[key].max,
        augMax: infos[key].augMax ?? infos[key].max,

        /** The base value of the attribute, before any augments or effects */
        base: storedValue,

        /** The effective value of the attribute, after augmentations and other effects */
        value: storedValue,
      }]
    }),
  )
})

export const selectAttr = createAttrSelector(
  [
    selectAllAttrs,
    (_, key: AttributeKey) => key,
  ],
  (attrs, key) => attrs[key],
)
