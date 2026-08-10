import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"

export interface AttributeFacets {
  baseValue: number
  info: AttributeInfo
}

export interface RunnerAttributeCatalog {
  (key: AttributeKey): AttributeFacets
  infos: Record<AttributeKey, AttributeInfo>
}

export function buildAttributeCatalog(attributesContext: AttributesContextValue): RunnerAttributeCatalog {
  const catalog = (key: AttributeKey): AttributeFacets => ({
    baseValue: attributesContext.values[key] ?? 0,
    info: attributesContext.infos[key],
  })

  return Object.assign(catalog, { infos: attributesContext.infos })
}
