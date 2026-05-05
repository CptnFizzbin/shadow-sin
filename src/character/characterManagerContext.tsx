import type { FC, ReactNode } from "react"
import { createContext, useContext, useState } from "react"

import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"

import { CharacterManager } from "./characterManager.ts"

const CharacterManagerContext = createContext<CharacterManager | null>(null)

interface CharacterManagerProviderProps {
  children: ReactNode
  manager?: CharacterManager
}

export const CharacterManagerProvider: FC<CharacterManagerProviderProps> = ({ children, manager: managerProp }) => {
  const [manager] = useState(
    () => managerProp ?? new CharacterManager({ local: LocalStorageProvider.getStorage() }),
  )

  return (
    <CharacterManagerContext.Provider value={manager}>
      {children}
    </CharacterManagerContext.Provider>
  )
}

export function useCharacterManager(): CharacterManager {
  const manager = useContext(CharacterManagerContext)
  if (!manager) {
    throw new Error("useCharacterManager must be used within a CharacterManagerProvider")
  }
  return manager
}
