import type { FC, PropsWithChildren } from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { loadGameConfig, saveGameConfig } from "#/gameConfig/gameConfigUtils.ts"
import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import type { AsyncJsonStorage } from "#/lib/storage/asyncStorage.ts"
import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"
import type { GameConfig } from "#/system/gameConfig.ts"
import { defaultGameConfig } from "#/system/gameConfig.ts"

interface GameConfigContextValue {
  config: GameConfig
  setConfig: (config: GameConfig) => void
}

const GameConfigContext = createContext<GameConfigContextValue | null>(null)

interface GameConfigProviderProps extends PropsWithChildren {
  /**
   * Optional storage injection point. Defaults to the app's
   * {@link LocalStorageProvider}. Tests pass an in-memory storage so each
   * suite gets isolation.
   */
  storage?: AsyncJsonStorage
}

/**
 * Mounts the GM-layer GameConfig at the app root. Loads the persisted
 * config from {@link AsyncJsonStorage} on mount (falling back to
 * {@link defaultGameConfig}) and persists any updates made via the
 * exposed `setConfig`.
 */
export const GameConfigProvider: FC<GameConfigProviderProps> = ({ children, storage: storageProp }) => {
  const [storage] = useState<AsyncJsonStorage>(() => storageProp ?? LocalStorageProvider.getStorage())
  const [config, setConfigState] = useState<GameConfig>(defaultGameConfig)

  useEffect(() => {
    let cancelled = false
    void loadGameConfig(storage).then((loaded) => {
      if (cancelled || loaded === null) return
      setConfigState(loaded)
    })
    return () => {
      cancelled = true
    }
  }, [storage])

  const setConfig = useCallback(
    (newConfig: GameConfig) => {
      setConfigState(newConfig)
      void saveGameConfig(storage, newConfig)
    },
    [storage],
  )

  const value = useMemo<GameConfigContextValue>(() => ({ config, setConfig }), [config, setConfig])

  return <GameConfigContext.Provider value={value}>{children}</GameConfigContext.Provider>
}

export function useGameConfig(): GameConfigContextValue {
  const ctx = useContext(GameConfigContext)
  if (!ctx) {
    throw new OutOfContextError("useGameConfig", "GameConfigProvider")
  }
  return ctx
}
