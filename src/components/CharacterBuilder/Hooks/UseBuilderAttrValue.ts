import { useAttr } from "#/components/Character/CharacterUtils.ts"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"

export function useBuilderAttrValue(attrKey: AttributeKey) {
  return useAttr(attrKey)
}
