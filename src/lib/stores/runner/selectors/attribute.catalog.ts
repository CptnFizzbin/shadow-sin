import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import type { AttributeKey } from "#/system/attributeKey.ts"

import type { AttributeFacets } from "./attribute.selectors.ts"
import { selectAttributeFacets } from "./attribute.selectors.ts"

export function buildAttributeCatalog(attributesContext: AttributesContextValue) {
  const catalog = (key: AttributeKey): AttributeFacets => selectAttributeFacets(attributesContext, key)
  return Object.assign(catalog, { infos: attributesContext.infos })
}
