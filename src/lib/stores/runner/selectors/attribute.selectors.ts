import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"

export interface AttributeFacets {
  baseValue: number
  info: AttributeInfo
}

/**
 * Not reselect-memoized — reads a Context snapshot (not `RunnerData`), and is plain property
 * access with nothing expensive to cache.
 */
export function selectAttributeFacets(attributesContext: AttributesContextValue, key: AttributeKey): AttributeFacets {
  return {
    baseValue: attributesContext.values[key] ?? 0,
    info: attributesContext.infos[key],
  }
}
