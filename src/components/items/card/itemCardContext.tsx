import { createContext, useContext } from "react"

export interface ItemCardContextValue {
  hasOnClick: boolean
}

const ItemCardContext = createContext<ItemCardContextValue | null>(null)

export const ItemCardContextProvider = ItemCardContext.Provider

export function useItemCardContext(): ItemCardContextValue {
  const context = useContext(ItemCardContext)
  if (!context) {
    throw new Error("useItemCardContext must be used within an ItemCard")
  }
  return context
}
