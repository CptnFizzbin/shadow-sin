import { useActiveAttributes } from "#/components/attributes/hooks/useActiveAttributes.ts"

export const useHasMaxxedAttribute = (): boolean => {
  return useActiveAttributes().some((attr) => attr.value >= attr.max)
}
