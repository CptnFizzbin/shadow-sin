import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { selectAllAttrs, selectAttr } from "./attribute.selectors.ts"

export const attrSelectorsCatalog = (attributesContext: AttributesContextValue) => ({
  all: (_state: RunnerData) => selectAllAttrs(attributesContext),
  forAttr: (key: AttributeKey) => ({
    value: (_state: RunnerData) => selectAttr(attributesContext, key).value,
    max: (_state: RunnerData) => selectAttr(attributesContext, key).max,
    augMax: (_state: RunnerData) => selectAttr(attributesContext, key).augMax,
  }),
})
