import { useActiveAttributes } from "#/components/Attributes/Hooks/UseActiveAttributes.ts"

export const useHasMaxxedAttribute = (): boolean => {
  return useActiveAttributes().some((attr) => attr.value >= attr.max)
}
