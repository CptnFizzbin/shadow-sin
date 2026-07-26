import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { ItemData } from "#/system/itemData.ts"

export interface LicenseCheckState {
  items: ItemData[]

  setItems: (items: ItemData[]) => void
  addItem: (item: ItemData) => void
  removeItem: (item: ItemData) => void
}

export const LicenseCheckContext = createContext<LicenseCheckState>({
  items: [],

  setItems: () => {},
  addItem: () => {},
  removeItem: () => {},
})

export const LicenseCheckProvider: FC<PropsWithChildren<{ value: LicenseCheckState }>> = ({
  value,
  children,
}) => {
  return (
    <LicenseCheckContext.Provider value={value}>
      {children}
    </LicenseCheckContext.Provider>
  )
}

export const useLicenseCheck = () => useContext(LicenseCheckContext)
