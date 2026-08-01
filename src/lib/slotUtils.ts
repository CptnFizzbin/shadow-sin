import type { FC, ReactElement, ReactNode } from "react"
import { isValidElement } from "react"

export function isElementType<TProps>(...elementTypes: FC<TProps>[]) {
  return (item: ReactNode): item is ReactElement<TProps> => {
    return elementTypes.some((type) => isValidElement(item) && item.type === type)
  }
}
