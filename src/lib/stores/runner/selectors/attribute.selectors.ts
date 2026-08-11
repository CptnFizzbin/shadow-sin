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
      return [key, {
        min: infos[key].min,
        max: infos[key].max,
        augMax: infos[key].max,

        /** The base value of the attribute, before any augments or effects */
        base: infos[key].current,

        /** The effective value of the attribute, after augmentations and other effects */
        value: values[key],
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
