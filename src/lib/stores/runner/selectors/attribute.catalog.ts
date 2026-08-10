import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"

import type { AttributeFacets } from "./attribute.selectors.ts"
import { selectAttributeFacets } from "./attribute.selectors.ts"

export interface RunnerAttributeCatalog {
  (key: AttributeKey): AttributeFacets
  infos: Record<AttributeKey, AttributeInfo>
}

export function buildAttributeCatalog(attributesContext: AttributesContextValue): RunnerAttributeCatalog {
  const catalog = (key: AttributeKey): AttributeFacets => selectAttributeFacets(attributesContext, key)
  return Object.assign(catalog, { infos: attributesContext.infos })
}
