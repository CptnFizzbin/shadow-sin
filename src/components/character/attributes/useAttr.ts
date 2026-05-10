import { AttributeKey } from "#/system/attributeKey.ts"

import { useAttrValue } from "./attributesProvider.tsx"

/**
 * Hook to retrieve the current value of an attribute.
 * Reads from the nearest `AttributesProvider` in the tree.
 *
 * @deprecated Prefer `useAttrValue` from `attributesProvider.tsx` directly.
 *   This wrapper exists for backwards compatibility and adds an Essence guard.
 * @throws if called with `AttributeKey.essence` — use `useEssenceInfo` instead.
 */
export const useAttr = (attribute: AttributeKey): number => {
  if (attribute === AttributeKey.essence) {
    throw new Error("Use useEssenceInfo for the Essence attribute")
  }

  return useAttrValue(attribute)
}
