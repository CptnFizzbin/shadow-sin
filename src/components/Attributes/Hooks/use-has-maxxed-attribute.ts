import { useActiveAttributes } from "#/components/Attributes/Hooks/use-active-attributes.ts"

export const useHasMaxxedAttribute = (): boolean => {
  return useActiveAttributes().some((attr) => attr.value >= attr.max)
}
