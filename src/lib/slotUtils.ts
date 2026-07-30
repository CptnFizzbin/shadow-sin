import type { FC, ReactElement, ReactNode } from "react"
import { isValidElement } from "react"

export function isElementType<TProps>(elementType: FC<TProps>) {
  return (item: ReactNode): item is ReactElement<TProps> => {
    return isValidElement(item) && item.type === elementType
  }
}
