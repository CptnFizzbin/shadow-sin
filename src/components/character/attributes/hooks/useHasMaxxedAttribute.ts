import { useActiveAttributes } from "#/components/character/attributes/hooks/useActiveAttributes.ts"

export const useHasMaxxedAttribute = (): boolean => {
  return useActiveAttributes().some((attr) => attr.value >= attr.max)
}
