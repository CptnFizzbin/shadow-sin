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
      // system yet, so `baseValue` and `value` are identical for now. They stay distinct fields so
      // call sites can already say which one they mean, ahead of that system landing.
      const storedValue = values[key] ?? 0

      return [key, {
        /** The minimum value allowed for the attribute (e.g. when editing a character). */
        min: infos[key].min,

        /** The maximum natural value allowed for the attribute, before augments. */
        max: infos[key].max,

        /** The maximum augmented value allowed for the attribute, after cyberware and drugs. */
        augMax: infos[key].augMax ?? infos[key].max,

        /** The current value of the attribute, before augments. */
        baseValue: storedValue,

        /** The effective current value of the attribute, after augments and drugs. */
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
