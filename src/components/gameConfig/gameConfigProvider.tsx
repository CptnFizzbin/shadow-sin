import type { FC, PropsWithChildren } from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

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
  // Load-version token bumped on every consumer `setConfig`. The async load
  // only applies its result if its captured token still matches — prevents a
  // stale storage value from clobbering a newer config a consumer set while
  // the load was in flight. The `cancelled` flag handles unmount/storage
  // changes separately.
  const loadTokenRef = useRef(0)

  useEffect(() => {
    const token = ++loadTokenRef.current
    let cancelled = false
    loadGameConfig(storage)
      .then((loaded) => {
        if (cancelled || loaded === null || loadTokenRef.current !== token) return
        setConfigState(loaded)
      })
      .catch((error: unknown) => {
        console.error("Failed to load game config.", error)
      })
    return () => {
      cancelled = true
    }
  }, [storage])

  const setConfig = useCallback(
    (newConfig: GameConfig) => {
      loadTokenRef.current++
      setConfigState(newConfig)
      saveGameConfig(storage, newConfig).catch((error: unknown) => {
        console.error("Failed to save game config.", error)
      })
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
