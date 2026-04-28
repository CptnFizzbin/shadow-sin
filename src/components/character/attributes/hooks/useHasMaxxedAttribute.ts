import { useActiveAttributes } from "./useActiveAttributes.ts"

export const useHasMaxxedAttribute = (): boolean => {
  return useActiveAttributes().some((attr) => attr.value >= attr.max)
}
