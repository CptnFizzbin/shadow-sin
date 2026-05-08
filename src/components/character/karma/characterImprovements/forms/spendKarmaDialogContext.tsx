import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useMemo } from "react"

import { ImprovementsStore } from "#/components/character/karma/characterImprovements/improvementsStore.ts"
import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

interface SpendKarmaDialogContextValue {
  improvementsStore: ImprovementsStore
}

const SpendKarmaDialogContext = createContext<SpendKarmaDialogContextValue | null>(null)

export const SpendKarmaDialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const improvementsStore = useMemo(() => new ImprovementsStore({ improvements: [] }), [])

  return (
    <SpendKarmaDialogContext.Provider value={{ improvementsStore }}>
      {children}
    </SpendKarmaDialogContext.Provider>
  )
}

export const useSpendKarmaDialogContext = (): SpendKarmaDialogContextValue => {
  const contextValue = useContext(SpendKarmaDialogContext)
  if (!contextValue) throw new OutOfContextError("useSpendKarmaDialogContext", "SpendKarmaDialogProvider")
  return contextValue
}
