import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"

export function useBuilderAwakeningType() {
  return useCharacterBuilderStore((state) => state.awakening)
}
