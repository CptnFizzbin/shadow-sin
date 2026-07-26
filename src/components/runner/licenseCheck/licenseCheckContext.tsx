import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import type { LicenseCheckState } from "./licenseCheckState.ts"
import { useLicenseCheckState } from "./licenseCheckState.ts"

const LicenseCheckContext = createContext<LicenseCheckState | null>(null)

export const LicenseCheckProvider: FC<PropsWithChildren> = ({ children }) => {
  const state = useLicenseCheckState()

  return (
    <LicenseCheckContext.Provider value={state}>
      {children}
    </LicenseCheckContext.Provider>
  )
}

export const useLicenseCheck = (): LicenseCheckState => {
  const contextValue = useContext(LicenseCheckContext)
  if (!contextValue) throw new OutOfContextError("useLicenseCheck", "LicenseCheckProvider")
  return contextValue
}
