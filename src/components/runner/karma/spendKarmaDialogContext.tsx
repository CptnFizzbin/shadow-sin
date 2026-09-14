import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useMemo } from "react"

import { ImprovementStore } from "#/services/improvements/improvementStore.ts"
import { OutOfContextError } from "#/utils/errors/outOfContextError.ts"

interface SpendKarmaDialogContextValue {
  improvementStore: ImprovementStore
}

const SpendKarmaDialogContext = createContext<SpendKarmaDialogContextValue | null>(null)

export const SpendKarmaDialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const improvementStore = useMemo(() => new ImprovementStore(), [])

  return (
    <SpendKarmaDialogContext.Provider value={{ improvementStore }}>
      {children}
    </SpendKarmaDialogContext.Provider>
  )
}

export const useSpendKarmaDialogContext = (): SpendKarmaDialogContextValue => {
  const contextValue = useContext(SpendKarmaDialogContext)
  if (!contextValue) throw new OutOfContextError("useSpendKarmaDialogContext", "SpendKarmaDialogProvider")
  return contextValue
}
