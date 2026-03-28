import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"

export function useBuilderAttrValue(attrKey: AttributeKey) {
  return useCharacterBuilderStore((state) => state.attributes[attrKey]?.value)
}
