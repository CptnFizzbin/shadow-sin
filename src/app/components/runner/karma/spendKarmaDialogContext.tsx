import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useMemo } from "react"

import { OutOfContextError } from "#common/errors/outOfContextError.ts"
import { ImprovementStore } from "#state/improvements/improvementStore.ts"

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
